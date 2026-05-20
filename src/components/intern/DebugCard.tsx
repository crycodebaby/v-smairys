"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/ui/glass/GlassPanel";
import { StatusChip } from "@/components/ui/glass/StatusChip";

type EnvSnapshot = {
  pinConfigured: boolean;
  hasExplicitSecret: boolean;
  hasPlausibleDomain: boolean;
  hasPlausibleSrc: boolean;
  hasSiteUrl: boolean;
};

type DebugCardProps = {
  env: EnvSnapshot;
  campaignsLoaded: boolean;
  campaignsCount: number;
  /** Default-Open-Zustand. Standardmäßig eingeklappt – untergeordnete UI. */
  defaultOpen?: boolean;
};

type Row = {
  label: string;
  required: boolean;
  present: boolean;
  /** Sub-Hinweis, wird unter dem Label gerendert. */
  hint?: string;
};

/**
 * Sehr dezente Debug-Sektion fürs interne Dashboard.
 *
 * Designprinzipien:
 *  - Visuell untergeordnet (`subtle`-Glass, kleinere Schrift, kein Header-CTA)
 *  - Per Default eingeklappt
 *  - Zeigt **nur Anwesenheit** der relevanten ENV-Variablen
 *  - Unterscheidet `required` (Pflicht) und optional klar:
 *    Optional + nicht gesetzt → neutraler "optional"-Chip, kein "nein"-Alarm
 */
export function DebugCard({
  env,
  campaignsLoaded,
  campaignsCount,
  defaultOpen = false,
}: DebugCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  const rows: Row[] = [
    {
      label: "ADMIN_DASHBOARD_PIN",
      required: true,
      present: env.pinConfigured,
      hint: "Pflicht für /kundenlogin und /intern/*",
    },
    {
      label: "NEXT_PUBLIC_PLAUSIBLE_DOMAIN",
      required: false,
      present: env.hasPlausibleDomain,
      hint: "Optional: ohne wird Plausible nicht geladen.",
    },
    {
      label: "NEXT_PUBLIC_SITE_URL",
      required: false,
      present: env.hasSiteUrl,
      hint: "Optional: Fallback `https://smairys.de`. In Preview-Deploys sinnvoll.",
    },
    {
      label: "NEXT_PUBLIC_PLAUSIBLE_SRC",
      required: false,
      present: env.hasPlausibleSrc,
      hint: "Optional: Default ist `script.exclusions.js`.",
    },
    {
      label: "ADMIN_DASHBOARD_SECRET",
      required: false,
      present: env.hasExplicitSecret,
      hint: "Optional: ohne wird das HMAC-Secret aus dem PIN abgeleitet.",
    },
  ];

  const requiredMissing = rows.filter((r) => r.required && !r.present);
  const isHealthy = requiredMissing.length === 0 && campaignsLoaded;

  return (
    <GlassPanel emphasis="subtle" className="px-5 py-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="debug-card-content"
        className="group flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/55">
            Debug & Konfiguration
          </span>
          {isHealthy ? (
            <StatusChip variant="info" size="sm">
              System ok
            </StatusChip>
          ) : (
            <StatusChip variant="danger" size="sm" withDot>
              {requiredMissing.length > 0
                ? `${requiredMissing.length} Pflicht-ENV fehlt`
                : "Konfig prüfen"}
            </StatusChip>
          )}
        </div>
        <Chevron open={open} />
      </button>

      {open && (
        <div id="debug-card-content" className="animate-panel-in mt-4">
          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            <li className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">
              <span className="text-xs text-foreground/75">
                Kampagnen geladen
              </span>
              <StatusChip
                variant={campaignsLoaded ? "active" : "danger"}
                size="sm"
              >
                {campaignsLoaded ? String(campaignsCount) : "0"}
              </StatusChip>
            </li>
            {rows.map((row) => (
              <li
                key={row.label}
                className="flex items-start justify-between gap-3 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate font-mono text-[11px] text-foreground/80">
                    {row.label}
                  </p>
                  {row.hint && (
                    <p className="mt-0.5 text-[10px] text-foreground/50">
                      {row.hint}
                    </p>
                  )}
                </div>
                <DebugChip row={row} />
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] text-foreground/45">
            Es werden ausschließlich Anwesenheit-Flags angezeigt – niemals Werte.
          </p>
        </div>
      )}
    </GlassPanel>
  );
}

function DebugChip({ row }: { row: Row }) {
  if (row.present) {
    return (
      <StatusChip variant="active" size="sm">
        gesetzt
      </StatusChip>
    );
  }
  if (row.required) {
    return (
      <StatusChip variant="danger" size="sm">
        fehlt
      </StatusChip>
    );
  }
  return (
    <StatusChip variant="neutral" size="sm">
      optional
    </StatusChip>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="14"
      height="14"
      aria-hidden="true"
      className={
        "text-foreground/55 transition-transform duration-200 " +
        (open ? "rotate-180" : "rotate-0")
      }
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 8l5 5 5-5"
      />
    </svg>
  );
}
