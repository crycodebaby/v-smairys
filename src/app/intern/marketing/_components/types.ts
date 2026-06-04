import type {
  CampaignIssue,
  CampaignStatus,
  MarketingCampaign,
} from "@/lib/marketing-campaigns";

export type CampaignDetail = {
  campaign: MarketingCampaign;
  shortLink: string;
  destinationUrl: string;
  qrSvgUrl: string;
  qrPngUrl: string;
  plausibleUrl: string;
  plausibleSearchValues: string;
  issues: CampaignIssue[];
  source: "supabase" | "static";
};

export type CampaignSummary = {
  id?: string;
  slug: string;
  internalName: string;
  externalTitle: string;
  status: CampaignStatus;
  region?: string;
  city?: string;
  utm_source: string;
  utm_campaign: string;
  issueCount: number;
  errorCount: number;
  warningCount: number;
  source: "supabase" | "static";
};
