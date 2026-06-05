import { slugify, type UtmMedium } from "@/lib/marketing-campaigns";

/**
 * Ableitungslogik für den intelligenten Kampagnen-Builder.
 *
 * Preset-Listen kommen aus Supabase (`campaign_builder_presets`).
 * Dieses Modul enthält nur Normalisierung und Feld-Ableitung.
 */

export type PresetPick = {
  label: string;
  value: string;
};

/** Kürzel für internal_name aus Label/Value ableiten. */
export function deriveAbbr(label: string, value: string): string {
  const parts = label.split(/[\s\-/]+/).filter(Boolean);
  if (parts.length >= 2) {
    return parts
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 3);
  }
  if (value.length >= 2) return value.slice(0, 2).toUpperCase();
  return value.toUpperCase();
}

/** Wandelt freien Text in einen CamelCase-Token für internal_name. */
export function toInternalToken(value: string): string {
  return value
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/Ä/g, "Ae")
    .replace(/Ö/g, "Oe")
    .replace(/Ü/g, "Ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/** Erhöht eine Versionskennung: v1 → v2, v2 → v3; sonst Fallback v2. */
export function bumpVersion(version: string | undefined): string {
  const match = (version ?? "").trim().match(/^v?(\d+)$/i);
  if (match) return `v${Number(match[1]) + 1}`;
  return "v2";
}

export type DuplicateSeed = {
  internal_name: string;
  slug: string;
  utm_campaign: string;
  utm_content: string;
  version: string;
};

export function deriveDuplicate(campaign: {
  slug: string;
  internalName: string;
  version?: string;
}): DuplicateSeed {
  const nextVersion = bumpVersion(campaign.version);
  const baseSlug = slugify(campaign.slug.replace(/-v\d+$/i, ""));
  const slug = `${baseSlug}-${nextVersion}`;
  const baseInternal = campaign.internalName.replace(/_[vV]\d+$/i, "");
  const internal_name = `${baseInternal}_${nextVersion.toUpperCase()}`;

  return {
    internal_name,
    slug,
    utm_campaign: slug,
    utm_content: `qr-${nextVersion}`,
    version: nextVersion,
  };
}

export type DerivedFields = {
  internal_name: string;
  slug: string;
  utm_source: string;
  utm_medium: UtmMedium;
  utm_campaign: string;
  utm_content: string;
};

export type BuilderSelection = {
  medium?: PresetPick;
  topic?: PresetPick;
  region?: PresetPick;
  year?: number;
  version: string;
};

export function deriveFields(sel: BuilderSelection): DerivedFields {
  const version = slugify(sel.version || "v1") || "v1";
  const mediumAbbr = sel.medium ? deriveAbbr(sel.medium.label, sel.medium.value) : undefined;
  const topicInternal = sel.topic ? toInternalToken(sel.topic.label) : undefined;
  const regionInternal = sel.region ? toInternalToken(sel.region.label) : undefined;

  const internalParts = [
    mediumAbbr,
    topicInternal,
    regionInternal,
    sel.year ? String(sel.year) : undefined,
  ].filter((p): p is string => Boolean(p && p.length));

  const slugParts = [
    sel.medium?.value,
    sel.topic?.value,
    sel.region?.value,
    sel.year ? String(sel.year) : undefined,
  ].filter((p): p is string => Boolean(p && p.length));

  const slug = slugify(slugParts.join("-"));

  return {
    internal_name: internalParts.join("_"),
    slug,
    utm_source: sel.medium?.value ?? "",
    utm_medium: "print",
    utm_campaign: slug,
    utm_content: `qr-${version}`,
  };
}
