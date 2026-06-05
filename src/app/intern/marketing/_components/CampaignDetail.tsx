"use client";

import React, { useEffect, useState } from "react";
import { GlassPanel } from "@/components/ui/glass/GlassPanel";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import { StatusChip, type StatusChipVariant } from "@/components/ui/glass/StatusChip";
import { CopyButton } from "@/components/ui/CopyButton";
import { DashButton, dashButtonClasses } from "@/components/intern/DashButton";
import {
  DEFAULT_QR_STYLE,
  QR_STYLE_ORDER,
  QR_STYLE_PRESETS,
  type QrStyleId,
} from "@/lib/qr/qr-styles";
import type { CampaignDetail as CampaignDetailVM } from "./types";
import type { CampaignActionState } from "../actions";
import type { CampaignStatus, CampaignIssue } from "@/lib/marketing-campaigns";

type CampaignFormAction = (
  prevState: CampaignActionState,
  formData: FormData
) => Promise<CampaignActionState>;

type CampaignDetailProps = {
  vm: CampaignDetailVM;
  onEdit?: () => void;
  onDuplicate?: () => void;
  archiveAction?: CampaignFormAction;
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

export function CampaignDetail({
  vm,
  onEdit,
  onDuplicate,
  archiveAction,
  canEdit = false,
}: CampaignDetailProps) {
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

  const [qrStyle, setQrStyle] = useState<QrStyleId>(DEFAULT_QR_STYLE);
  const preset = QR_STYLE_PRESETS[qrStyle];
  const withStyle = (url: string) => `${url}?style=${qrStyle}`;

  return (
    <div key={campaign.slug} className="animate-panel-in flex flex-col gap-5">
      <GlassCard
        emphasis="strong"
        glow={errors.length > 0 ? "danger" : "none"}
        noPadding
      >
        <div className="grid grid-cols-1 gap-5 p-5 sm:p-7 md:grid-cols-[minmax(0,1fr)_15rem] lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-7">
          <div className="flex min-w-0 flex-col gap-5">
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
                {(campaign.region || campaign.city) && (
                  <StatusChip variant="neutral">
                    {[campaign.region, campaign.city].filter(Boolean).join(" · ")}
                  </StatusChip>
                )}
                {campaign.year && <StatusChip variant="neutral">{campaign.year}</StatusChip>}
                {campaign.version && <StatusChip variant="neutral">{campaign.version}</StatusChip>}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] brand-text-soft">
                Print-Asset-Kit
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {campaign.externalTitle || "(Kein externer Titel)"}
              </h2>
              <p className="mt-1 font-mono text-xs text-foreground/55">
                {campaign.internalName} · <span className="text-foreground/40">{campaign.slug}</span>
              </p>
            </div>

            {/* Primäre Aktionen */}
            <div className="flex flex-wrap items-center gap-2">
              <DashButton variant="primary" size="sm" onClick={onEdit} disabled={!canEdit}>
                Bearbeiten
              </DashButton>
              <DashButton variant="secondary" size="sm" onClick={onDuplicate} disabled={!canEdit}>
                Duplizieren
              </DashButton>
              {archiveAction && campaign.id && (
                <ArchiveButton
                  action={archiveAction}
                  id={campaign.id}
                  disabled={!canEdit || campaign.status === "archived"}
                />
              )}
            </div>

            {/* Utility: kopieren + QR + Plausible */}
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
                label="Ziel-URL"
                ariaLabel="UTM-Ziel-URL kopieren"
              />
              <CopyButton
                variant="glass"
                value={plausibleSearchValues}
                label="Plausible-Werte"
                ariaLabel="Plausible-Suchwerte kopieren"
              />
              <a
                href={withStyle(qrSvgUrl)}
                target="_blank"
                rel="noopener noreferrer"
                title={`QR-SVG (${preset.name}) – druckfähig`}
                className={dashButtonClasses("utility", "sm")}
              >
                <ExternalIcon /> QR-SVG
              </a>
              <a
                href={withStyle(qrPngUrl)}
                target="_blank"
                rel="noopener noreferrer"
                title="QR-PNG – Standard (schwarz/weiß), für schnelle Vorschau"
                className={dashButtonClasses("utility", "sm")}
              >
                <ExternalIcon /> QR-PNG
              </a>
              <a
                href={plausibleUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Plausible: utm_campaign = ${campaign.utm_campaign}`}
                className={dashButtonClasses("ghost", "sm")}
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
                key={qrStyle}
                src={withStyle(qrSvgUrl)}
                alt={`QR-Code (${preset.name}) für ${campaign.internalName}`}
                className="relative block aspect-square w-full"
                width={288}
                height={288}
              />
            </div>

            <QrStyleSelector value={qrStyle} onChange={setQrStyle} />
            <QrSafetyHints preset={preset} />

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
            description="Landing-Page inkl. UTM-Parameter."
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

      {campaign.notes && (
        <GlassCard label="Interne Notiz" emphasis="subtle">
          <p className="text-sm leading-relaxed text-foreground/75">{campaign.notes}</p>
        </GlassCard>
      )}
    </div>
  );
}

function ArchiveButton({
  action,
  id,
  disabled,
}: {
  action: CampaignFormAction;
  id: string;
  disabled: boolean;
}) {
  const [state, formAction, isPending] = React.useActionState(action, {
    ok: false,
    message: "",
  });
  const formRef = React.useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message && !state.ok) {
      // eslint-disable-next-line no-console
      console.warn("Archivieren fehlgeschlagen:", state.message);
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm("Kampagne archivieren? Sie leitet danach nicht mehr weiter.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <DashButton type="submit" variant="danger" size="sm" disabled={disabled || isPending}>
        {isPending ? "Archiviert…" : "Archivieren"}
      </DashButton>
    </form>
  );
}

function QrStyleSelector({
  value,
  onChange,
}: {
  value: QrStyleId;
  onChange: (value: QrStyleId) => void;
}) {
  const active = QR_STYLE_PRESETS[value];
  return (
    <div>
      <div role="radiogroup" aria-label="QR-Stil" className="flex flex-col gap-1.5">
        {QR_STYLE_ORDER.map((id) => {
          const p = QR_STYLE_PRESETS[id];
          const isActive = id === value;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(id)}
              className={
                "group flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left " +
                "transition-[background-color,border-color,box-shadow] duration-200 " +
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand-glow)/0.5)] " +
                (isActive
                  ? "border-[hsl(var(--brand)/0.5)] bg-[hsl(var(--brand)/0.12)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16)]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]")
              }
            >
              <span
                className={
                  "text-xs font-medium " +
                  (isActive ? "text-foreground" : "text-foreground/75")
                }
              >
                {p.name}
              </span>
              <span
                aria-hidden="true"
                className={
                  "h-2 w-2 flex-none rounded-full " +
                  (isActive ? "bg-[hsl(var(--brand))]" : "bg-white/15")
                }
              />
            </button>
          );
        })}
      </div>
      <p className="mt-2 px-1 text-[11px] leading-snug text-foreground/55">{active.tagline}</p>
    </div>
  );
}

function QrSafetyHints({
  preset,
}: {
  preset: (typeof QR_STYLE_PRESETS)[QrStyleId];
}) {
  const scanLabel = preset.safety.scan === "high" ? "Hoch" : "Mittel";
  const rows: Array<{ label: string; value: string; strong?: boolean }> = [
    { label: "Scan-Sicherheit", value: scanLabel, strong: true },
    { label: "Empfohlen für", value: preset.safety.recommendedFor },
    { label: "Error Correction", value: preset.errorCorrection },
    { label: "Quiet Zone", value: "OK" },
    { label: "Logo", value: preset.safety.logoLabel },
  ];
  return (
    <dl className="grid grid-cols-1 gap-1 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between gap-2">
          <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/45">
            {r.label}
          </dt>
          <dd
            className={
              "text-[11px] " +
              (r.strong
                ? preset.safety.scan === "high"
                  ? "font-semibold text-emerald-300"
                  : "font-semibold text-amber-300"
                : "text-foreground/80")
            }
          >
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
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
