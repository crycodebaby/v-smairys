import { NextResponse, type NextRequest } from "next/server";
import QRCode from "qrcode";
import {
  buildCampaignShortLink,
  getCampaignBySlug,
} from "@/lib/marketing-campaigns";

/**
 * GET /intern/marketing/[slug]/qr.svg
 *
 * Druckfähiger QR-Code als reines SVG.
 *
 * Designprinzipien:
 *  - Codiert wird **immer** die kurze /go/[slug]-URL, nicht die UTM-URL.
 *    Begründung: der QR-Code muss redirect-fähig bleiben, damit UTMs noch
 *    nachträglich änderbar sind.
 *  - Höchster lesbarer Kontrast: schwarze Module auf weißem Hintergrund.
 *  - Kein Logo, kein Branding-Overlay – jedes Overlay reduziert die
 *    Fehlertoleranz und ist druckseitig kritisch.
 *  - Hohe Fehlerkorrektur (Level H = 30 %) → robust gegen Druckartefakte
 *    und kleine Beschädigungen.
 *  - SVG ist vektoriell, druckbar in beliebiger Auflösung.
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await context.params;
  const campaign = getCampaignBySlug(slug);

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
    svg = await QRCode.toString(shortLink, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
  } catch (error) {
    console.error("[marketing-qr] Fehler beim QR-Code-Rendering", {
      slug,
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
      "Content-Disposition": `inline; filename="qr-${slug}.svg"`,
    },
  });
}

// Slug-Auflösung passiert pro Request, keine statische Optimierung.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
