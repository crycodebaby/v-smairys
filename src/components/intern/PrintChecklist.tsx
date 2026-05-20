"use client";

import { useCallback, useEffect, useState } from "react";

type ChecklistItem = {
  id: string;
  label: string;
  hint?: string;
};

const ITEMS: readonly ChecklistItem[] = [
  { id: "open", label: "QR-Link öffnet im Browser" },
  { id: "redirect", label: "307-Redirect funktioniert" },
  { id: "utm", label: "UTM-Parameter in URL vorhanden" },
  { id: "realtime", label: "Plausible Realtime zeigt Besuch" },
  { id: "cta", label: "CTA-Click kommt in Plausible an" },
  { id: "attribution", label: "Kontaktformular übernimmt Attribution" },
  { id: "iphone", label: "QR-Code mit iPhone getestet" },
  { id: "android", label: "QR-Code mit Android getestet" },
  { id: "svg", label: "SVG für Druck geprüft", hint: "Größe, Quiet Zone, Kontrast" },
];

type PrintChecklistProps = {
  campaignSlug: string;
};

/**
 * Persistente Druck-Checkliste pro Kampagne.
 *
 * - Pro Slug ein eigener `localStorage`-Key
 * - Reine UI-Hilfe – verlässt das Gerät nicht
 * - Custom-Checkbox mit Glass-Optik für konsistentes Erscheinungsbild
 */
export function PrintChecklist({ campaignSlug }: PrintChecklistProps) {
  const storageKey = `smairys_print_checklist:${campaignSlug}`;
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (parsed && typeof parsed === "object") {
          const safe: Record<string, boolean> = {};
          for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
            if (typeof v === "boolean") safe[k] = v;
          }
          setChecked(safe);
        }
      }
    } catch {
      /* localStorage nicht verfügbar */
    }
    setHydrated(true);
  }, [storageKey]);

  const persist = useCallback(
    (next: Record<string, boolean>) => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* Quota / Private Mode */
      }
    },
    [storageKey]
  );

  const toggle = useCallback(
    (id: string) => {
      setChecked((prev) => {
        const next = { ...prev, [id]: !prev[id] };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const reset = useCallback(() => {
    setChecked({});
    persist({});
  }, [persist]);

  const completed = Object.values(checked).filter(Boolean).length;
  const total = ITEMS.length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  const isDone = hydrated && completed === total;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={
              "text-[11px] font-semibold uppercase tracking-[0.18em] " +
              (isDone ? "text-emerald-200" : "text-foreground/60")
            }
          >
            {hydrated ? `${completed} / ${total} erledigt` : "—"}
          </span>
          {isDone && (
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-100">
              Bereit zum Druck
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={reset}
          className="text-[11px] font-medium text-foreground/55 underline-offset-2 transition-colors hover:text-foreground hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!hydrated || completed === 0}
        >
          Zurücksetzen
        </button>
      </div>

      {/* Progress-Bar mit weichem Gradient. */}
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={
            "h-full rounded-full transition-[width] duration-500 ease-out " +
            (isDone
              ? "bg-gradient-to-r from-emerald-300 via-teal-300 to-sky-300"
              : "bg-gradient-to-r from-white/70 via-white/85 to-white")
          }
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="flex flex-col gap-1">
        {ITEMS.map((item) => {
          const isChecked = Boolean(checked[item.id]);
          return (
            <li key={item.id}>
              <label
                className={
                  "group flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 transition-colors " +
                  "hover:bg-white/[0.04]"
                }
              >
                {/* Custom Checkbox mit Glas-Optik */}
                <span className="relative mt-0.5 inline-flex h-4 w-4 items-center justify-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={isChecked}
                    onChange={() => toggle(item.id)}
                  />
                  <span
                    className={
                      "absolute inset-0 rounded-[5px] border transition-all duration-150 " +
                      (isChecked
                        ? "border-emerald-300/60 bg-emerald-300/20 shadow-[0_0_0_3px_hsl(155_70%_55%/0.08)]"
                        : "border-white/20 bg-white/[0.05] group-hover:border-white/30")
                    }
                  />
                  {isChecked && (
                    <svg
                      viewBox="0 0 16 16"
                      width="10"
                      height="10"
                      aria-hidden="true"
                      className="relative z-10 text-emerald-200"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.5 8.5l3 3 6-6.5"
                      />
                    </svg>
                  )}
                </span>

                <span className="flex min-w-0 flex-col">
                  <span
                    className={
                      "text-sm leading-snug transition-colors " +
                      (isChecked
                        ? "text-foreground/50 line-through"
                        : "text-foreground/90")
                    }
                  >
                    {item.label}
                  </span>
                  {item.hint && (
                    <span className="text-[11px] text-foreground/45">
                      {item.hint}
                    </span>
                  )}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
