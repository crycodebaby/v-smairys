"use client";

import React from "react";
import { GlassPanel } from "@/components/ui/glass/GlassPanel";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import { StatusChip, type StatusChipVariant } from "@/components/ui/glass/StatusChip";
import { CopyButton } from "@/components/ui/CopyButton";
import { GlassButton } from "@/components/ui/glass/GlassButton";
import { PrintChecklist } from "@/components/intern/PrintChecklist";
import { TestChecklist } from "@/components/intern/TestChecklist";
import type { CampaignDetail as CampaignDetailVM } from "./types";
import type { CampaignStatus, CampaignIssue } from "@/lib/marketing-campaigns";

type CampaignDetailProps = {
  vm: CampaignDetailVM;
  onEdit?: () => void;
  onDuplicate?: () => void;
  canEdit?: boolean;
};

const STATUS_VARIANT_MAP: Record<CampaignStatus, StatusChipVariant> = {
  draft: "draft",
  active: "active",
  paused: "paused",
  archived: "archived",
};

const STATUS_LABEL: Record<CampaignStatus, string> = {
  draft: "Entwurf",
  active: "Live",
  paused: "Pausiert",
  archived: "Archiv",
};

const UTM_FIELDS: Array<{ key: "utm_source" | "utm_medium" | "utm_campaign" | "utm_content"; label: string }> = [
  { key: "utm_source", label: "Source" },
  { key: "utm_medium", label: "Medium" },
  { key: "utm_campaign", label: "Campaign" },
  { key: "utm_content", label: "Content" },
];

