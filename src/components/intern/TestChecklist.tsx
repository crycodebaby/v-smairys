"use client";

import { useCallback, useEffect, useState } from "react";

type ChecklistItem = {
  id: string;
  label: string;
  hint?: string;
};

const ITEMS: readonly ChecklistItem[] = [
  { id: "shortlink", label: "Shortlink öffnet im Browser" },
  { id: "redirect307", label: "Redirect ist 307 (nicht 301/302)" },
  { id: "utm", label: "UTM-Parameter in der Ziel-URL korrekt" },
  { id: "public", label: "Zielseite ist öffentlich erreichbar" },
  { id: "realtime", label: "Plausible Realtime erkennt einen Besuch" },
  { id: "phone", label: "Goal phone_click funktioniert" },
  { id: "calendar", label: "Goal calendar_click funktioniert" },
  { id: "form", label: "Goal form_submit_success funktioniert" },
];

type TestChecklistProps = {
  campaignSlug: string;
};

/**
 * Persistente Test-Checkliste pro Kampagne (nur UI-Hilfe, localStorage).
 */
export function TestChecklist({ campaignSlug }: TestChecklistProps) {
  const storageKey = `smairys_test_checklist:${campaignSlug}`;
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
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  const doneCount = ITEMS.filter((item) => checked[item.id]).length;

  if (!hydrated) {
    return <p className="text-xs text-foreground/50">Checkliste lädt…</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2">
        {ITEMS.map((item) => {
          const isChecked = Boolean(checked[item.id]);
          return (
            <li key={item.id}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 transition-colors hover:bg-white/[0.07]">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(item.id)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/25 bg-white/10 accent-white"
                />
                <span className="min-w-0">
                  <span className="block text-sm text-foreground/90">{item.label}</span>
                  {item.hint && (
                    <span className="mt-0.5 block text-[11px] text-foreground/50">
                      {item.hint}
                    </span>
                  )}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center justify-between gap-3 text-[11px] text-foreground/50">
        <span>
          {doneCount} / {ITEMS.length} erledigt
        </span>
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-foreground/65 transition-colors hover:border-white/20 hover:text-foreground"
        >
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}
