"use client";

import React, { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/glass/GlassPanel";
import { GlassButton } from "@/components/ui/glass/GlassButton";
import { Toolbar, ToolbarBrand } from "@/components/ui/glass/Toolbar";
import { StatusChip } from "@/components/ui/glass/StatusChip";
import { DebugCard } from "@/components/intern/DebugCard";
import { CampaignList } from "./CampaignList";
import { CampaignDetail } from "./CampaignDetail";
import { CampaignForm } from "./CampaignForm";
import type { CampaignDetail as CampaignDetailVM, CampaignSummary } from "./types";
import type { CampaignActionState } from "../actions";

type EnvSnapshot = {
  pinConfigured: boolean;
  hasExplicitSecret: boolean;
  hasPlausibleDomain: boolean;
  hasPlausibleSrc: boolean;
  hasSiteUrl: boolean;
  hasSupabaseUrl: boolean;
  hasSupabaseServiceRole: boolean;
};

type CampaignFormAction = (
  prevState: CampaignActionState,
  formData: FormData
) => Promise<CampaignActionState>;

type MarketingDashboardProps = {
  campaigns: readonly CampaignDetailVM[];
  env: EnvSnapshot;
  totals: {
    errors: number;
    warnings: number;
    active: number;
  };
  /** Server Action: löscht Cookie + Redirect. */
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
 * Master-Detail-Shell für das interne Dashboard.
 *
 * - Server liefert die View-Models und ENV-Snapshot.
 * - Diese Shell verwaltet Auswahl-State und Render-Layout.
 * - iPad-first: ab `md` wird das 2-Spalten-Layout aktiv. Mobile fällt auf
 *   einen Listen-Header + Detail-Stack zurück.
 */
export function MarketingDashboard({
  campaigns,
  env,
  totals,
  logoutAction,
  createAction,
  updateAction,
  archiveAction,
  dbState,
}: MarketingDashboardProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    campaigns[0]?.campaign.slug ?? null
  );

  // Summary-Liste für die Kampagnenliste (preiswert; läuft nur bei Mount).
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

  return (
    <div className="chroma-stage relative min-h-[100svh] bg-background text-foreground">
      {/* Statische Light-Layer hinter den animierten Blobs. Bewusst leiser als
          auf /kundenlogin, damit das Dashboard nicht überstrahlt. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,hsl(265_85%_55%/0.18),transparent_70%)] blur-3xl" />
        <div className="absolute -right-40 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(closest-side,hsl(195_90%_55%/0.14),transparent_70%)] blur-3xl" />
        <div className="absolute left-1/2 bottom-[-12rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(330_85%_55%/0.12),transparent_70%)] blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
        {/* ── Toolbar ──────────────────────────────────────────────────── */}
        <Toolbar
          brand={<ToolbarBrand label="Smairys · Intern" sublabel="Marketing" />}
          title="Kampagnen-Dashboard"
          description="Zentrale Übersicht für QR, UTM, Druck-Workflows"
          actions={
            <>
              <div className="hidden flex-wrap items-center gap-1.5 sm:flex">
                <StatusChip variant="info">{`${campaigns.length} Kampagnen`}</StatusChip>
                <StatusChip variant={totals.active > 0 ? "active" : "neutral"} withDot={totals.active > 0}>
                  {`${totals.active} live`}
                </StatusChip>
                {totals.errors > 0 && (
                  <StatusChip variant="danger">{`${totals.errors} Fehler`}</StatusChip>
                )}
                {totals.warnings > 0 && (
                  <StatusChip variant="warning">{`${totals.warnings} Warnungen`}</StatusChip>
                )}
              </div>
              <form action={logoutAction}>
                <GlassButton type="submit" size="sm" variant="subtle">
                  Abmelden
                </GlassButton>
              </form>
            </>
          }
        />

        {/* ── Master-Detail-Layout ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[20rem_minmax(0,1fr)] lg:grid-cols-[22rem_minmax(0,1fr)]">
          {/* Linke Spalte */}
          <aside className="md:sticky md:top-6 md:max-h-[calc(100svh-3rem)]">
            <GlassPanel emphasis="default" className="flex h-full flex-col px-4 py-4">
              <h2 className="px-1 pb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55">
                Kampagnen
              </h2>
              <CampaignList
                campaigns={summaries}
                selectedSlug={selectedSlug}
                onSelect={(slug) => setSelectedSlug(slug)}
              />
            </GlassPanel>
          </aside>

          {/* Rechte Spalte */}
          <main className="flex flex-col gap-5">
            {dbState.error && (
              <GlassPanel emphasis="subtle" className="border-amber-400/25 px-4 py-3">
                <p className="text-sm font-medium text-amber-100">
                  Supabase-Fallback aktiv
                </p>
                <p className="mt-1 text-xs leading-relaxed text-foreground/65">
                  {dbState.error}
                </p>
              </GlassPanel>
            )}

            <CampaignForm
              mode="create"
              action={createAction}
              disabled={dbState.source !== "supabase"}
              disabledReason={
                dbState.source !== "supabase"
                  ? "Erstellen ist erst aktiv, wenn Supabase Env Vars gesetzt sind und das SQL-Schema ausgeführt wurde."
                  : undefined
              }
            />

            {selected ? (
              <>
                <CampaignDetail vm={selected} />
                <CampaignForm
                  key={selected.campaign.id ?? selected.campaign.slug}
                  mode="edit"
                  campaign={selected.campaign}
                  action={updateAction}
                  archiveAction={archiveAction}
                  disabled={selected.source !== "supabase" || !selected.campaign.id}
                  disabledReason={
                    selected.source !== "supabase" || !selected.campaign.id
                      ? "Diese Kampagne kommt aus dem statischen Fallback und kann hier nicht gespeichert werden."
                      : undefined
                  }
                />
              </>
            ) : (
              <EmptyDetail count={campaigns.length} />
            )}

            <DebugCard
              env={env}
              campaignsLoaded={campaigns.length > 0}
              campaignsCount={campaigns.length}
            />
          </main>
        </div>

        <footer className="pt-4 text-[11px] text-foreground/45">
          Auswertung in Plausible:{" "}
          <span className="text-foreground/65">Top Sources → Campaigns</span>{" "}
          mit Filter <code className="font-mono">utm_campaign</code>.
        </footer>
      </div>
    </div>
  );
}

function EmptyDetail({ count }: { count: number }) {
  return (
    <GlassPanel emphasis="default" className="px-6 py-16 text-center">
      <p className="text-sm font-medium text-foreground/85">
        {count === 0
          ? "Noch keine Kampagne angelegt."
          : "Keine Kampagne ausgewählt."}
      </p>
      <p className="mx-auto mt-2 max-w-md text-xs text-foreground/55">
        {count === 0
          ? "Lege eine Kampagne über das Formular an (Supabase muss konfiguriert sein)."
          : "Wähle links eine Kampagne für QR, Links und Checklisten."}
      </p>
    </GlassPanel>
  );
}
