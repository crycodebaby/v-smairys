import type { Metadata } from "next";
import {
  MARKETING_CAMPAIGNS,
  buildCampaignDestination,
  buildCampaignShortLink,
  getSiteOrigin,
  validateCampaign,
} from "@/lib/marketing-campaigns";
import { logoutIntern } from "@/app/kundenlogin/actions";
import { isInternAuthConfigured } from "@/lib/auth/intern-session";
import { MarketingDashboard } from "./_components/MarketingDashboard";
import type { CampaignDetail } from "./_components/types";

/**
 * Server-Page für /intern/marketing.
 *
 * - Bereitet ViewModels (URLs, Validierung, ENV-Snapshot) auf
 * - Delegiert UI komplett an die Client-Shell `MarketingDashboard`
 * - Geschützt via Middleware; force-dynamic + nocache
 */

export const metadata: Metadata = {
  title: "Intern · Marketing-Kampagnen",
  description: "Interne Übersicht aller Marketing-/Print-Kampagnen.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InternMarketingPage() {
  const origin = getSiteOrigin();

  const plausibleHost =
    process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST || "https://plausible.io";
  const plausibleDomain =
    process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "smairys.de";

  const campaigns: CampaignDetail[] = MARKETING_CAMPAIGNS.map((campaign) => ({
    campaign,
    shortLink: buildCampaignShortLink(campaign, origin),
    destinationUrl: buildCampaignDestination(campaign, origin),
    qrSvgUrl: `/intern/marketing/${campaign.slug}/qr.svg`,
    plausibleUrl: `${plausibleHost.replace(/\/$/, "")}/${plausibleDomain}?period=30d&filters=${encodeURIComponent(
      `((event:goal==Visit /);(visit:utm_campaign==${campaign.utm_campaign}))`
    )}`,
    issues: validateCampaign(campaign),
  }));

  const totalErrors = campaigns.reduce(
    (sum, c) => sum + c.issues.filter((i) => i.severity === "error").length,
    0
  );
  const totalWarnings = campaigns.reduce(
    (sum, c) => sum + c.issues.filter((i) => i.severity === "warning").length,
    0
  );
  const totalActive = campaigns.reduce(
    (sum, c) => sum + (c.campaign.status === "active" ? 1 : 0),
    0
  );

  const env = {
    pinConfigured: isInternAuthConfigured(),
    hasExplicitSecret: hasEnvValue("ADMIN_DASHBOARD_SECRET"),
    hasPlausibleDomain: hasEnvValue("NEXT_PUBLIC_PLAUSIBLE_DOMAIN"),
    hasPlausibleSrc: hasEnvValue("NEXT_PUBLIC_PLAUSIBLE_SRC"),
    hasSiteUrl: hasEnvValue("NEXT_PUBLIC_SITE_URL"),
  };

  return (
    <MarketingDashboard
      campaigns={campaigns}
      env={env}
      totals={{
        errors: totalErrors,
        warnings: totalWarnings,
        active: totalActive,
      }}
      logoutAction={logoutIntern}
    />
  );
}

function hasEnvValue(name: string): boolean {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0;
}
