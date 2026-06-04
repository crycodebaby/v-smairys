import type { Metadata } from "next";
import {
  MARKETING_CAMPAIGNS,
  buildCampaignDestination,
  buildCampaignShortLink,
  buildPlausibleSearchValues,
  getSiteOrigin,
  type MarketingCampaign,
  validateCampaign,
} from "@/lib/marketing-campaigns";
import {
  isSupabaseServerConfigured,
  listMarketingCampaigns,
} from "@/lib/marketing-campaigns-db";
import { logoutIntern } from "@/app/kundenlogin/actions";
import { isInternAuthConfigured } from "@/lib/auth/intern-session";
import { MarketingDashboard } from "./_components/MarketingDashboard";
import type { CampaignDetail } from "./_components/types";
import {
  archiveCampaignAction,
  createCampaignAction,
  updateCampaignAction,
} from "./actions";

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

const DASHBOARD_VERSION = "v0.4";

export default async function InternMarketingPage() {
  const origin = getSiteOrigin();
  const supabaseConfigured = isSupabaseServerConfigured();
  const loadResult = await loadCampaigns(supabaseConfigured);

  const plausibleHost =
    process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST || "https://plausible.io";
  const plausibleDomain =
    process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "smairys.de";

  const campaigns: CampaignDetail[] = loadResult.campaigns.map((campaign) => ({
    campaign,
    shortLink: buildCampaignShortLink(campaign, origin),
    destinationUrl: buildCampaignDestination(campaign, origin),
    qrSvgUrl: `/intern/marketing/${campaign.slug}/qr.svg`,
    qrPngUrl: `/intern/marketing/${campaign.slug}/qr.png`,
    plausibleUrl: `${plausibleHost.replace(/\/$/, "")}/${plausibleDomain}?period=30d&filters=${encodeURIComponent(
      `((event:goal==Visit /);(visit:utm_campaign==${campaign.utm_campaign}))`
    )}`,
    plausibleSearchValues: buildPlausibleSearchValues(campaign),
    issues: validateCampaign(campaign),
    source: loadResult.source,
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
    hasSupabaseUrl:
      hasEnvValue("SUPABASE_URL") || hasEnvValue("NEXT_PUBLIC_SUPABASE_URL"),
    hasSupabaseServiceRole: hasEnvValue("SUPABASE_SERVICE_ROLE_KEY"),
  };

  const deploy = {
    version: DASHBOARD_VERSION,
    vercelEnv: process.env.VERCEL_ENV || "local",
    gitBranch: process.env.VERCEL_GIT_COMMIT_REF || undefined,
    gitSha: process.env.VERCEL_GIT_COMMIT_SHA
      ? process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7)
      : undefined,
  };

  return (
    <MarketingDashboard
      campaigns={campaigns}
      env={env}
      deploy={deploy}
      totals={{
        errors: totalErrors,
        warnings: totalWarnings,
        active: totalActive,
      }}
      logoutAction={logoutIntern}
      createAction={createCampaignAction}
      updateAction={updateCampaignAction}
      archiveAction={archiveCampaignAction}
      dbState={{
        configured: supabaseConfigured,
        source: loadResult.source,
        error: loadResult.error,
      }}
    />
  );
}

function hasEnvValue(name: string): boolean {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0;
}

type LoadCampaignsResult = {
  campaigns: readonly MarketingCampaign[];
  source: "supabase" | "static";
  error?: string;
};

async function loadCampaigns(
  supabaseConfigured: boolean
): Promise<LoadCampaignsResult> {
  if (!supabaseConfigured) {
    return {
      campaigns: MARKETING_CAMPAIGNS,
      source: "static",
      error:
        "Supabase Env Vars fehlen. Dashboard nutzt statischen Notfall-Fallback aus dem Code.",
    };
  }

  try {
    const campaigns = await listMarketingCampaigns();
    return { campaigns, source: "supabase" };
  } catch (error) {
    return {
      campaigns: MARKETING_CAMPAIGNS,
      source: "static",
      error:
        error instanceof Error
          ? `Supabase konnte nicht geladen werden: ${error.message}`
          : "Supabase konnte nicht geladen werden.",
    };
  }
}
