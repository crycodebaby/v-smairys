import { NextResponse, type NextRequest } from "next/server";
import {
  buildCampaignDestination,
  getCampaignBySlug,
} from "@/lib/marketing-campaigns";

/**
 * GET /go/[slug]
 *
 * Marketing-/Print-Kurzlink-Resolver.
 *
 * - Schlägt den Slug in `MARKETING_CAMPAIGNS` nach.
 * - Baut die Ziel-URL inkl. aller UTM-Parameter.
 * - Antwortet mit 307 Temporary Redirect, damit Browser/CDN keinen permanenten
 *   Cache-Eintrag anlegen (wir wollen UTMs notfalls noch nachträglich ändern können).
 * - Liefert 404, wenn der Slug unbekannt ist.
 *
 * Next.js 15: `params` ist asynchron (Promise<{ slug: string }>).
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await context.params;

  const campaign = getCampaignBySlug(slug);

  if (!campaign) {
    if (process.env.NODE_ENV === "development") {
      console.info(
        `[marketing-campaigns] Unbekannter Slug aufgerufen: "${slug}"`
      );
    }
    return new NextResponse("Not Found", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const destination = buildCampaignDestination(campaign, request.nextUrl.origin);

  if (process.env.NODE_ENV === "development") {
    console.info(
      `[marketing-campaigns] /go/${slug} -> 307 -> ${destination} ` +
        `(${campaign.internalName})`
    );
  }

  return NextResponse.redirect(destination, {
    status: 307,
    headers: {
      // Kein aggressives Browser-/CDN-Caching. UTMs sollen ggf. nachträglich
      // ohne Cache-Bust geändert werden können.
      "Cache-Control": "no-store, max-age=0",
      // Falls ein Crawler trotz robots.txt-Disallow auf einen /go/* URL stößt,
      // verhindern wir wenigstens Indexierung des Redirects.
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

/**
 * Wir betreiben den Resolver bewusst dynamisch:
 *  - Slug-Auflösung erfolgt zur Request-Zeit
 *  - Logging muss pro Request laufen
 *  - keine statische Caching-Optimierung erwünscht
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
