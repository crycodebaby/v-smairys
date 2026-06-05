export type LeistungenNavIcon = "layout" | "gauge" | "search" | "server";

export type LeistungenNavItem = {
  id: string;
  label: string;
  shortLabel: string;
  icon: LeistungenNavIcon;
};

/** Stabile Section-IDs + Nav-Labels für /leistungen (TOC + Scroll-Spy). */
export const LEISTUNGEN_NAV_ITEMS: LeistungenNavItem[] = [
  {
    id: "service-web",
    label: "Website & Markendesign",
    shortLabel: "Webdesign",
    icon: "layout",
  },
  {
    id: "service-jpp",
    label: "JPP-Check (Performance)",
    shortLabel: "JPP-Check",
    icon: "gauge",
  },
  {
    id: "service-seo",
    label: "SEO & Sichtbarkeit",
    shortLabel: "SEO",
    icon: "search",
  },
  {
    id: "service-hosting",
    label: "Hosting & Instandhaltung",
    shortLabel: "Hosting",
    icon: "server",
  },
] as const;
