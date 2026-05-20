import type {
  CampaignIssue,
  CampaignStatus,
  MarketingCampaign,
} from "@/lib/marketing-campaigns";

/**
 * Daten-Snapshot pro Kampagne, vorbereitet server-side, an die Client-Shell übergeben.
 *
 * Wichtig: kein Client-Side-Recompute. Die URLs und Validierungen entstehen
 * einmal serverseitig; die Client-Shell ist reine UI/Selection.
 */
export type CampaignDetail = {
  campaign: MarketingCampaign;
  shortLink: string;
  destinationUrl: string;
  qrSvgUrl: string;
  plausibleUrl: string;
  issues: CampaignIssue[];
};

/**
 * Reduzierte Variante für die Listenansicht.
 * Bewusst getrennt – die Liste muss schnell rendern, nicht jedes Detail kennen.
 */
export type CampaignSummary = {
  slug: string;
  internalName: string;
  externalTitle: string;
  status: CampaignStatus;
  startDate?: string;
  utm_source: string;
  utm_campaign: string;
  issueCount: number;
  errorCount: number;
  warningCount: number;
};
