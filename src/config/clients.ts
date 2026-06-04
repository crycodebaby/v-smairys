/**
 * Kundenlogos für SocialProof-Sektionen.
 *
 * Wir führen für jedes Logo eine `dark`- und eine `light`-Variante mit
 * dem korrekten Asset-Pfad. Die SocialProof-Komponente nutzt automatisch
 * die richtige Variante je nach Theme-Surface.
 *
 * Wenn ein Logo nur einfarbig vorhanden ist, geben wir es in beiden Slots
 * an – das ist der Default für die `socialproof*.png`-Files, die als reine
 * Wordmarks bereits Theme-neutral sind.
 */

export type ClientLogo = {
  /** Anzeigename, wird auch als alt-Text verwendet. */
  name: string;
  /** Logo-Pfad für Dark-Mode-Hintergründe (helles Logo). */
  dark: string;
  /** Logo-Pfad für Light-Mode-Hintergründe (dunkles Logo). */
  light: string;
  /** Optional: Link zur Kundenwebsite (extern). */
  href?: string;
  /** Optional: angedeutete Branche / kurzes Tag. */
  tag?: string;
  /** Native Bildbreite + -höhe für `next/image`. Höhe = Renderhöhe. */
  width?: number;
  height?: number;
};

export const CLIENT_LOGOS: readonly ClientLogo[] = [
  {
    name: "Ergart",
    dark: "/testimonials/ergart-logo.png",
    light: "/testimonials/ergart-logo.png",
    tag: "Stahlhandel",
    width: 220,
    height: 64,
  },
  {
    name: "crncic",
    dark: "/testimonials/crncic-weiss.png",
    light: "/testimonials/crncic-schwarz.png",
    width: 220,
    height: 64,
  },
  {
    name: "eppelstyle",
    dark: "/testimonials/eppelstyle-weiss.png",
    light: "/testimonials/eppelstyle-schwarz.png",
    width: 220,
    height: 64,
  },
  {
    name: "szalontai",
    dark: "/testimonials/szalontai.png",
    light: "/testimonials/szalontai.png",
    width: 220,
    height: 64,
  },
] as const;

/**
 * Zusätzliche Social-Proof-Komposit-Bilder (Auszeichnungen, Awards,
 * Zertifikate), die als geschlossene Grafiken vorliegen.
 */
export const SOCIAL_PROOF_BADGES: readonly { src: string; alt: string }[] = [
  { src: "/testimonials/socialproof1.png", alt: "Auszeichnung – Social Proof 1" },
  { src: "/testimonials/socialproof2.png", alt: "Auszeichnung – Social Proof 2" },
  { src: "/testimonials/socialproof3.png", alt: "Auszeichnung – Social Proof 3" },
  { src: "/testimonials/socialproof4.png", alt: "Auszeichnung – Social Proof 4" },
] as const;
