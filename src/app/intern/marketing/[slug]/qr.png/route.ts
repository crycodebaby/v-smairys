import { NextResponse, type NextRequest } from "next/server";
import QRCode from "qrcode";
import {
  buildCampaignShortLink,
  getCampaignBySlug,
} from "@/lib/marketing-campaigns";
import {
  getMarketingCampaignBySlug as getDbCampaignBySlug,
  isSupabaseServerConfigured,
} from "@/lib/marketing-campaigns-db";
import { QR_STYLE_PRESETS, resolveQrStyle } from "@/lib/qr/qr-styles";

/**
 * GET /intern/marketing/[slug]/qr.png?style=...
 *
 * Raster-QR für schnelle Vorschau/Download.
 *
 * Bewusst **immer Standard** (schwarz auf weiß, eckige Module): Das
 * `qrcode`-Paket rendert PNG nur klassisch, und eine Rasterisierung des
 * gebrandeten SVG würde eine zusätzliche Dependency erfordern. Branding läuft
 * deshalb ausschließlich über das druckwichtige SVG. Der `style`-Parameter
 * steuert hier nur Error-Correction & Quiet Zone, damit die Datendichte zum
 * SVG passt. Im UI ist die PNG-Aktion klar als „Standard" markiert.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await context.params;
  const style = resolveQrStyle(request.nextUrl.searchParams.get("style"));
  const preset = QR_STYLE_PRESETS[style];
  const campaign = isSupabaseServerConfigured()
    ? await loadDbCampaign(slug)
    : getCampaignBySlug(slug);

  if (!campaign) {
    return new NextResponse("Not Found", {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://smairys.de";
  const shortLink = buildCampaignShortLink(campaign, origin);

  let png: Buffer;
  try {
    png = await QRCode.toBuffer(shortLink, {
      type: "png",
      errorCorrectionLevel: preset.errorCorrection,
      margin: preset.margin,
      width: 512,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
  } catch (error) {
    console.error("[marketing-qr] PNG-Rendering fehlgeschlagen", { slug, error });
    return new NextResponse("Internal Error", {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return new NextResponse(new Uint8Array(png), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "private, no-store, max-age=0",
      "X-Robots-Tag": "noindex, nofollow",
      "Content-Disposition": `inline; filename="qr-${slug}-standard.png"`,
    },
  });
}

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
