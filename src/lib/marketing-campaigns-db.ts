import "server-only";

import {
  buildCampaignDestination,
  buildCampaignShortLink,
  getSiteOrigin,
  isInternalCampaignDestination,
  isKebabCase,
  type CampaignStatus,
  type MarketingCampaign,
  type UtmMedium,
  validateCampaign,
} from "@/lib/marketing-campaigns";
import {
  createSupabaseServerClient,
  isSupabaseServerConfigured,
  SupabaseServerConfigError,
} from "@/lib/supabase/server";

export { SupabaseServerConfigError };
export { isSupabaseServerConfigured };

export type MarketingCampaignInput = {
  internal_name: string;
  external_title: string;
  slug: string;
  status: CampaignStatus;
  destination_path: `/${string}`;
  utm_source: string;
  utm_medium: UtmMedium;
  utm_campaign: string;
  utm_content: string;
  utm_term?: string;
  medium_label?: string;
  region?: string;
  city?: string;
  year?: number;
  version?: string;
  notes?: string;
};

type MarketingCampaignRow = {
  id: string;
  slug: string;
  internal_name: string;
  external_title: string;
  status: CampaignStatus;
  destination_path: string;
  utm_source: string;
  utm_medium: UtmMedium;
  utm_campaign: string;
  utm_content: string | null;
  utm_term: string | null;
  medium_label: string | null;
  region: string | null;
  city: string | null;
  year: number | null;
  version: string | null;
  notes: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

type CampaignMutationRow = {
  slug: string;
  internal_name: string;
  external_title: string;
  status: CampaignStatus;
  destination_path: string;
  utm_source: string;
  utm_medium: UtmMedium;
  utm_campaign: string;
  utm_content: string;
  utm_term?: string;
  medium_label?: string;
  region?: string;
  city?: string;
  year?: number;
  version?: string;
  notes?: string;
  archived_at?: string | null;
  deleted_at?: string | null;
};

const CAMPAIGN_SELECT =
  "id, slug, internal_name, external_title, status, destination_path, utm_source, utm_medium, utm_campaign, utm_content, utm_term, medium_label, region, city, year, version, notes, archived_at, deleted_at, created_at, updated_at";

export async function listMarketingCampaigns(): Promise<MarketingCampaign[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("marketing_campaigns")
    .select(CAMPAIGN_SELECT)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Kampagnen konnten nicht geladen werden: ${error.message}`);
  }

  return (data ?? []).map(mapRowToCampaign);
}

export async function getMarketingCampaignBySlug(
  slug: string
): Promise<MarketingCampaign | undefined> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("marketing_campaigns")
    .select(CAMPAIGN_SELECT)
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw new Error(`Kampagne konnte nicht geladen werden: ${error.message}`);
  }

  return data ? mapRowToCampaign(data as MarketingCampaignRow) : undefined;
}

export async function createMarketingCampaign(
  input: MarketingCampaignInput
): Promise<MarketingCampaign> {
  const supabase = createSupabaseServerClient();
  const row = inputToRow(input);
  validateCampaignInput(input);

  const { data, error } = await supabase
    .from("marketing_campaigns")
    .insert(row)
    .select(CAMPAIGN_SELECT)
    .single();

  if (error) {
    throw new Error(`Kampagne konnte nicht erstellt werden: ${error.message}`);
  }

  return mapRowToCampaign(data as MarketingCampaignRow);
}

export async function updateMarketingCampaign(
  id: string,
  input: MarketingCampaignInput
): Promise<MarketingCampaign> {
  const supabase = createSupabaseServerClient();
  const row = inputToRow(input);
  validateCampaignInput(input);

  const { data, error } = await supabase
    .from("marketing_campaigns")
    .update({
      ...row,
      archived_at: input.status === "archived" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(CAMPAIGN_SELECT)
    .single();

  if (error) {
    throw new Error(`Kampagne konnte nicht aktualisiert werden: ${error.message}`);
  }

  return mapRowToCampaign(data as MarketingCampaignRow);
}

export async function archiveMarketingCampaign(id: string): Promise<void> {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("marketing_campaigns")
    .update({
      status: "archived",
      archived_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Kampagne konnte nicht archiviert werden: ${error.message}`);
  }
}