export function CampaignDetail({ vm, onEdit, onDuplicate, canEdit = false }: CampaignDetailProps) {
  const {
    campaign,
    shortLink,
    destinationUrl,
    qrSvgUrl,
    qrPngUrl,
    plausibleUrl,
    plausibleSearchValues,
    issues,
    source,
  } = vm;
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  return (
    <div key={campaign.slug} className="animate-panel-in flex flex-col gap-5">
      <GlassCard
        emphasis="strong"
        glow={errors.length > 0 ? "danger" : "none"}
        noPadding
      >
        <div className="grid grid-cols-1 gap-5 p-5 sm:p-7 md:grid-cols-[minmax(0,1fr)_15rem] lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-7">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusChip
                variant={STATUS_VARIANT_MAP[campaign.status]}
                withDot={campaign.status === "active"}
              >
                {STATUS_LABEL[campaign.status]}
              </StatusChip>
              {campaign.medium_label && (
                <StatusChip variant="neutral">{campaign.medium_label}</StatusChip>
              )}
              {campaign.region && (
                <StatusChip variant="neutral">{campaign.region}</StatusChip>
              )}
              {campaign.year && (
                <StatusChip variant="neutral">{campaign.year}</StatusChip>
              )}
              {campaign.version && (
                <StatusChip variant="neutral">{campaign.version}</StatusChip>
              )}
              <StatusChip variant={source === "supabase" ? "active" : "warning"}>
                {source === "supabase" ? "Supabase" : "Static-Fallback"}
              </StatusChip>
            </div>
              <div className="flex flex-none items-center gap-2">
                <GlassButton type="button" size="sm" variant="solid" onClick={onEdit} disabled={!canEdit}>
                  Bearbeiten
                </GlassButton>
                <GlassButton type="button" size="sm" variant="subtle" onClick={onDuplicate} disabled={!canEdit}>
                  Duplizieren
                </GlassButton>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/55">
                Print-Asset-Kit
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {campaign.externalTitle || "(Kein externer Titel)"}
              </h2>
              <p className="mt-1 font-mono text-xs text-foreground/55">
                {campaign.internalName} · <span className="text-foreground/40">{campaign.slug}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <CopyButton
                variant="tonal"
                value={shortLink}
                label="Shortlink"
                ariaLabel="Shortlink kopieren"
                leadingIcon={<LinkIcon />}
              />
              <CopyButton
                variant="glass"
                value={destinationUrl}
                label="UTM-Ziel"
                ariaLabel="UTM-Ziel-URL kopieren"
              />
              <CopyButton
                variant="glass"
                value={plausibleSearchValues}
                label="Plausible-Werte"
                ariaLabel="Plausible-Suchwerte kopieren"
              />
              <a
                href={qrSvgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={assetLinkClassName}
              >
                <ExternalIcon /> QR-SVG
              </a>
              <a
                href={qrPngUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={assetLinkClassName}
              >
                <ExternalIcon /> QR-PNG
              </a>
              <a
                href={plausibleUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Plausible: utm_campaign = ${campaign.utm_campaign}`}
                className={assetLinkClassName}
              >
                <ExternalIcon /> Plausible
              </a>
            </div>
          </div>

          <aside className="relative flex flex-col gap-3 self-start">
            <div className="relative overflow-hidden rounded-2xl border border-white/25 bg-white p-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]">
              <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(closest-side,rgba(255,255,255,0.85),rgba(255,255,255,0))]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrSvgUrl}
                alt={`QR-Code für ${campaign.internalName}`}
                className="relative block aspect-square w-full"
                width={288}
                height={288}
              />
            </div>
            <p className="text-center font-mono text-[11px] text-foreground/55">
              Codiert: <span className="break-all text-foreground/70">{shortLink}</span>
            </p>
          </aside>
        </div>
      </GlassCard>

      <section>
        <SectionLabel>UTM-Parameter</SectionLabel>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {UTM_FIELDS.map(({ key, label }) => (
            <UtmTile key={key} label={label} value={campaign[key]} />
          ))}
        </div>
      </section>

      <section>
        <SectionLabel>Links</SectionLabel>
        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <LinkRow
            title="Shortlink (Druck)"
            description="/go/[slug] – 307-Redirect mit UTMs. Nur status=active leitet weiter."
            value={shortLink}
          />
          <LinkRow
            title="Ziel-URL (nach Redirect)"
            description="Landing mit UTM-Parametern – Auswertung in Plausible."
            value={destinationUrl}
          />
        </div>
      </section>

      {(errors.length > 0 || warnings.length > 0) && (
        <section>
          <SectionLabel>Validierung</SectionLabel>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[...errors, ...warnings].map((issue, i) => (
              <IssueRow key={`${issue.field}-${i}`} issue={issue} />
            ))}
          </ul>
        </section>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <GlassCard
          label="Druck"
          title="Druck-Checkliste"
          description="Fortschritt wird nur lokal im Browser gespeichert."
        >
          <PrintChecklist campaignSlug={campaign.slug} />
        </GlassCard>

        <GlassCard
          label="Test"
          title="Test-Checkliste"
          description="Vor Verteilung: Redirect, UTMs und Plausible-Goals prüfen."
        >
          <TestChecklist campaignSlug={campaign.slug} />
        </GlassCard>
      </div>

      {campaign.notes && (
        <GlassCard label="Interne Notiz" emphasis="subtle">
          <p className="text-sm leading-relaxed text-foreground/75">{campaign.notes}</p>
        </GlassCard>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55">
      {children}
    </h3>
  );
}

function UtmTile({ label, value }: { label: string; value: string }) {
  const missing = !value;
  return (
    <GlassPanel emphasis="subtle" className="px-3.5 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/55">
        {label}
      </p>
      <p
        className={
          "mt-1 break-all font-mono text-xs leading-snug " +
          (missing ? "text-rose-300" : "text-foreground/90")
        }
      >
        {missing ? "— fehlt —" : value}
      </p>
    </GlassPanel>
  );
}

function LinkRow({
  title,
  description,
  value,
}: {
  title: string;
  description: string;
  value: string;
}) {
  return (
    <GlassPanel emphasis="subtle" className="flex flex-col gap-2 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-[11px] text-foreground/55">{description}</p>
        </div>
        <CopyButton
          variant="glass"
          size="xs"
          value={value}
          label="Kopieren"
          ariaLabel={`${title} kopieren`}
        />
      </div>
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1.5 font-mono text-[11px] leading-snug text-foreground/85 underline-offset-2 transition-colors hover:bg-white/[0.08] hover:text-foreground hover:underline"
      >
        {value}
      </a>
    </GlassPanel>
  );
}

function IssueRow({ issue }: { issue: CampaignIssue }) {
  const isError = issue.severity === "error";
  return (
    <li
      className={
        "flex items-start gap-3 rounded-lg border px-3 py-2.5 " +
        (isError
          ? "border-rose-400/30 bg-rose-400/[0.08]"
          : "border-amber-400/30 bg-amber-400/[0.06]")
      }
    >
      <span
        className={
          "mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full text-[10px] font-bold " +
          (isError ? "bg-rose-400/30 text-rose-100" : "bg-amber-400/30 text-amber-100")
        }
        aria-hidden="true"
      >
        {isError ? "!" : "?"}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/70">
          {issue.field}
        </p>
        <p className="mt-0.5 text-xs leading-snug text-foreground/85">{issue.message}</p>
      </div>
    </li>
  );
}

const assetLinkClassName =
  "inline-flex h-8 select-none items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 text-xs font-medium text-foreground/85 backdrop-blur-xl transition-colors hover:border-white/20 hover:bg-white/[0.12]";

function LinkIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.5 9.5l3-3M5.5 8L4 9.5a2.5 2.5 0 0 0 3.5 3.5L9 11.5M10.5 8L12 6.5A2.5 2.5 0 0 0 8.5 3L7 4.5"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 3h4v4M12.5 3.5L7 9M11.5 9.5V12a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 12V6A1.5 1.5 0 0 1 4 4.5h2.5"
      />
    </svg>
  );
}
