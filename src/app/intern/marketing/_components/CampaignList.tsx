"use client";

import React, { useId, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { StatusChip, type StatusChipVariant } from "@/components/ui/glass/StatusChip";
import { DashButton } from "@/components/intern/DashButton";
import type { CampaignSummary } from "./types";

type StatusFilter = "all" | CampaignSummary["status"];

type CampaignListProps = {
  campaigns: readonly CampaignSummary[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
  onNew?: () => void;
  canCreate?: boolean;
  source: "supabase" | "static";
};

const STATUS_VARIANT_MAP: Record<CampaignSummary["status"], StatusChipVariant> = {
  draft: "draft",
  active: "active",
  paused: "paused",
  archived: "archived",
};

const STATUS_LABEL: Record<CampaignSummary["status"], string> = {
  draft: "Entwurf",
  active: "Live",
  paused: "Pausiert",
  archived: "Archiv",
};

const FILTER_OPTIONS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "Alle" },
  { id: "active", label: "Live" },
  { id: "draft", label: "Entwurf" },
  { id: "paused", label: "Pause" },
  { id: "archived", label: "Archiv" },
];

/**
 * Linke Spalte: Info-Bereich (Counts + Datenquelle), + Neue Kampagne,
 * clientseitige Suche (Name, Slug, Region, Stadt) und Status-Filter über
 * bereits geladene Kampagnen. Keine DB-Abfrage pro Tastendruck.
 */
export function CampaignList({
  campaigns,
  selectedSlug,
  onSelect,
  onNew,
  canCreate = false,
  source,
}: CampaignListProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const reduceMotion = useReducedMotion();
  const pillId = useId();

  const counts = useMemo(() => {
    let active = 0;
    let draft = 0;
    let archived = 0;
    for (const c of campaigns) {
      if (c.status === "active") active += 1;
      else if (c.status === "draft") draft += 1;
      else if (c.status === "archived") archived += 1;
    }
    return { total: campaigns.length, active, draft, archived };
  }, [campaigns]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return campaigns.filter((c) => {
      if (filter !== "all" && c.status !== filter) return false;
      if (!q) return true;
      const hay = [c.slug, c.internalName, c.externalTitle, c.region ?? "", c.city ?? ""]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [campaigns, query, filter]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      {/* Info-Bereich: kompakte Counts + Datenquelle */}
      <div className="grid grid-cols-3 gap-1.5">
        <Stat label="Gesamt" value={counts.total} tone="brand" />
        <Stat label="Live" value={counts.active} tone="live" />
        <Stat label="Entwurf" value={counts.draft} tone="muted" />
      </div>
      <div className="flex items-center justify-between gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
          Archiv {counts.archived}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-foreground/65">
          <span
            aria-hidden="true"
            className={
              "inline-block h-1.5 w-1.5 rounded-full " +
              (source === "supabase"
                ? "bg-emerald-400 shadow-[0_0_8px_hsl(155_80%_50%/0.7)]"
                : "bg-amber-400 shadow-[0_0_8px_hsl(38_92%_55%/0.7)]")
            }
          />
          {source === "supabase" ? "Supabase" : "Static-Fallback"}
        </span>
      </div>

      <DashButton
        variant="primary"
        size="sm"
        onClick={onNew}
        disabled={!canCreate}
        className="w-full"
        leadingIcon={<PlusIcon />}
      >
        Neue Kampagne
      </DashButton>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground/45" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name, Slug, Region, Stadt"
          aria-label="Kampagne suchen"
          className={
            "block h-9 w-full rounded-full border border-white/10 bg-white/[0.05] pl-8 pr-3 " +
            "text-sm text-foreground placeholder:text-foreground/40 " +
            "backdrop-blur-xl transition-colors duration-200 " +
            "focus:border-[hsl(var(--brand)/0.5)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-glow)/0.35)]"
          }
        />
      </div>

      <div className="flex flex-wrap gap-1">
        {FILTER_OPTIONS.map((opt) => {
          const isActive = opt.id === filter;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFilter(opt.id)}
              aria-pressed={isActive}
              className={
                "relative rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors duration-200 " +
                (isActive
                  ? "text-foreground"
                  : "text-foreground/60 hover:text-foreground/90")
              }
            >
              {isActive && (
                <motion.span
                  aria-hidden="true"
                  layoutId={reduceMotion ? undefined : `${pillId}-filter`}
                  transition={{ type: "spring", stiffness: 520, damping: 40, mass: 0.7 }}
                  className="absolute inset-0 rounded-full border border-[hsl(var(--brand)/0.45)] bg-[hsl(var(--brand)/0.16)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)]"
                />
              )}
              <span className="relative z-10">{opt.label}</span>
            </button>
          );
        })}
      </div>

      <div className="-mx-1 flex flex-1 flex-col gap-1.5 overflow-y-auto px-1">
        {filtered.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-white/10 px-4 py-6 text-center">
            <p className="text-sm font-medium text-foreground/75">Keine Kampagne gefunden</p>
            <p className="mt-1 text-xs text-foreground/50">Suche anpassen oder leeren.</p>
          </div>
        ) : (
          filtered.map((c) => {
            const isSelected = c.slug === selectedSlug;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => onSelect(c.slug)}
                aria-current={isSelected ? "true" : undefined}
                className={
                  "group relative w-full overflow-hidden rounded-xl border px-3 py-3 text-left " +
                  "transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out " +
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand-glow)/0.5)] " +
                  (isSelected
                    ? "border-[hsl(var(--brand)/0.45)] bg-[hsl(var(--brand)/0.1)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_8px_28px_-12px_hsl(var(--brand-glow)/0.5)]"
                    : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.06]")
                }
              >
                {isSelected && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-gradient-to-b from-[hsl(var(--brand))] via-[hsl(var(--brand-soft))] to-[hsl(var(--brand)/0.3)]"
                  />
                )}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {c.externalTitle || "(Kein Titel)"}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-foreground/55">
                      {c.internalName}
                    </p>
                  </div>
                  <StatusChip
                    variant={STATUS_VARIANT_MAP[c.status]}
                    size="sm"
                    withDot={c.status === "active"}
                  >
                    {STATUS_LABEL[c.status]}
                  </StatusChip>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-foreground/55">
                  <span className="truncate font-mono">{c.slug}</span>
                  {(c.region || c.city) && (
                    <span className="truncate">
                      {[c.region, c.city].filter(Boolean).join(" · ")}
                    </span>
                  )}
                </div>
                {c.issueCount > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {c.errorCount > 0 && (
                      <span className="rounded-full border border-rose-400/30 bg-rose-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-rose-100">
                        {c.errorCount} Fehler
                      </span>
                    )}
                    {c.warningCount > 0 && (
                      <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-100">
                        {c.warningCount} Warnungen
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>

      <p className="text-[10px] text-foreground/40">
        {filtered.length} von {campaigns.length} Kampagnen
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "brand" | "live" | "muted";
}) {
  const valueClass =
    tone === "brand"
      ? "brand-text"
      : tone === "live"
        ? "text-emerald-300"
        : "text-foreground/85";
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] px-2.5 py-2 text-center">
      <p className={"text-lg font-semibold leading-none " + valueClass}>{value}</p>
      <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground/45">
        {label}
      </p>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M8 3.5v9M3.5 8h9" />
    </svg>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        d="M11.5 11.5L14 14M7 12.5A5.5 5.5 0 1 1 7 1.5a5.5 5.5 0 0 1 0 11Z"
      />
    </svg>
  );
}