export async function softDeleteMarketingCampaign(id: string): Promise<void> {
  const supabase = createSupabaseServerClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("marketing_campaigns")
    .update({
      deleted_at: now,
      updated_at: now,
    })
    .eq("id", id)
    .eq("status", "archived")
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(`Kampagne konnte nicht gelöscht werden: ${error.message}`);
  }

  if (!data) {
    throw new Error("Nur archivierte Kampagnen können gelöscht werden.");
  }
}

export function buildCampaignViewUrls(campaign: MarketingCampaign) {
  const origin = getSiteOrigin();
  return {
    shortLink: buildCampaignShortLink(campaign, origin),
    destinationUrl: buildCampaignDestination(campaign, origin),
    qrSvgUrl: `/intern/marketing/${campaign.slug}/qr.svg`,
    qrPngUrl: `/intern/marketing/${campaign.slug}/qr.png`,
  };
}

function mapRowToCampaign(row: MarketingCampaignRow): MarketingCampaign {
  return {
    id: row.id,
    slug: row.slug,
    internalName: row.internal_name,
    externalTitle: row.external_title,
    status: row.status,
    destinationPath: normalizeDestinationPath(row.destination_path),
    utm_source: row.utm_source,
    utm_medium: row.utm_medium,
    utm_campaign: row.utm_campaign,
    utm_content: row.utm_content ?? "",
    utm_term: row.utm_term ?? undefined,
    medium_label: row.medium_label ?? undefined,
    region: row.region ?? undefined,
    city: row.city ?? undefined,
    year: row.year ?? undefined,
    version: row.version ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function inputToRow(input: MarketingCampaignInput): CampaignMutationRow {
  return {
    slug: normalizeText(input.slug),
    internal_name: normalizeText(input.internal_name),
    external_title: normalizeText(input.external_title),
    status: input.status,
    destination_path: input.destination_path,
    utm_source: normalizeText(input.utm_source),
    utm_medium: input.utm_medium,
    utm_campaign: normalizeText(input.utm_campaign),
    utm_content: normalizeText(input.utm_content),
    utm_term: normalizeOptionalText(input.utm_term),
    medium_label: normalizeOptionalText(input.medium_label),
    region: normalizeOptionalText(input.region),
    city: normalizeOptionalText(input.city),
    year: input.year,
    version: normalizeOptionalText(input.version),
    notes: normalizeOptionalText(input.notes),
  };
}

function validateCampaignInput(input: MarketingCampaignInput): void {
  const campaign: MarketingCampaign = {
    slug: normalizeText(input.slug),
    internalName: normalizeText(input.internal_name),
    externalTitle: normalizeText(input.external_title),
    status: input.status,
    destinationPath: input.destination_path,
    utm_source: normalizeText(input.utm_source),
    utm_medium: input.utm_medium,
    utm_campaign: normalizeText(input.utm_campaign),
    utm_content: normalizeText(input.utm_content),
    utm_term: normalizeOptionalText(input.utm_term),
    medium_label: normalizeOptionalText(input.medium_label),
    region: normalizeOptionalText(input.region),
    city: normalizeOptionalText(input.city),
    year: input.year,
    version: normalizeOptionalText(input.version),
    notes: normalizeOptionalText(input.notes),
  };

  const errors = validateCampaign(campaign).filter(
    (issue) => issue.severity === "error"
  );
  if (errors.length > 0) {
    throw new Error(errors.map((issue) => issue.message).join(" "));
  }

  if (!isKebabCase(campaign.slug)) {
    throw new Error("Slug muss lowercase-kebab-case sein.");
  }
  if (!isKebabCase(campaign.utm_campaign)) {
    throw new Error("utm_campaign muss lowercase-kebab-case sein.");
  }
  if (isInternalCampaignDestination(campaign.destinationPath)) {
    throw new Error("Interne Zielpfade sind für Kampagnen nicht erlaubt.");
  }
}

function normalizeText(value: string): string {
  return value.trim();
}

function normalizeOptionalText(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function normalizeDestinationPath(value: string): `/${string}` {
  return value.startsWith("/") ? (value as `/${string}`) : "/";
}
