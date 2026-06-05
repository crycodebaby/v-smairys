"use client";

import React, { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/glass/GlassPanel";
import { GlassSheet } from "@/components/ui/glass/GlassSheet";
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
import type { CampaignBuilderPreset } from "@/lib/campaign-builder-presets-db";
import type { CampaignActionState, PresetActionState } from "../actions";
import type { MarketingCampaign } from "@/lib/marketing-campaigns";

type CampaignFormAction = (
  prevState: CampaignActionState,
  formData: FormData
) => Promise<CampaignActionState>;

type PresetFormAction = (
  prevState: PresetActionState,
  formData: FormData
) => Promise<PresetActionState>;

type SheetState =
  | { open: false }
  | { open: true; mode: "create" | "edit" | "duplicate"; campaign?: MarketingCampaign };

type MarketingDashboardProps = {
  campaigns: readonly CampaignDetailVM[];
  presets: readonly CampaignBuilderPreset[];
  env: SystemStatusEnv;
  deploy: SystemStatusDeploy;
  totals: { errors: number; warnings: number; active: number };
  logoutAction: () => Promise<void>;
  createAction: CampaignFormAction;
  updateAction: CampaignFormAction;
  archiveAction: CampaignFormAction;
  createPresetAction: PresetFormAction;
  dbState: {
    configured: boolean;
    source: "supabase" | "static";
    error?: string;
  };
};

/**
 * Mobile-first Shell des Marketing-Dashboards.
 *
 * - Mobile: minimaler Header, „Kampagnen"-Trigger öffnet die Liste als
 *   Bottom-Sheet; darunter die ausgewählte Kampagne als Arbeitskarte.
 * - Tablet/Desktop: Sidebar links (sticky), Asset-Kit rechts.
 * - QR-Vorschau liegt im eigenen Sheet (siehe CampaignDetail → QrSheet).
 */
export function MarketingDashboard({
  campaigns,
  presets,
  env,
  deploy,
  logoutAction,
  createAction,
  updateAction,
  archiveAction,
  createPresetAction,
  dbState,
}: MarketingDashboardProps) {
  const canWrite = dbState.source === "supabase";

  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    campaigns[0]?.campaign.slug ?? null
  );
  const [sheet, setSheet] = useState<SheetState>({ open: false });
  const [systemOpen, setSystemOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);

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

  const plausibleUrl =
    selected?.plausibleUrl ?? campaigns[0]?.plausibleUrl ?? "https://plausible.io";

  const closeSheet = () => setSheet({ open: false });

  const list = (onPicked?: () => void) => (
    <CampaignList
      campaigns={summaries}
      selectedSlug={selectedSlug}
      onSelect={(slug) => {
        setSelectedSlug(slug);
        onPicked?.();
      }}
      onNew={() => {
        onPicked?.();
        setSheet({ open: true, mode: "create" });
      }}
      canCreate={canWrite}
      source={dbState.source}
      plausibleUrl={plausibleUrl}
    />
  );

  return (
    <div className="chroma-stage relative min-h-[100svh] overflow-x-hidden bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-3 py-4 sm:gap-5 sm:px-6 sm:py-6">
        {/* Minimaler Header */}
        <header className="flex items-center justify-between gap-3 rounded-2xl glass-surface-subtle px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <BrandMark />
            <div className="min-w-0 leading-tight">
              <p className="text-sm font-semibold tracking-tight text-foreground">Smairys</p>
              <p className="truncate text-[11px] text-foreground/45">Marketing Dashboard</p>
            </div>
          </div>
          <div className="flex flex-none items-center gap-2">
            <DashButton
              size="sm"
              variant="ghost"
              onClick={() => setSystemOpen(true)}
              aria-label="Systemstatus"
              title="Systemstatus"
              className="!px-2.5"
            >
              <GearIcon />
              <span className="sr-only sm:not-sr-only sm:ml-1.5">Systemstatus</span>
            </DashButton>
            <form action={logoutAction}>
              <DashButton type="submit" size="sm" variant="secondary">
                Abmelden
              </DashButton>
            </form>
          </div>
        </header>

        {dbState.error && (
          <GlassPanel emphasis="subtle" className="border-amber-400/25 px-4 py-3">
            <p className="text-sm font-medium text-amber-100">Supabase-Fallback aktiv</p>
            <p className="mt-1 text-xs leading-relaxed text-foreground/65">{dbState.error}</p>
          </GlassPanel>
        )}

        {/* Mobile: Kampagnen-Trigger */}
        <button
          type="button"
          onClick={() => setListOpen(true)}
          className="flex items-center justify-between gap-3 rounded-2xl glass-surface-subtle px-4 py-3 text-left md:hidden"
        >
          <span className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/45">
              Kampagne · {campaigns.length} gesamt
            </span>
            <span className="mt-0.5 block truncate text-sm font-medium text-foreground">
              {selected?.campaign.externalTitle || selected?.campaign.internalName || "Keine ausgewählt"}
            </span>
          </span>
          <span aria-hidden="true" className="flex-none text-foreground/45">
            <ListIcon />
          </span>
        </button>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-[19rem_minmax(0,1fr)] lg:grid-cols-[21rem_minmax(0,1fr)]">
          {/* Desktop-Sidebar */}
          <aside className="hidden md:block md:sticky md:top-6 md:max-h-[calc(100svh-3rem)]">
            <GlassPanel emphasis="default" className="flex h-full flex-col px-4 py-4">
              <h2 className="px-1 pb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55">
                Kampagnen
              </h2>
              {list()}
            </GlassPanel>
          </aside>

          <main className="flex min-w-0 flex-col gap-5">
            {selected ? (
              <CampaignDetail
                vm={selected}
                canEdit={canWrite && Boolean(selected.campaign.id)}
                archiveAction={archiveAction}
                onEdit={() => setSheet({ open: true, mode: "edit", campaign: selected.campaign })}
                onDuplicate={() =>
                  setSheet({ open: true, mode: "duplicate", campaign: selected.campaign })
                }
              />
            ) : (
              <EmptyDetail
                count={campaigns.length}
                canCreate={canWrite}
                onNew={() => setSheet({ open: true, mode: "create" })}
              />
            )}
          </main>
        </div>

        <DeploymentFooter deploy={deploy} />
      </div>

      {/* Mobile: Kampagnenliste als Sheet */}
      {listOpen && (
        <GlassSheet open={listOpen} onClose={() => setListOpen(false)} title="Kampagnen">
          {list(() => setListOpen(false))}
        </GlassSheet>
      )}

      {sheet.open && (
        <CampaignBuilder
          key={`${sheet.mode}:${sheet.campaign?.id ?? "new"}`}
          open={sheet.open}
          mode={sheet.mode}
          campaign={sheet.campaign}
          action={sheet.mode === "edit" ? updateAction : createAction}
          presets={presets}
          createPresetAction={createPresetAction}
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

function GearIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 7.2A2.8 2.8 0 1 0 10 12.8 2.8 2.8 0 0 0 10 7.2zM16.4 11.3l1.2.9-1.2 2-1.4-.5c-.4.3-.8.6-1.3.8L13.4 16h-2.3l-.3-1.5c-.5-.2-.9-.5-1.3-.8l-1.4.5-1.2-2 1.2-.9a4.7 4.7 0 0 1 0-1.6l-1.2-.9 1.2-2 1.4.5c.4-.3.8-.6 1.3-.8L11.1 4h2.3l.3 1.5c.5.2.9.5 1.3.8l1.4-.5 1.2 2-1.2.9c.1.5.1 1.1 0 1.6z"
      />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        d="M2.5 4h11M2.5 8h11M2.5 12h11"
      />
    </svg>
  );
}
