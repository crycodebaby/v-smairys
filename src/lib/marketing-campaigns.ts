/**
 * Zentrale Konfiguration aller Marketing-/Print-Kampagnen für trackbare Kurzlinks.
 *
 * Jede Kampagne wird über einen `slug` aufgelöst, der auf der Visitenkarte
 * (oder einem anderen Offline-Medium) als Pfad-Segment unter `/go/<slug>`
 * landet. Die Route in `src/app/go/[slug]/route.ts` leitet anschließend mit
 * 307 auf die `destinationPath` inklusive UTM-Parametern weiter.
 *
 * Hinweis: Bitte einen Kanal niemals doppelt auf denselben slug binden.
 * Slugs sollten kurz, kleingeschrieben, ohne Umlaute und ohne Sonderzeichen sein.
 */

export type UtmMedium =
  | "print"
  | "qr"
  | "email"
  | "social"
  | "referral"
  | "offline"
  | "video";

/**
 * Status einer Kampagne im operativen Marketing-Lifecycle.
 *  - draft       → noch nicht ausgespielt, nicht produktiv druckfähig
 *  - active      → live, QR-Code/URL in Umlauf
 *  - paused      → vorübergehend ausgesetzt (Druck pausiert, Auswertung läuft weiter)
 *  - archived    → beendet, nur noch historisch im Reporting
 */
export type CampaignStatus = "draft" | "active" | "paused" | "archived";

