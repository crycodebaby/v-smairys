import "server-only";

import { slugify } from "@/lib/marketing-campaigns";
import {
  createSupabaseServerClient,
  isSupabaseServerConfigured,
  SupabaseServerConfigError,
} from "@/lib/supabase/server";

export { SupabaseServerConfigError, isSupabaseServerConfigured };

export type PresetCategory = "medium" | "region" | "topic" | "version";

const PRESET_CATEGORIES: readonly PresetCategory[] = [
  "medium",
  "region",
  "topic",
  "version",
];

export type CampaignBuilderPreset = {
  id: string;
  category: PresetCategory;
  label: string;
  value: string;
  sort_order: number;
};

export type CampaignBuilderPresetInput = {
  category: PresetCategory;
  label: string;
  value?: string;
};

export type FindOrCreatePresetResult = {
  preset: CampaignBuilderPreset;
  status: "created" | "existing" | "reactivated";
};

type PresetRow = {
  id: string;
  category: PresetCategory;
  label: string;
  value: string;
  sort_order: number;
  is_active: boolean;
};

/** Lädt alle aktiven Presets – einmal serverseitig, nicht pro Tastendruck. */
export async function listCampaignBuilderPresets(): Promise<
  readonly CampaignBuilderPreset[]
> {
  const client = createSupabaseServerClient();
  const { data, error } = await client
    .from("campaign_builder_presets")
    .select("id, category, label, value, sort_order")
    .eq("is_active", true)
    .order("category")
    .order("sort_order")
    .order("label");

  if (error) {
    throw new Error(`Presets konnten nicht geladen werden: ${error.message}`);
  }

  return (data ?? []).map((row) => mapRow(row as PresetRow));
}

/**
 * Find-or-create für Creatable Preset Chips.
 *
 * - gleicher normalisierter Wert erzeugt kein Duplikat
 * - aktives Preset wird zurückgegeben
 * - inaktives Preset wird reaktiviert
 */
export async function findOrCreateCampaignBuilderPreset(
  input: CampaignBuilderPresetInput
): Promise<FindOrCreatePresetResult> {
  const category = assertCategory(input.category);
  const label = input.label.trim();
  if (!label) {
    throw new Error("label ist ein Pflichtfeld.");
  }

  const value = normalizePresetValue(input.value?.trim() || label);
  if (!value) {
    throw new Error("value ergibt nach Normalisierung keinen gültigen Wert.");
  }

  const client = createSupabaseServerClient();

  const { data: existing, error: lookupError } = await client
    .from("campaign_builder_presets")
    .select("id, category, label, value, sort_order, is_active")
    .eq("category", category)
    .eq("value", value)
    .maybeSingle();

  if (lookupError) {
    throw new Error(`Preset konnte nicht geprüft werden: ${lookupError.message}`);
  }

  if (existing) {
    const row = existing as PresetRow;
    if (row.is_active) {
      return { preset: mapRow(row), status: "existing" };
    }

    const { data, error } = await client
      .from("campaign_builder_presets")
      .update({ is_active: true, label })
      .eq("id", row.id)
      .select("id, category, label, value, sort_order, is_active")
      .single();

    if (error) {
      throw new Error(`Preset konnte nicht reaktiviert werden: ${error.message}`);
    }

    return { preset: mapRow(data as PresetRow), status: "reactivated" };
  }

  const sort_order = await readNextSortOrder(client, category);
  const { data, error } = await client
    .from("campaign_builder_presets")
    .insert({
      category,
      label,
      value,
      sort_order,
    })
    .select("id, category, label, value, sort_order")
    .single();

  if (error) {
    if (error.code === "23505") {
      const retry = await findOrCreateCampaignBuilderPreset(input);
      return retry.status === "created"
        ? { ...retry, status: "existing" }
        : retry;
    }
    throw new Error(`Preset konnte nicht gespeichert werden: ${error.message}`);
  }

  return { preset: mapRow(data as PresetRow), status: "created" };
}

/** Rückwärtskompatibler Helper: legt an oder liefert bestehendes Preset. */
export async function createCampaignBuilderPreset(
  input: CampaignBuilderPresetInput
): Promise<CampaignBuilderPreset> {
  const result = await findOrCreateCampaignBuilderPreset(input);
  return result.preset;
}

/** Deaktiviert ein Preset (soft delete). */
export async function deactivateCampaignBuilderPreset(id: string): Promise<void> {
  if (!isUuid(id)) {
    throw new Error("Preset-ID ist ungültig.");
  }

  const client = createSupabaseServerClient();
  const { error } = await client
    .from("campaign_builder_presets")
    .update({ is_active: false })
    .eq("id", id);

  if (error) {
    throw new Error(`Preset konnte nicht deaktiviert werden: ${error.message}`);
  }
}

export function normalizePresetValue(raw: string): string {
  return slugify(raw);
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function assertCategory(value: string): PresetCategory {
  if (PRESET_CATEGORIES.includes(value as PresetCategory)) {
    return value as PresetCategory;
  }
  throw new Error("category ist ungültig.");
}

function mapRow(row: PresetRow): CampaignBuilderPreset {
  return {
    id: row.id,
    category: row.category,
    label: row.label,
    value: row.value,
    sort_order: row.sort_order,
  };
}

async function readNextSortOrder(
  client: ReturnType<typeof createSupabaseServerClient>,
  category: PresetCategory
): Promise<number> {
  const { data } = await client
    .from("campaign_builder_presets")
    .select("sort_order")
    .eq("category", category)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data?.sort_order ?? 0) + 10;
}
