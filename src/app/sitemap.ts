import type { MetadataRoute } from "next";
import { CASE_STUDIES } from "@/config/case-studies";

/**
 * Sitemap für smairys.de.
 *
 * Quelle der Wahrheit für indexierbare Routen. Interne (`/intern/*`,
 * `/kundenlogin`, `/login`), API- und Kurzlink-Routen (`/go/*`) werden
 * bewusst weggelassen – `robots.ts` schließt sie zusätzlich aus.
 *
 * No-Risk-Fix aus dem SEO-Audit (siehe `docs/audits/seo-conversion-audit.md`):
 *  - vorher war die Liste auf 4 statische Routen begrenzt
 *  - jetzt enthält sie alle öffentlichen Money-Pages + dynamische Case Studies
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smairys.de";
  const today = new Date().toISOString().split("T")[0];

  type Entry = {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  };

  const publicRoutes: Entry[] = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/leistungen", priority: 0.9, changeFrequency: "monthly" },
    { path: "/leistungen/webseiten", priority: 0.9, changeFrequency: "monthly" },
    { path: "/leistungen/seo", priority: 0.9, changeFrequency: "monthly" },
    { path: "/leistungen/google-ads", priority: 0.7, changeFrequency: "monthly" },
    { path: "/projekte", priority: 0.8, changeFrequency: "monthly" },
    { path: "/ueber-uns", priority: 0.7, changeFrequency: "monthly" },
    { path: "/kontakt", priority: 0.8, changeFrequency: "monthly" },
    { path: "/impressum", priority: 0.3, changeFrequency: "yearly" },
    { path: "/datenschutz", priority: 0.3, changeFrequency: "yearly" },
  ];

  const caseStudyRoutes: Entry[] = CASE_STUDIES.filter(
    (cs) => cs.status === "active"
  ).map((cs) => ({
    path: `/projekte/${cs.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  return [...publicRoutes, ...caseStudyRoutes].map((entry) => ({
    url: `${siteUrl}${entry.path}`,
    lastModified: today,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
