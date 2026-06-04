"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  archiveMarketingCampaign,
  createMarketingCampaign,
  updateMarketingCampaign,
  SupabaseServerConfigError,
  type MarketingCampaignInput,
} from "@/lib/marketing-campaigns-db";
import {
  INTERN_SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/auth/intern-session";
import type { CampaignStatus, UtmMedium } from "@/lib/marketing-campaigns";

export type CampaignActionState = {
  ok: boolean;
  message: string;
};

const OK_CREATE = "Kampagne wurde erstellt.";
const OK_UPDATE = "Kampagne wurde gespeichert.";
const OK_ARCHIVE = "Kampagne wurde archiviert.";

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

  return {
    internal_name: readRequired(formData, "internal_name"),
    external_title: readRequired(formData, "external_title"),
    slug: readRequired(formData, "slug"),
    status: readStatus(formData),
    destination_path: destination as `/${string}`,
    utm_source: readRequired(formData, "utm_source"),
    utm_medium: readUtmMedium(formData),
    utm_campaign: readRequired(formData, "utm_campaign"),
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
