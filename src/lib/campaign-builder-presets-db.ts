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

/** Legt ein neues Preset an. `value` wird aus `label` abgeleitet, falls leer. */
export async function createCampaignBuilderPreset(
  input: CampaignBuilderPresetInput
): Promise<CampaignBuilderPreset> {
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
      throw new Error(`Preset „${value}" existiert in dieser Kategorie bereits.`);
    }
    throw new Error(`Preset konnte nicht gespeichert werden: ${error.message}`);
  }

  return mapRow(data as PresetRow);
}

/** Deaktiviert ein Preset (soft delete). */
export async function deactivateCampaignBuilderPreset(id: string): Promise<void> {
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
