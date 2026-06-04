/**
 * Case-Study-Registry.
 *
 * Eine Case Study beschreibt ein abgeschlossenes oder laufendes Projekt
 * mit Hero-Bild, Logo, evtl. Portrait des Auftraggebers und (optional)
 * SEO-/Conversion-Insights. Alle Inhalte hier sind statisch-typisiert –
 * Zahlen werden bewusst nur dann angegeben, wenn sie tatsächlich aus
 * vorhandenen Assets/Reportings ablesbar sind. Ansonsten neutral
 * formuliert (z. B. „signifikanter Klick-Anstieg" statt erfundener „+540 %").
 */

export type CaseStudyMetric = {
  label: string;
  /** Anzeige-Wert (kann String sein, z. B. „6+ Jahre"). */
  value: string;
  /** Sub-Erklärung. */
  hint?: string;
};

export type CaseStudyImage = {
  src: string;
  alt: string;
  /** Bildverhältnis-Hinweis (Tailwind-Klassen werden vom Renderer ergänzt). */
  aspect?: "video" | "square" | "portrait" | "wide";
  /** Native Dimensionen. */
  width?: number;
  height?: number;
};

export type CaseStudy = {
  slug: string;
  /** Externer Kundenname (wird sichtbar). */
  client: string;
  /** Branche/Sektor. */
  industry?: string;
  /** Region. */
  region?: string;
  /** Headline der Case Study. */
  headline: string;
  /** Kurzbeschreibung (Karten/Listenvorschau). */
  summary: string;
  /** Hero-Bild. */
  hero: CaseStudyImage;
  /** Kunden-Logo. */
  logo?: CaseStudyImage;
  /** Portrait des Geschäftsführers / Hauptansprechpartners. */
  portrait?: CaseStudyImage;
  /** Optionale Galerie-Bilder (z. B. Performance-Grafiken). */
  gallery?: readonly CaseStudyImage[];
  /** Schlüssel-Kennzahlen – nur wenn belegbar. */
  metrics?: readonly CaseStudyMetric[];
  /** Bullet-Listen: Herausforderung / Vorgehen / Ergebnis. */
  challenge: readonly string[];
  approach: readonly string[];
  outcome: readonly string[];
  /** Optional: Zitat des Auftraggebers. */
  testimonial?: {
    quote: string;
    author: string;
    role?: string;
  };
  /** Optional: Zeitraum. */
  timeframe?: string;
  /** Optional: Live-URL. */
  liveUrl?: string;
  /** Status. */
  status: "active" | "draft";
};

export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    slug: "alexander-ergart",
    client: "Ergart",
    industry: "Stahlhandel & Metallbau",
    region: "Saarland",
    headline:
      "Vom regionalen Familienbetrieb zur sichtbaren Adresse im organischen Suchnetzwerk.",
    summary:
      "Aufbau einer hochwertigen Unternehmenspräsenz mit messbarem organischen Wachstum in der Google Search Console.",
    hero: {
      src: "/CaseStudies/AlexanderErgart_CaseStudy/ergart_firmenzentrale.webp",
      alt: "Firmenzentrale Ergart – Außenansicht",
      aspect: "wide",
    },
    logo: {
      src: "/CaseStudies/AlexanderErgart_CaseStudy/Ergart_logo_transparent.svg",
      alt: "Ergart Logo",
    },
    portrait: {
      src: "/CaseStudies/AlexanderErgart_CaseStudy/Inhaber_Ergart_Portrait.png",
      alt: "Inhaber Ergart – Portrait",
      aspect: "portrait",
    },
    gallery: [
      {
        src: "/CaseStudies/AlexanderErgart_CaseStudy/GSC_massive_organic_clicks.png",
        alt: "Google Search Console: deutlich steigende organische Klicks",
        aspect: "wide",
      },
      {
        src: "/CaseStudies/AlexanderErgart_CaseStudy/Website_Clicks-Graph_Diagramm.png",
        alt: "Website-Klicks – Verlauf im Diagramm",
        aspect: "wide",
      },
    ],
    metrics: [
      {
        label: "Search Console",
        value: "Sichtbarer Anstieg",
        hint: "organische Klicks im Beobachtungszeitraum (siehe Galerie)",
      },
      {
        label: "Region",
        value: "Saarland",
        hint: "B2B + B2C, klare regionale Positionierung",
      },
      {
        label: "Stack",
        value: "Next.js · SEO",
        hint: "Headless-Architektur, SEO-Architektur, On-Page",
      },
    ],
    challenge: [
      "Sehr begrenzte digitale Sichtbarkeit für relevante Keyword-Cluster.",
      "Veralteter Webauftritt ohne klare Conversion-Pfade.",
      "Hoher Anspruch an Vertrauen, Substanz und regionale Verankerung.",
    ],
    approach: [
      "Strikte Informationsarchitektur entlang von Käufer-Intent.",
      "Hochperformanter Next.js-Auftritt mit semantischem Markup.",
      "Aufbau organischer Reichweite über Pillar- + Cluster-Content.",
      "Kontinuierliches Monitoring via Google Search Console.",
    ],
    outcome: [
      "Deutlich steigende organische Klicks – belegbar in der GSC-Auswertung.",
      "Verlässliche, indexierte URL-Struktur als Vertriebsgrundlage.",
      "Repräsentative digitale Visitenkarte für Kunden- und Lieferantenkontakte.",
    ],
    timeframe: "laufend",
    status: "active",
  },
] as const;

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
