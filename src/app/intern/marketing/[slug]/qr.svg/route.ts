import { NextResponse, type NextRequest } from "next/server";
import {
  buildCampaignShortLink,
  getCampaignBySlug,
} from "@/lib/marketing-campaigns";
import {
  getMarketingCampaignBySlug as getDbCampaignBySlug,
  isSupabaseServerConfigured,
} from "@/lib/marketing-campaigns-db";
import { renderBrandedQrSvg } from "@/lib/qr/render-qr-svg";
import { resolveQrStyle } from "@/lib/qr/qr-styles";

/**
 * GET /intern/marketing/[slug]/qr.svg?style=clean-print|smairys-brand|premium-poster
 *
 * Druckfähiger QR-Code als reines SVG.
 *
 * Designprinzipien:
 *  - Codiert wird **immer** die kurze /go/[slug]-URL, nicht die UTM-URL.
 *    Begründung: der QR-Code muss redirect-fähig bleiben, damit UTMs noch
 *    nachträglich änderbar sind.
 *  - Höchster lesbarer Kontrast: dunkle Module auf weißem Hintergrund.
 *  - Branding nur über scan-sichere Style-Presets (eckig/abgerundet/Dots),
 *    Finder-Pattern bleiben immer klar erkennbar, Quiet Zone bleibt erhalten.
 *  - Hohe Fehlerkorrektur (Level H, clean-print Q) → robust gegen
 *    Druckartefakte. SVG ist vektoriell, druckbar in beliebiger Auflösung.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await context.params;
  const style = resolveQrStyle(request.nextUrl.searchParams.get("style"));
  const campaign = isSupabaseServerConfigured()
    ? await loadDbCampaign(slug)
    : getCampaignBySlug(slug);

  if (!campaign) {
    return new NextResponse("Not Found", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  // Origin: nicht aus der Request bauen, sondern aus NEXT_PUBLIC_SITE_URL.
  // Damit gibt der QR-Code im Preview/lokalen Dev trotzdem die Produktions-URL aus.
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://smairys.de";
  const shortLink = buildCampaignShortLink(campaign, origin);

  let svg: string;
  try {
    svg = renderBrandedQrSvg(shortLink, style);
  } catch (error) {
    console.error("[marketing-qr] Fehler beim QR-Code-Rendering", {
      slug,
      style,
      error,
    });
    return new NextResponse("Internal Error", {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      // Intern – kein aggressives CDN-Caching. Wir wollen den QR-Code
      // jederzeit unmittelbar austauschen können, wenn z. B. das
      // Ziel auf einen anderen Slug umgeleitet wird.
      "Cache-Control": "private, no-store, max-age=0",
      "X-Robots-Tag": "noindex, nofollow",
      // Hinweis für Browser, dass das SVG ggf. zum Download gedacht ist.
      "Content-Disposition": `inline; filename="qr-${slug}-${style}.svg"`,
    },
  });
}

// Slug-Auflösung passiert pro Request, keine statische Optimierung.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function loadDbCampaign(slug: string) {
  try {
    return await getDbCampaignBySlug(slug);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[marketing-qr] DB-Kampagne konnte nicht geladen werden", {
        slug,
        error: error instanceof Error ? error.message : "unknown",
      });
    }
    return undefined;
  }
}
