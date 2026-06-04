"use client";

import React from "react";
import { GlassSheet } from "@/components/ui/glass/GlassSheet";
import { StatusChip } from "@/components/ui/glass/StatusChip";

export type SystemStatusEnv = {
  pinConfigured: boolean;
  hasExplicitSecret: boolean;
  hasPlausibleDomain: boolean;
  hasPlausibleSrc: boolean;
  hasSiteUrl: boolean;
  hasSupabaseUrl: boolean;
  hasSupabaseServiceRole: boolean;
};

export type SystemStatusDeploy = {
  version: string;
  vercelEnv: string;
  gitBranch?: string;
  gitSha?: string;
};

type SystemStatusDialogProps = {
  open: boolean;
  onClose: () => void;
  env: SystemStatusEnv;
  deploy: SystemStatusDeploy;
  campaignsLoaded: boolean;
  campaignsCount: number;
  source: "supabase" | "static";
};

type Row = { label: string; required: boolean; present: boolean; hint?: string };

/**
 * Systemstatus als Glass-Dialog – ersetzt die Debug-Karte im Arbeitsbereich.
 * Zeigt ausschließlich Anwesenheit-Flags, niemals Werte/Secrets.
 */
export function SystemStatusDialog({
  open,
  onClose,
  env,
  deploy,
  campaignsLoaded,
  campaignsCount,
  source,
}: SystemStatusDialogProps) {
  const rows: Row[] = [
    { label: "ADMIN_DASHBOARD_PIN", required: true, present: env.pinConfigured, hint: "Pflicht für /intern/*" },
    { label: "SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL", required: false, present: env.hasSupabaseUrl, hint: "Für persistente Kampagnen." },
    { label: "SUPABASE_SERVICE_ROLE_KEY", required: false, present: env.hasSupabaseServiceRole, hint: "Server-only." },
    { label: "NEXT_PUBLIC_PLAUSIBLE_DOMAIN", required: false, present: env.hasPlausibleDomain, hint: "Sonst lädt Plausible nicht." },
    { label: "NEXT_PUBLIC_PLAUSIBLE_SRC", required: false, present: env.hasPlausibleSrc, hint: "Default: script.exclusions.js" },
    { label: "NEXT_PUBLIC_SITE_URL", required: false, present: env.hasSiteUrl, hint: "Fallback https://smairys.de" },
    { label: "ADMIN_DASHBOARD_SECRET", required: false, present: env.hasExplicitSecret, hint: "Optional, sonst aus PIN abgeleitet." },
  ];

  return (
    <GlassSheet
      open={open}
      onClose={onClose}
      title="Systemstatus"
      description="Nur Anwesenheit-Flags – keine Werte, keine Secrets."
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <StatusRow
            label="Kampagnen geladen"
            chip={
              <StatusChip variant={campaignsLoaded ? "active" : "danger"} size="sm">
                {campaignsLoaded ? String(campaignsCount) : "0"}
              </StatusChip>
            }
          />
          <StatusRow
            label="Datenquelle"
            chip={
              <StatusChip variant={source === "supabase" ? "active" : "warning"} size="sm">
                {source === "supabase" ? "Supabase" : "Static-Fallback"}
              </StatusChip>
            }
          />
        </div>

        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55">
            Environment
          </p>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {rows.map((row) => (
              <li
                key={row.label}
                className="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate font-mono text-[11px] text-foreground/80">{row.label}</p>
                  {row.hint && <p className="mt-0.5 text-[10px] text-foreground/50">{row.hint}</p>}
                </div>
                {row.present ? (
                  <StatusChip variant="active" size="sm">gesetzt</StatusChip>
                ) : row.required ? (
                  <StatusChip variant="danger" size="sm">fehlt</StatusChip>
                ) : (
                  <StatusChip variant="neutral" size="sm">optional</StatusChip>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55">
            Deployment
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <DeployTile label="Version" value={deploy.version} />
            <DeployTile label="Environment" value={deploy.vercelEnv} />
            <DeployTile label="Branch" value={deploy.gitBranch ?? "—"} />
            <DeployTile label="Commit" value={deploy.gitSha ?? "—"} />
          </div>
        </div>
      </div>
    </GlassSheet>
  );
}

function StatusRow({ label, chip }: { label: string; chip: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
      <span className="text-xs text-foreground/75">{label}</span>
      {chip}
    </div>
  );
}

function DeployTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/45">{label}</p>
      <p className="mt-0.5 truncate font-mono text-xs text-foreground/85">{value}</p>
    </div>
  );
}
