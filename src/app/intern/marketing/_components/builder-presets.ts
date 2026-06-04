import { slugify, type UtmMedium } from "@/lib/marketing-campaigns";

/**
 * Presets & Ableitungslogik für den intelligenten Kampagnen-Builder.
 *
 * Ziel: aus wenigen Quick-Picks (Medium, Thema, Region, Jahr, Version)
 * konsistente Werte für internal_name, slug, utm_* ableiten – statt
 * händischem Tippen. Alles bleibt manuell überschreibbar.
 */

export type MediumPreset = {
  value: string;
  label: string;
  /** Kürzel für internal_name (z. B. VK). */
  abbr: string;
  utm_source: string;
  utm_medium: UtmMedium;
};

export const MEDIUM_PRESETS: readonly MediumPreset[] = [
  { value: "visitenkarte", label: "Visitenkarte", abbr: "VK", utm_source: "visitenkarte", utm_medium: "print" },
  { value: "flyer", label: "Flyer", abbr: "FL", utm_source: "flyer", utm_medium: "print" },
  { value: "poster", label: "Poster", abbr: "PO", utm_source: "poster", utm_medium: "print" },
  { value: "aufkleber", label: "Aufkleber", abbr: "AK", utm_source: "aufkleber", utm_medium: "print" },
  { value: "direktmailing", label: "Direktmailing", abbr: "DM", utm_source: "direktmailing", utm_medium: "print" },
  { value: "event", label: "Event", abbr: "EV", utm_source: "event", utm_medium: "offline" },
  { value: "sonstiges", label: "Sonstiges", abbr: "XX", utm_source: "sonstiges", utm_medium: "print" },
];

export type TokenPreset = {
  value: string;
  label: string;
  /** Token für internal_name (CamelCase ohne Leerzeichen). */
  internal: string;
  /** Token für slug (kebab). */
  slug: string;
};

export const THEME_PRESETS: readonly TokenPreset[] = [
  { value: "sommer", label: "Sommer", internal: "Sommer", slug: "sommer" },
  { value: "fruehjahr", label: "Frühjahr", internal: "Fruehjahr", slug: "fruehjahr" },
  { value: "herbst", label: "Herbst", internal: "Herbst", slug: "herbst" },
  { value: "winter", label: "Winter", internal: "Winter", slug: "winter" },
  { value: "website", label: "Website", internal: "Website", slug: "website" },
  { value: "seo", label: "SEO", internal: "Seo", slug: "seo" },
  { value: "google-ads", label: "Google Ads", internal: "GoogleAds", slug: "google-ads" },
  { value: "lokal", label: "Lokale Unternehmen", internal: "Lokal", slug: "lokal" },
];

export const THEME_CUSTOM = "__custom__";

export const REGION_PRESETS: readonly TokenPreset[] = [
  { value: "saarland", label: "Saarland", internal: "Saarland", slug: "saarland" },
  { value: "saarmitte", label: "Saarmitte", internal: "SaarMitte", slug: "saarmitte" },
  { value: "eppelborn", label: "Eppelborn", internal: "Eppelborn", slug: "eppelborn" },
  { value: "saarbruecken", label: "Saarbrücken", internal: "Saarbruecken", slug: "saarbruecken" },
  { value: "saarlouis", label: "Saarlouis", internal: "Saarlouis", slug: "saarlouis" },
  { value: "neunkirchen", label: "Neunkirchen", internal: "Neunkirchen", slug: "neunkirchen" },
  { value: "st-wendel", label: "St. Wendel", internal: "StWendel", slug: "st-wendel" },
  { value: "illtal", label: "Illtal", internal: "Illtal", slug: "illtal" },
];

export const REGION_CUSTOM = "__custom__";

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

/**
 * Leitet aus einer bestehenden Kampagne eine eindeutige Duplikat-Variante ab.
 * Statt `-kopie` wird sauber die Version erhöht und an Slug/UTM angehängt
 * (Original bleibt unangetastet, keine ID-Übernahme).
 */
export function deriveDuplicate(campaign: {
  slug: string;
  internalName: string;
  version?: string;
}): DuplicateSeed {
  const nextVersion = bumpVersion(campaign.version);

  // Vorhandene Versions-Suffixe entfernen, dann neue Version anhängen.
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
  medium?: MediumPreset;
  themeInternal?: string;
  themeSlug?: string;
  regionInternal?: string;
  regionSlug?: string;
  year?: number;
  version: string;
};

/**
 * Leitet alle technischen Felder aus der Preset-Auswahl ab.
 * Beispiel: VK + Sommer + SaarMitte + 2026 + v1
 *  → internal_name VK_Sommer_SaarMitte_2026, slug vk-sommer-saarmitte-2026,
 *    utm_content qr-v1.
 */
export function deriveFields(sel: BuilderSelection): DerivedFields {
  const version = slugify(sel.version || "v1") || "v1";

  const internalParts = [
    sel.medium?.abbr,
    sel.themeInternal,
    sel.regionInternal,
    sel.year ? String(sel.year) : undefined,
  ].filter((p): p is string => Boolean(p && p.length));

  const slugParts = [
    sel.medium ? sel.medium.abbr.toLowerCase() : undefined,
    sel.themeSlug,
    sel.regionSlug,
    sel.year ? String(sel.year) : undefined,
  ].filter((p): p is string => Boolean(p && p.length));

  const slug = slugify(slugParts.join("-"));

  return {
    internal_name: internalParts.join("_"),
    slug,
    utm_source: sel.medium?.utm_source ?? "",
    utm_medium: sel.medium?.utm_medium ?? "print",
    utm_campaign: slug,
    utm_content: `qr-${version}`,
  };
}
