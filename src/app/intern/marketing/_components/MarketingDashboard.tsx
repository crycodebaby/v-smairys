"use client";

import React, { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/glass/GlassPanel";
import { Toolbar, ToolbarBrand } from "@/components/ui/glass/Toolbar";
import { BrandMark } from "@/components/intern/BrandMark";
import { DashButton } from "@/components/intern/DashButton";
import {
  SystemStatusDialog,
  type SystemStatusDeploy,
  type SystemStatusEnv,
} from "@/components/intern/SystemStatusDialog";
import { CampaignList } from "./CampaignList";
import { CampaignDetail } from "./CampaignDetail";
import { CampaignBuilder } from "./CampaignBuilder";
import type { CampaignDetail as CampaignDetailVM, CampaignSummary } from "./types";
import type { CampaignActionState } from "../actions";
import type { MarketingCampaign } from "@/lib/marketing-campaigns";

type CampaignFormAction = (
  prevState: CampaignActionState,
  formData: FormData
) => Promise<CampaignActionState>;

type SheetState =
  | { open: false }
  | { open: true; mode: "create" | "edit" | "duplicate"; campaign?: MarketingCampaign };

type MarketingDashboardProps = {
  campaigns: readonly CampaignDetailVM[];
  env: SystemStatusEnv;
  deploy: SystemStatusDeploy;
  totals: { errors: number; warnings: number; active: number };
  logoutAction: () => Promise<void>;
  createAction: CampaignFormAction;
  updateAction: CampaignFormAction;
  archiveAction: CampaignFormAction;
  dbState: {
    configured: boolean;
    source: "supabase" | "static";
    error?: string;
  };
};

/**
 * Master-Detail-Shell des Marketing-Dashboards (iPad-first).
 *
 * - Links: + Neue Kampagne, Suche, Status-Filter, Liste
 * - Rechts: Print-Asset-Kit (oben) + Workflow/Checklisten
 * - Builder als Glass-Sheet (kein dauerhaftes Formular im Layout)
 * - Systemstatus & Versionshinweis dezent ausgelagert
 */
export function MarketingDashboard({
  campaigns,
  env,
  deploy,
  logoutAction,
  createAction,
  updateAction,
  archiveAction,
  dbState,
}: MarketingDashboardProps) {
  const canWrite = dbState.source === "supabase";

  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    campaigns[0]?.campaign.slug ?? null
  );
  const [sheet, setSheet] = useState<SheetState>({ open: false });
  const [systemOpen, setSystemOpen] = useState(false);

  const summaries: readonly CampaignSummary[] = useMemo(
    () =>
      campaigns.map(({ campaign, issues, source }) => ({
        id: campaign.id,
        slug: campaign.slug,
        internalName: campaign.internalName,
        externalTitle: campaign.externalTitle,
        status: campaign.status,
        region: campaign.region,
        city: campaign.city,
        utm_source: campaign.utm_source,
        utm_campaign: campaign.utm_campaign,
        issueCount: issues.length,
        errorCount: issues.filter((i) => i.severity === "error").length,
        warningCount: issues.filter((i) => i.severity === "warning").length,
        source,
      })),
    [campaigns]
  );

  const selected = useMemo(
    () => campaigns.find((c) => c.campaign.slug === selectedSlug) ?? null,
    [campaigns, selectedSlug]
  );

  const closeSheet = () => setSheet({ open: false });

  return (
    <div className="chroma-stage relative min-h-[100svh] bg-background text-foreground">
      {/* Warmer Amber-Ambient statt lila/blau – elegantes Liquid-Glass-Licht. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,hsl(var(--brand-glow)/0.14),transparent_70%)] blur-3xl" />
        <div className="absolute -right-40 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(closest-side,hsl(28_90%_52%/0.10),transparent_70%)] blur-3xl" />
        <div className="absolute left-1/2 bottom-[-12rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(20_85%_45%/0.08),transparent_70%)] blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
        <Toolbar
          brand={
            <ToolbarBrand
              label="Smairys · Intern"
              sublabel="QR-Kampagnen & Print-Assets"
              logo={<BrandMark />}
            />
          }
          title="Marketing-Dashboard"
          actions={
            <>
              <DashButton size="sm" variant="ghost" onClick={() => setSystemOpen(true)}>
                Systemstatus
              </DashButton>
              <form action={logoutAction}>
                <DashButton type="submit" size="sm" variant="secondary">
                  Abmelden
                </DashButton>
              </form>
            </>
          }
        />

        {dbState.error && (
          <GlassPanel emphasis="subtle" className="border-amber-400/25 px-4 py-3">
            <p className="text-sm font-medium text-amber-100">Supabase-Fallback aktiv</p>
            <p className="mt-1 text-xs leading-relaxed text-foreground/65">{dbState.error}</p>
          </GlassPanel>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-[20rem_minmax(0,1fr)] lg:grid-cols-[22rem_minmax(0,1fr)]">
          <aside className="md:sticky md:top-6 md:max-h-[calc(100svh-3rem)]">
            <GlassPanel
              emphasis="default"
              className="flex max-h-[70svh] flex-col px-4 py-4 md:h-full md:max-h-none"
            >
              <h2 className="px-1 pb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55">
                Kampagnen
              </h2>
              <CampaignList
                campaigns={summaries}
                selectedSlug={selectedSlug}
                onSelect={(slug) => setSelectedSlug(slug)}
                onNew={() => setSheet({ open: true, mode: "create" })}
                canCreate={canWrite}
                source={dbState.source}
              />
            </GlassPanel>
          </aside>

          <main className="flex min-w-0 flex-col gap-5">
            {selected ? (
              <CampaignDetail
                vm={selected}
                canEdit={canWrite && Boolean(selected.campaign.id)}
                archiveAction={archiveAction}
                onEdit={() =>
                  setSheet({ open: true, mode: "edit", campaign: selected.campaign })
                }
                onDuplicate={() =>
                  setSheet({ open: true, mode: "duplicate", campaign: selected.campaign })
                }
              />
            ) : (
              <EmptyDetail count={campaigns.length} canCreate={canWrite} onNew={() => setSheet({ open: true, mode: "create" })} />
            )}
          </main>
        </div>

        <DeploymentFooter deploy={deploy} />
      </div>

      {sheet.open && (
        <CampaignBuilder
          key={`${sheet.mode}:${sheet.campaign?.id ?? "new"}`}
          /* key erzwingt frischen Builder-State pro Öffnung/Modus */
          open={sheet.open}
          mode={sheet.mode}
          campaign={sheet.campaign}
          action={sheet.mode === "edit" ? updateAction : createAction}
          archiveAction={sheet.mode === "edit" ? archiveAction : undefined}
          // duplicate & create nutzen createAction → keine ID, kein Overwrite des Originals
          onClose={closeSheet}
          disabled={!canWrite}
          disabledReason={
            !canWrite
              ? "Speichern ist erst aktiv, wenn Supabase Env Vars gesetzt sind und das SQL-Schema ausgeführt wurde."
              : undefined
          }
        />
      )}

      <SystemStatusDialog
        open={systemOpen}
        onClose={() => setSystemOpen(false)}
        env={env}
        deploy={deploy}
        campaignsLoaded={campaigns.length > 0}
        campaignsCount={campaigns.length}
        source={dbState.source}
      />
    </div>
  );
}

