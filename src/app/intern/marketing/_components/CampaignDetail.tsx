"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import { StatusChip, type StatusChipVariant } from "@/components/ui/glass/StatusChip";
import { DashButton } from "@/components/intern/DashButton";
import { CopyField } from "@/components/intern/CopyField";
import { QrSheet } from "./QrSheet";
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
    issues,
  } = vm;
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  const [qrOpen, setQrOpen] = useState(false);

  return (
    <div key={campaign.slug} className="animate-panel-in flex flex-col gap-4">
      <GlassCard emphasis="strong" glow={errors.length > 0 ? "danger" : "none"} noPadding>
        <div className="flex flex-col gap-5 p-4 sm:p-6">
          {/* Meta-Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusChip
              variant={STATUS_VARIANT_MAP[campaign.status]}
              withDot={campaign.status === "active"}
            >
              {STATUS_LABEL[campaign.status]}
            </StatusChip>
            {campaign.medium_label && <StatusChip variant="neutral">{campaign.medium_label}</StatusChip>}
            {(campaign.region || campaign.city) && (
              <StatusChip variant="neutral">
                {[campaign.region, campaign.city].filter(Boolean).join(" · ")}
              </StatusChip>
            )}
            {campaign.year && <StatusChip variant="neutral">{campaign.year}</StatusChip>}
            {campaign.version && <StatusChip variant="neutral">{campaign.version}</StatusChip>}
          </div>

          {/* Titel */}
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {campaign.externalTitle || "(Kein externer Titel)"}
            </h2>
            <p className="mt-1 break-all font-mono text-xs text-foreground/55">
              {campaign.internalName} · <span className="text-foreground/40">{campaign.slug}</span>
            </p>
          </div>

          {/* Hauptaktionen */}
          <div className="flex flex-wrap items-center gap-2">
            <DashButton variant="primary" size="sm" onClick={onEdit} disabled={!canEdit}>
              Bearbeiten
            </DashButton>
            <DashButton variant="secondary" size="sm" onClick={onDuplicate} disabled={!canEdit}>
              Duplizieren
            </DashButton>
            <DashButton variant="utility" size="sm" onClick={() => setQrOpen(true)} leadingIcon={<QrIcon />}>
              QR anzeigen
            </DashButton>
            {archiveAction && campaign.id && (
              <ArchiveButton
                action={archiveAction}
                id={campaign.id}
                disabled={!canEdit || campaign.status === "archived"}
              />
            )}
          </div>

          {/* Copy-on-click Felder */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <CopyField label="Shortlink" value={shortLink} mono wrap className="sm:col-span-2" />
            <CopyField label="Ziel-URL (UTM)" value={destinationUrl} mono wrap className="sm:col-span-2" />
            <CopyField label="UTM Source" value={campaign.utm_source} mono />
            <CopyField label="UTM Medium" value={campaign.utm_medium} mono />
            <CopyField label="UTM Campaign" value={campaign.utm_campaign} mono />
            <CopyField label="UTM Content" value={campaign.utm_content} mono />
          </div>
        </div>
      </GlassCard>

      {(errors.length > 0 || warnings.length > 0) && (
        <section>
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55">
            Validierung
          </h3>
          <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
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

      <QrSheet
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        title={campaign.externalTitle || campaign.internalName}
        qrSvgUrl={qrSvgUrl}
        qrPngUrl={qrPngUrl}
        shortLink={shortLink}
      />
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
  const [, formAction, isPending] = React.useActionState(action, {
    ok: false,
    message: "",
  });

  return (
    <form
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

function QrIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
        d="M2.5 2.5h4v4h-4zM9.5 2.5h4v4h-4zM2.5 9.5h4v4h-4zM9.5 9.5h1.5v1.5H9.5zM12.5 9.5h1v1h-1zM9.5 12.5h1v1h-1zM12 12h1.5v1.5H12z"
      />
    </svg>
  );
}