export interface MarketingCampaign {
  /** DB-ID, nur bei Supabase-Kampagnen vorhanden. Statische Fallbacks haben keine ID. */
  id?: string;
  /** Kurzer, URL-sicherer Slug. Erscheint in der öffentlichen URL `/go/<slug>`. */
  slug: string;
  /** Interner technischer Kampagnenname für Reporting & Doku. */
  internalName: string;
  /** Externer, sprechender Kampagnentitel (z. B. fürs Print-Briefing). */
  externalTitle: string;
  /** Lebenszyklus-Status der Kampagne. */
  status: CampaignStatus;
  /** Zielpfad auf smairys.de (immer mit führendem `/`). Query-Params zulässig. */
  destinationPath: `/${string}`;
  /** UTM-Source – woher kommt der Klick? */
  utm_source: string;
  /** UTM-Medium – welcher Kanaltyp? */
  utm_medium: UtmMedium;
  /** UTM-Campaign – muss eindeutig pro Kampagne sein. */
  utm_campaign: string;
  /** UTM-Content – Variante/Asset (z. B. `qr-v1`, `headline-a`). */
  utm_content: string;
  /** Optionales UTM-Term-Feld, nur wenn fachlich benötigt. */
  utm_term?: string;
  /** Print-Medium (z. B. Visitenkarte, Flyer). */
  medium_label?: string;
  /** Region (z. B. Saarland). */
  region?: string;
  /** Stadt/Ort, optional. */
  city?: string;
  /** Kampagnenjahr für Print-Briefing. */
  year?: number;
  /** Asset-Version (z. B. v1). */
  version?: string;
  /** ISO-Datum (`YYYY-MM-DD`), optional. Wann ging die Kampagne live? */
  startDate?: string;
  /** Optionale interne Notiz (nur für Devs/Marketing, wird nie an User ausgeliefert). */
  notes?: string;
  /** DB-Zeitstempel, nur bei Supabase-Kampagnen vorhanden. */
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Aktive Kampagnen-Registry. Neue Kampagnen einfach unten anhängen.
 * Reihenfolge ist irrelevant – Auflösung erfolgt per `slug`.
 */
export const MARKETING_CAMPAIGNS = [
  {
    slug: "vk-sommer-saarmitte-2026",
    internalName: "VK_Sommer_SaarMitte_2026",
    externalTitle: "Deine neue Website – Sommer 2026",
    status: "active",
    destinationPath: "/",
    utm_source: "visitenkarte",
    utm_medium: "print",
    utm_campaign: "vk-sommer-saarmitte-2026",
    utm_content: "qr-v1",
    medium_label: "Visitenkarte",
    region: "Saarland",
    year: 2026,
    version: "v1",
    startDate: "2026-05-20",
    notes:
      "Erste Visitenkartenauflage, QR-Code Variante 1. Verteilung Saarland-Mitte, Sommer 2026.",
  },
] as const satisfies readonly MarketingCampaign[];

/** Öffentliche Zielseiten für das Dashboard (keine internen Routen). */
export const CAMPAIGN_DESTINATION_PATHS = [
  { path: "/", label: "Startseite" },
  { path: "/kontakt", label: "Kontakt" },
  { path: "/website-erstellen", label: "Website-Erstellung" },
] as const;

/**
 * Strikt-typisierter Lookup-Slug. Nützlich, wenn intern eine Kampagne
 * referenziert wird (z. B. `getCampaignBySlug("vk-sommer-saarmitte-2026")`).
 */
export type CampaignSlug = (typeof MARKETING_CAMPAIGNS)[number]["slug"];

/**
 * Findet eine Kampagne anhand ihres Slugs. Liefert `undefined`, wenn nicht vorhanden.
 * Die Funktion ist case-sensitiv (Slugs sind per Konvention immer lowercase).
 */
export function getCampaignBySlug(
  slug: string
): MarketingCampaign | undefined {
  return MARKETING_CAMPAIGNS.find((c) => c.slug === slug);
}

/**
 * Baut die finale Ziel-URL inkl. UTM-Parametern.
 * Bestehende Query-Parameter im `destinationPath` bleiben erhalten;
 * UTM-Parameter überschreiben gleichnamige Parameter (Konvention: UTM hat Priorität).
 */
export function buildCampaignDestination(
  campaign: MarketingCampaign,
  origin: string
): string {
  const url = new URL(campaign.destinationPath, origin);
  url.searchParams.set("utm_source", campaign.utm_source);
  url.searchParams.set("utm_medium", campaign.utm_medium);
  url.searchParams.set("utm_campaign", campaign.utm_campaign);
  url.searchParams.set("utm_content", campaign.utm_content);
  if (campaign.utm_term) {
    url.searchParams.set("utm_term", campaign.utm_term);
  }
  return url.toString();
}

/**
 * Liefert den öffentlichen QR-/Kurzlink für eine Kampagne (ohne UTMs,
 * die hängt der Server-Resolver nach dem 307-Redirect dran).
 *
 * Beispiel: `https://smairys.de/go/vk-sommer-saarmitte-2026`
 */
export function buildCampaignShortLink(
  campaign: MarketingCampaign,
  origin: string
): string {
  const url = new URL(`/go/${campaign.slug}`, origin);
  return url.toString();
}

// ─── Validierung ────────────────────────────────────────────────────────────

/**
 * lowercase kebab-case Regel: `[a-z0-9]+(-[a-z0-9]+)*`
 *  - mind. ein Zeichen
 *  - nur a-z, 0-9 und einzelne Bindestriche zwischen Wörtern
 *  - kein Bindestrich am Anfang/Ende, kein doppelter Bindestrich
 *  - keine Umlaute, keine Großbuchstaben, keine Sonderzeichen
 */
export const KEBAB_CASE_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function isKebabCase(value: string): boolean {
  return KEBAB_CASE_REGEX.test(value);
}

export function isInternalCampaignDestination(path: string): boolean {
  return (
    path === "/intern" ||
    path.startsWith("/intern/") ||
    path === "/kundenlogin" ||
    path.startsWith("/kundenlogin?") ||
    path === "/login" ||
    path.startsWith("/login?") ||
    path === "/api" ||
    path.startsWith("/api/")
  );
}

/**
 * Validierungsproblem mit Schweregrad.
 *  - error: Kampagne so nicht produktiv nutzbar (Druck blockieren)
 *  - warning: konsistenz-relevant, aber technisch funktional
 */
export type CampaignIssueSeverity = "error" | "warning";

export interface CampaignIssue {
  field: string;
  severity: CampaignIssueSeverity;
  message: string;
}

/**
 * Validiert eine Kampagne hinsichtlich Pflichtfeldern und Naming-Konventionen.
 *
 * Hard rules (error):
 *  - slug, internalName, externalTitle, utm_source/medium/campaign/content
 *    müssen nicht-leer sein
 *  - destinationPath muss mit `/` beginnen
 *
 * Soft rules (warning):
 *  - slug, utm_source, utm_medium, utm_campaign, utm_content
 *    sollten lowercase kebab-case sein
 *  - status sollte gesetzt sein
 *  - utm_campaign sollte gleich dem slug sein (Smairys-Konvention für
 *    Print-Kampagnen, vereinfacht Plausible-Filter)
 */
export function validateCampaign(
  campaign: MarketingCampaign
): CampaignIssue[] {
  const issues: CampaignIssue[] = [];

  const required: Array<{ field: keyof MarketingCampaign; label: string }> = [
    { field: "slug", label: "Slug" },
    { field: "internalName", label: "Interner Name" },
    { field: "externalTitle", label: "Externer Titel" },
    { field: "utm_source", label: "UTM Source" },
    { field: "utm_medium", label: "UTM Medium" },
    { field: "utm_campaign", label: "UTM Campaign" },
    { field: "utm_content", label: "UTM Content" },
  ];

  for (const { field, label } of required) {
    const value = campaign[field];
    if (typeof value !== "string" || value.trim() === "") {
      issues.push({
        field,
        severity: "error",
        message: `${label} fehlt oder ist leer.`,
      });
    }
  }

  if (!campaign.destinationPath || !campaign.destinationPath.startsWith("/")) {
    issues.push({
      field: "destinationPath",
      severity: "error",
      message: "destinationPath muss mit `/` beginnen.",
    });
  } else if (isInternalCampaignDestination(campaign.destinationPath)) {
    issues.push({
      field: "destinationPath",
      severity: "error",
      message:
        "destinationPath darf keine interne Route sein (`/intern/*`, `/kundenlogin`, `/login`, `/api/*`).",
    });
  }

  // kebab-case Soft-Checks
  const kebabCandidates: Array<{ field: keyof MarketingCampaign; label: string }> = [
    { field: "slug", label: "Slug" },
    { field: "utm_source", label: "UTM Source" },
    { field: "utm_medium", label: "UTM Medium" },
    { field: "utm_campaign", label: "UTM Campaign" },
    { field: "utm_content", label: "UTM Content" },
  ];

  for (const { field, label } of kebabCandidates) {
    const value = campaign[field];
    if (typeof value === "string" && value !== "" && !isKebabCase(value)) {
      issues.push({
        field,
        severity: "warning",
        message: `${label} sollte lowercase-kebab-case sein (aktuell: "${value}").`,
      });
    }
  }

  if (!campaign.status) {
    issues.push({
      field: "status",
      severity: "warning",
      message: "Status nicht gesetzt – bitte draft/active/paused/archived setzen.",
    });
  }

  if (
    campaign.utm_campaign &&
    campaign.slug &&
    campaign.utm_campaign !== campaign.slug
  ) {
    issues.push({
      field: "utm_campaign",
      severity: "warning",
      message:
        "utm_campaign weicht vom Slug ab – Smairys-Konvention ist `utm_campaign === slug` für Print-Kampagnen.",
    });
  }

  return issues;
}

/**
 * Liefert den "Site Origin" für URL-Konstruktion. Bevorzugt NEXT_PUBLIC_SITE_URL
 * (gleich wie Layout/Sitemap), fällt auf `https://smairys.de` zurück.
 */
export function getSiteOrigin(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://smairys.de";
}

/**
 * Mehrzeilige Plausible-Filterwerte zum Kopieren (keine API, nur Text).
 */
export function buildPlausibleSearchValues(campaign: MarketingCampaign): string {
  const lines = [
    `utm_campaign: ${campaign.utm_campaign}`,
    `utm_source: ${campaign.utm_source}`,
    `utm_medium: ${campaign.utm_medium}`,
    `utm_content: ${campaign.utm_content}`,
  ];
  if (campaign.utm_term) {
    lines.push(`utm_term: ${campaign.utm_term}`);
  }
  return lines.join("\n");
}
