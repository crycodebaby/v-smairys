/**
 * QR-Style-Presets (Branding MVP).
 *
 * Grundsatz: **Scan-Sicherheit vor Optik.**
 *  - Immer dunkle Module auf hellem Hintergrund (kein invertierter Code).
 *  - Keine Verläufe innerhalb der Module.
 *  - Finder-Ecken bleiben klar erkennbar.
 *  - Quiet Zone wird nie entfernt.
 *  - Logo nur klein und nur mit Error Correction H (im MVP deaktiviert,
 *    siehe Hinweis unten).
 *
 * Diese Datei ist server- und client-importierbar (keine Server-only-Imports).
 */

export type QrStyleId = "clean-print" | "smairys-brand" | "premium-poster";

export type QrModuleShape = "square" | "rounded" | "dots";
export type QrFinderShape = "square" | "rounded";

export type QrErrorCorrection = "Q" | "H";

export type QrScanSafety = "high" | "medium";

export type QrRecommendedFor = "Visitenkarte" | "Flyer" | "Poster";

export type QrStylePreset = {
  id: QrStyleId;
  name: string;
  /** Kurze, einzeilige Empfehlung. */
  tagline: string;
  /** Rendering-Parameter für den SVG-Renderer. */
  module: QrModuleShape;
  finder: QrFinderShape;
  /** Quiet Zone in Modulen. */
  margin: number;
  errorCorrection: QrErrorCorrection;
  /** Modulfarbe (dunkel, hoher Kontrast auf Weiß). */
  dark: string;
  /** Hintergrund (immer hell). */
  light: string;
  /** Akzentfarbe für Finder-Augen (dezent, dunkel genug für Kontrast). */
  accent: string;
  /** Logo aktuell überall aus – Scan-Sicherheit im MVP > Logo. */
  logo: boolean;
  /** Kompakte Sicherheitseinschätzung für die UI. */
  safety: {
    scan: QrScanSafety;
    recommendedFor: QrRecommendedFor;
    quietZoneOk: true;
    logoLabel: string;
  };
};

export const QR_STYLE_PRESETS: Record<QrStyleId, QrStylePreset> = {
  "clean-print": {
    id: "clean-print",
    name: "Clean Print",
    tagline: "Maximale Scanbarkeit – klassisch schwarz auf weiß.",
    module: "square",
    finder: "square",
    margin: 2,
    errorCorrection: "Q",
    dark: "#000000",
    light: "#FFFFFF",
    accent: "#000000",
    logo: false,
    safety: {
      scan: "high",
      recommendedFor: "Visitenkarte",
      quietZoneOk: true,
      logoLabel: "Kein Logo",
    },
  },
  "smairys-brand": {
    id: "smairys-brand",
    name: "Smairys Brand",
    tagline: "Dunkler Brand-Ton mit dezentem Amber-Akzent.",
    module: "rounded",
    finder: "square",
    margin: 2,
    // warmes Near-Black für Module → hoher Kontrast, kein helles Orange
    dark: "#16110A",
    light: "#FFFFFF",
    // dunkles Amber nur für Finder-Augen (kontraststark genug auf Weiß)
    accent: "#9A4F0F",
    errorCorrection: "H",
    logo: false,
    safety: {
      scan: "high",
      recommendedFor: "Flyer",
      quietZoneOk: true,
      logoLabel: "Kein Logo",
    },
  },
  "premium-poster": {
    id: "premium-poster",
    name: "Premium Poster",
    tagline: "Runde Dots & gestylte Ecken – nur für große Flächen.",
    module: "dots",
    finder: "rounded",
    margin: 4,
    dark: "#0B0B0B",
    light: "#FFFFFF",
    accent: "#9A4F0F",
    errorCorrection: "H",
    logo: false,
    safety: {
      scan: "medium",
      recommendedFor: "Poster",
      quietZoneOk: true,
      logoLabel: "Kein Logo (MVP)",
    },
  },
};

export const QR_STYLE_ORDER: readonly QrStyleId[] = [
  "clean-print",
  "smairys-brand",
  "premium-poster",
];

export const DEFAULT_QR_STYLE: QrStyleId = "clean-print";

/** Normalisiert einen beliebigen Eingabewert auf eine gültige Style-ID. */
export function resolveQrStyle(value: string | null | undefined): QrStyleId {
  if (value && value in QR_STYLE_PRESETS) {
    return value as QrStyleId;
  }
  return DEFAULT_QR_STYLE;
}
