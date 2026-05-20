"use client";

import { useCallback, useEffect, useState } from "react";

type ChecklistItem = {
  id: string;
  label: string;
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
  { id: "svg", label: "SVG für Druck geprüft (Größe, Quiet Zone)" },
];

type PrintChecklistProps = {
  campaignSlug: string;
};

/**
 * Persistente Druck-Checkliste pro Kampagne.
 *
 * - Speichert den Haken-Stand pro `campaignSlug` in `localStorage`.
 * - Reine UI-Hilfe für Robin – verlässt das Gerät nicht.
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
      // localStorage nicht verfügbar -> stiller Reset.
    }
    setHydrated(true);
  }, [storageKey]);

  const persist = useCallback(
    (next: Record<string, boolean>) => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Quota / Private Mode -> ignorieren.
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-foreground/65">
          {hydrated ? `${completed} / ${total} erledigt (${progress} %)` : "—"}
        </div>
        <button
          type="button"
          onClick={reset}
          className="text-xs font-medium text-foreground/55 underline-offset-2 hover:underline disabled:opacity-50"
          disabled={!hydrated || completed === 0}
        >
          Zurücksetzen
        </button>
      </div>

      <div className="h-1 w-full rounded-full bg-white/10 dark:bg-white/[0.04]">
        <div
          className="h-full rounded-full bg-foreground/70 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="flex flex-col gap-1.5">
        {ITEMS.map((item) => {
          const isChecked = Boolean(checked[item.id]);
          return (
            <li key={item.id}>
              <label
                className={
                  "flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 transition-colors " +
                  "hover:bg-white/15 dark:hover:bg-white/[0.05] " +
                  (isChecked ? "opacity-60" : "opacity-100")
                }
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer accent-foreground"
                  checked={isChecked}
                  onChange={() => toggle(item.id)}
                />
                <span
                  className={`text-sm leading-snug ${
                    isChecked ? "text-foreground/55 line-through" : "text-foreground/85"
                  }`}
                >
                  {item.label}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
