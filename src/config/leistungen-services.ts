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
    label: "Premium Webdesign",
    shortLabel: "Webdesign",
    icon: "layout",
  },
  {
    id: "service-jpp",
    label: "Geschwindigkeit & Performance",
    shortLabel: "Performance",
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
    label: "Hosting & Sicherheit",
    shortLabel: "Hosting",
    icon: "server",
  },
] as const;