function EmptyDetail({
  count,
  canCreate,
  onNew,
}: {
  count: number;
  canCreate: boolean;
  onNew: () => void;
}) {
  return (
    <GlassPanel emphasis="default" className="px-6 py-16 text-center">
      <p className="text-sm font-medium text-foreground/85">
        {count === 0 ? "Noch keine Kampagne angelegt." : "Keine Kampagne ausgewählt."}
      </p>
      <p className="mx-auto mt-2 max-w-md text-xs text-foreground/55">
        {count === 0
          ? "Lege deine erste QR-Kampagne an – Slug und UTM-Werte werden automatisch abgeleitet."
          : "Wähle links eine Kampagne für QR-Code, Shortlink und Print-Assets."}
      </p>
      {count === 0 && (
        <div className="mt-5 flex justify-center">
          <DashButton variant="primary" size="sm" onClick={onNew} disabled={!canCreate}>
            Neue Kampagne
          </DashButton>
        </div>
      )}
    </GlassPanel>
  );
}

function DeploymentFooter({ deploy }: { deploy: SystemStatusDeploy }) {
  const parts = [
    `Dashboard ${deploy.version}`,
    deploy.vercelEnv,
    deploy.gitBranch,
    deploy.gitSha,
  ].filter(Boolean);
  return (
    <footer className="flex items-center justify-between gap-3 pt-2 text-[11px] text-foreground/40">
      <span className="font-mono">{parts.join(" · ")}</span>
    </footer>
  );
}
