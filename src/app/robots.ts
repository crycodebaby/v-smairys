import type { MetadataRoute } from "next";

/**
 * robots.txt für smairys.de.
 *
 * Ziele:
 *  - öffentliche Routen frei zum Crawlen
 *  - alle internen Routen (`/intern/*`, `/kundenlogin`, `/login`) blockieren
 *  - API + Kurzlink-Resolver (`/go/*`) nicht indexieren
 *  - seriöse KI-Crawler dürfen lesen, sofern sie sich an robots halten
 *    (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, …) –
 *    sie erben implizit die `*`-Regeln (Allow `/`, Disallow internes)
 *
 * No-Risk-Fix aus dem SEO-Audit (`docs/audits/seo-conversion-audit.md`):
 *  - `/kundenlogin` + `/login` waren bisher nur per `noindex`-Header
 *    geschützt, jetzt zusätzlich explizit in der robots.txt
 *  - Disallow-Liste alphabetisch sortiert + kommentiert
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smairys.de";

  const disallow = [
    "/admin/",
    "/api/",
    // Kurzlink-Resolver – nur für Print/QR gedacht; Slug-Permutationen sollen
    // weder als Soft-404 noch als Landingpages indexiert werden.
    "/go/",
    // Interne Marketing-Übersicht inkl. QR-Asset-Routen.
    "/intern/",
    // PIN-Gate / Login-Routen.
    "/kundenlogin",
    "/login",
    // Studio (Sanity), falls aktiv.
    "/studio/",
    "/success",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
