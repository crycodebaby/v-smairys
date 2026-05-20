"use client";

import React, { useMemo, useState } from "react";
import { StatusChip, type StatusChipVariant } from "@/components/ui/glass/StatusChip";
import type { CampaignSummary } from "./types";

type CampaignListProps = {
  campaigns: readonly CampaignSummary[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
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

type StatusFilter = "all" | CampaignSummary["status"];

const FILTER_OPTIONS: Array<{ id: StatusFilter; label: string }> = [
  { id: "all", label: "Alle" },
  { id: "active", label: "Live" },
  { id: "draft", label: "Entwurf" },
  { id: "paused", label: "Pause" },
  { id: "archived", label: "Archiv" },
];

/**
 * Linke Spalte des Master-Detail-Layouts.
 *
 * - Kompakte Such- + Filter-Leiste
 * - Liste mit Status-Chip, internem Namen, Startdatum
 * - Aktive Auswahl optisch hervorgehoben (Inner-Highlight + Akzent-Border)
 * - Bei Auswahl: visuelles Press-Feedback
 */
export function CampaignList({
  campaigns,
  selectedSlug,
  onSelect,
}: CampaignListProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return campaigns.filter((c) => {
      if (filter !== "all" && c.status !== filter) return false;
      if (!q) return true;
      const hay = [
        c.slug,
        c.internalName,
        c.externalTitle,
        c.utm_source,
        c.utm_campaign,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [campaigns, query, filter]);

  return (
    <div className="flex h-full flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground/45" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Kampagne suchen"
          aria-label="Kampagne suchen"
          className={
            "block h-9 w-full rounded-full border border-white/10 bg-white/[0.05] pl-8 pr-3 " +
            "text-sm text-foreground placeholder:text-foreground/40 " +
            "backdrop-blur-xl transition-colors duration-200 " +
            "focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
          }
        />
      </div>

      {/* Filter */}
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
                "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors duration-200 " +
                (isActive
                  ? "border-white/30 bg-white/15 text-foreground"
                  : "border-white/10 bg-white/[0.04] text-foreground/65 hover:border-white/20 hover:text-foreground")
              }
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Liste */}
      <div className="-mx-1 flex flex-1 flex-col gap-1.5 overflow-y-auto px-1">
        {filtered.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-white/10 px-4 py-6 text-center">
            <p className="text-sm font-medium text-foreground/75">
              Keine Kampagne gefunden
            </p>
            <p className="mt-1 text-xs text-foreground/50">
              Filter ändern oder Suche leeren.
            </p>
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
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 " +
                  (isSelected
                    ? "border-white/25 bg-white/[0.10] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_8px_28px_-12px_rgba(0,0,0,0.55)]"
                    : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.06]")
                }
              >
                {/* Akzent-Strich links bei Selektion */}
                {isSelected && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-gradient-to-b from-white/90 via-white/60 to-white/30"
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
                  {c.startDate && <span>{c.startDate}</span>}
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
