"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  archiveMarketingCampaign,
  createMarketingCampaign,
  softDeleteMarketingCampaign,
  updateMarketingCampaign,
  SupabaseServerConfigError,
  type MarketingCampaignInput,
} from "@/lib/marketing-campaigns-db";
import {
  INTERN_SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/auth/intern-session";
import {
  ALLOWED_CAMPAIGN_DESTINATION_PATHS,
  isInternalCampaignDestination,
  slugify,
  type CampaignStatus,
  type UtmMedium,
} from "@/lib/marketing-campaigns";
import {
  deactivateCampaignBuilderPreset,
  findOrCreateCampaignBuilderPreset,
  type CampaignBuilderPreset,
  type PresetCategory,
} from "@/lib/campaign-builder-presets-db";

export type CampaignActionState = {
  ok: boolean;
  message: string;
};

export type PresetActionState = {
  ok: boolean;
  message: string;
  preset?: CampaignBuilderPreset;
  removedPresetId?: string;
};

const OK_CREATE = "Kampagne wurde erstellt.";
const OK_UPDATE = "Kampagne wurde gespeichert.";
const OK_ARCHIVE = "Kampagne wurde archiviert.";
const OK_DELETE = "Kampagne wurde gelöscht.";

export async function createCampaignAction(
  _prevState: CampaignActionState,
  formData: FormData
): Promise<CampaignActionState> {
  const auth = await requireInternSession();
  if (!auth.ok) return auth;

  try {
    await createMarketingCampaign(parseCampaignInput(formData));
    revalidatePath("/intern/marketing");
    return { ok: true, message: OK_CREATE };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateCampaignAction(
  _prevState: CampaignActionState,
  formData: FormData
): Promise<CampaignActionState> {
  const auth = await requireInternSession();
  if (!auth.ok) return auth;

  const id = readRequired(formData, "id");
  if (!id) {
    return { ok: false, message: "Kampagnen-ID fehlt." };
  }

  try {
    await updateMarketingCampaign(id, parseCampaignInput(formData));
    revalidatePath("/intern/marketing");
    return { ok: true, message: OK_UPDATE };
  } catch (error) {
    return actionError(error);
  }
}

export async function createBuilderPresetAction(
  _prevState: PresetActionState,
  formData: FormData
): Promise<PresetActionState> {
  const auth = await requireInternSession();
  if (!auth.ok) return { ok: false, message: auth.message };

  const category = readPresetCategory(formData);
  const label = readRequired(formData, "label");

  try {
    const result = await findOrCreateCampaignBuilderPreset({ category, label });
    revalidatePath("/intern/marketing");
    return {
      ok: true,
      message:
        result.status === "created"
          ? "Gespeichert"
          : result.status === "reactivated"
            ? "Reaktiviert"
            : "Bereits vorhanden – ausgewählt",
      preset: result.preset,
    };
  } catch (error) {
    return presetActionError(error);
  }
}

export async function deactivateBuilderPresetAction(
  _prevState: PresetActionState,
  formData: FormData
): Promise<PresetActionState> {
  const auth = await requireInternSession();
  if (!auth.ok) return { ok: false, message: auth.message };

  const id = readRequired(formData, "id");

  try {
    await deactivateCampaignBuilderPreset(id);
    revalidatePath("/intern/marketing");
    return { ok: true, message: "Entfernt", removedPresetId: id };
  } catch (error) {
    return presetActionError(error);
  }
}

export async function archiveCampaignAction(
  _prevState: CampaignActionState,
  formData: FormData
): Promise<CampaignActionState> {
  const auth = await requireInternSession();
  if (!auth.ok) return auth;

  const id = readRequired(formData, "id");
  if (!id) {
    return { ok: false, message: "Kampagnen-ID fehlt." };
  }

  try {
    await archiveMarketingCampaign(id);
    revalidatePath("/intern/marketing");
    return { ok: true, message: OK_ARCHIVE };
  } catch (error) {
    return actionError(error);
  }
}

export async function softDeleteCampaignAction(
  _prevState: CampaignActionState,
  formData: FormData
): Promise<CampaignActionState> {
  const auth = await requireInternSession();
  if (!auth.ok) return auth;

  const id = readRequired(formData, "id");
  if (!id) {
    return { ok: false, message: "Kampagnen-ID fehlt." };
  }

  try {
    await softDeleteMarketingCampaign(id);
    revalidatePath("/intern/marketing");
    return { ok: true, message: OK_DELETE };
  } catch (error) {
    return actionError(error);
  }
}

async function requireInternSession(): Promise<CampaignActionState> {
  const cookieStore = await cookies();
  const token = cookieStore.get(INTERN_SESSION_COOKIE.name)?.value;
  const verification = await verifySessionToken(token);

  if (!verification.valid) {
    return {
      ok: false,
      message: "Interne Sitzung ist abgelaufen. Bitte erneut anmelden.",
    };
  }

  return { ok: true, message: "" };
}

function parseCampaignInput(formData: FormData): MarketingCampaignInput {
  const destination = readRequired(formData, "destination_path");
  if (!destination.startsWith("/")) {
    throw new Error("destination_path muss mit `/` beginnen.");
  }
  if (isInternalCampaignDestination(destination)) {
    throw new Error("Interne Zielseiten sind nicht erlaubt.");
  }
  const allowCustom = formData.get("allow_custom_destination") === "true";
  if (
    !allowCustom &&
    !ALLOWED_CAMPAIGN_DESTINATION_PATHS.includes(
      destination as (typeof ALLOWED_CAMPAIGN_DESTINATION_PATHS)[number]
    )
  ) {
    throw new Error("Zielseite ist nicht in der erlaubten Auswahl.");
  }

  const slug = slugify(readRequired(formData, "slug"));
  const utmCampaign = slugify(readRequired(formData, "utm_campaign"));
  if (!slug) {
    throw new Error("Slug ergibt nach Normalisierung keinen gültigen Wert.");
  }

  return {
    internal_name: readRequired(formData, "internal_name"),
    external_title: readRequired(formData, "external_title"),
    slug,
    status: readStatus(formData),
    destination_path: destination as `/${string}`,
    utm_source: readRequired(formData, "utm_source"),
    utm_medium: readUtmMedium(formData),
    utm_campaign: utmCampaign || slug,
    utm_content: readRequired(formData, "utm_content"),
    utm_term: readOptional(formData, "utm_term"),
    medium_label: readOptional(formData, "medium_label"),
    region: readOptional(formData, "region"),
    city: readOptional(formData, "city"),
    year: readOptionalYear(formData, "year"),
    version: readOptional(formData, "version"),
    notes: readOptional(formData, "notes"),
  };
}

function readOptionalYear(
  formData: FormData,
  key: string
): number | undefined {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") return undefined;
  const parsed = Number.parseInt(value.trim(), 10);
  if (!Number.isFinite(parsed) || parsed < 2000 || parsed > 2100) {
    throw new Error(`${key} ist ungültig.`);
  }
  return parsed;
}

function readRequired(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${key} ist ein Pflichtfeld.`);
  }
  return value.trim();
}

function readOptional(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function readStatus(formData: FormData): CampaignStatus {
  const value = readRequired(formData, "status");
  if (
    value === "draft" ||
    value === "active" ||
    value === "paused" ||
    value === "archived"
  ) {
    return value;
  }
  throw new Error("status ist ungültig.");
}

function readUtmMedium(formData: FormData): UtmMedium {
  const value = readRequired(formData, "utm_medium");
  if (
    value === "print" ||
    value === "qr" ||
    value === "email" ||
    value === "social" ||
    value === "referral" ||
    value === "offline" ||
    value === "video"
  ) {
    return value;
  }
  throw new Error("utm_medium ist ungültig.");
}

function readPresetCategory(formData: FormData): PresetCategory {
  const value = readRequired(formData, "category");
  if (
    value === "medium" ||
    value === "region" ||
    value === "topic" ||
    value === "version"
  ) {
    return value;
  }
  throw new Error("category ist ungültig.");
}

function presetActionError(error: unknown): PresetActionState {
  if (error instanceof SupabaseServerConfigError) {
    return {
      ok: false,
      message:
        "Supabase ist serverseitig nicht konfiguriert. Presets können nicht gespeichert werden.",
    };
  }
  if (error instanceof Error) {
    return { ok: false, message: error.message };
  }
  return { ok: false, message: "Unbekannter Fehler beim Speichern des Presets." };
}

function actionError(error: unknown): CampaignActionState {
  if (error instanceof SupabaseServerConfigError) {
    return {
      ok: false,
      message:
        "Supabase ist serverseitig nicht konfiguriert. Bitte Env Vars setzen und SQL-Schema ausführen.",
    };
  }
  if (error instanceof Error) {
    return { ok: false, message: error.message };
  }
  return { ok: false, message: "Unbekannter Fehler beim Speichern." };
}
