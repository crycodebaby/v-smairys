"use client";

import React, { useMemo, useState, useTransition } from "react";
import { slugify } from "@/lib/marketing-campaigns";
import type {
  CampaignBuilderPreset,
  PresetCategory,
} from "@/lib/campaign-builder-presets-db";
import type { PresetActionState } from "../actions";

type PresetAction = (
  prevState: PresetActionState,
  formData: FormData
) => Promise<PresetActionState>;

type BuilderPresetFieldProps = {
  category: PresetCategory;
  title: string;
  hint?: string;
  presets: readonly CampaignBuilderPreset[];
  value: string | null;
  onChange: (value: string | null) => void;
  onPresetCreated: (preset: CampaignBuilderPreset) => void;
  onPresetRemoved: (presetId: string) => void;
  createPresetAction: PresetAction;
  deactivatePresetAction: PresetAction;
  disabled?: boolean;
};

/**
 * Creatable Preset Chips.
 *
 * Kleines, robustes Pattern für Builder-Wörter:
 * Chips wählen, Eingabe + Plus/Enter erstellt, X soft-deaktiviert.
 * Keine Client-Fetches und keine DB-Abfrage pro Tastendruck.
 */
export function BuilderPresetField({
  category,
  title,
  hint,
  presets,
  value,
  onChange,
  onPresetCreated,
  onPresetRemoved,
  createPresetAction,
  deactivatePresetAction,
  disabled = false,
}: BuilderPresetFieldProps) {
  const [draft, setDraft] = useState("");
  const [feedback, setFeedback] = useState<{
    tone: "success" | "muted" | "error";
    text: string;
  } | null>(null);
  const [pendingCreate, startCreateTransition] = useTransition();
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

  const categoryPresets = useMemo(
    () =>
      presets
        .filter((p) => p.category === category)
        .sort(
          (a, b) =>
            a.sort_order - b.sort_order ||
            a.label.localeCompare(b.label, "de")
        ),
    [presets, category]
  );

  const normalizedDraft = slugify(draft);
  const canCreate =
    !disabled && !pendingCreate && draft.trim().length >= 2 && normalizedDraft.length >= 2;

  const submitDraft = () => {
    if (!canCreate) return;

    const formData = new FormData();
    formData.set("category", category);
    formData.set("label", draft.trim());

    startCreateTransition(async () => {
      const result = await createPresetAction({ ok: false, message: "" }, formData);
      if (result.ok && result.preset) {
        onPresetCreated(result.preset);
        onChange(result.preset.value);
        setDraft("");
        setFeedback({
          tone: result.message.startsWith("Bereits") ? "muted" : "success",
          text: result.message,
        });
        return;
      }

      setFeedback({
        tone: "error",
        text: result.message || "Konnte nicht gespeichert werden.",
      });
    });
  };

  const removePreset = (preset: CampaignBuilderPreset) => {
    if (disabled || pendingRemoveId) return;

    const formData = new FormData();
    formData.set("id", preset.id);
    setPendingRemoveId(preset.id);

    startCreateTransition(async () => {
      const result = await deactivatePresetAction({ ok: false, message: "" }, formData);
      setPendingRemoveId(null);

      if (result.ok) {
        onPresetRemoved(preset.id);
        if (value === preset.value) {
          onChange(null);
        }
        setFeedback({ tone: "muted", text: result.message || "Entfernt" });
        return;
      }

      setFeedback({
        tone: "error",
        text: result.message || "Konnte nicht entfernt werden.",
      });
    });
  };

  return (
    <section className="flex flex-col gap-2.5">
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/75">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--brand))] shadow-[0_0_10px_hsl(var(--brand-glow)/0.55)]"
            />
            {title}
          </h3>
          {hint && <p className="mt-0.5 text-[11px] text-foreground/42">{hint}</p>}
        </div>
        {feedback && (
          <p
            className={
              "shrink-0 text-[11px] " +
              (feedback.tone === "error"
                ? "text-rose-200"
                : feedback.tone === "success"
                  ? "text-emerald-300"
                  : "text-foreground/45")
            }
          >
            {feedback.text}
          </p>
        )}
      </header>

      {categoryPresets.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-3 py-2 text-[11px] text-foreground/45">
          Erstes Wort hinzufügen
        </p>
      ) : (
        <div role="group" aria-label={title} className="flex flex-wrap gap-2">
          {categoryPresets.map((preset) => {
            const active = preset.value === value;
            const removing = pendingRemoveId === preset.id;
            return (
              <span
                key={preset.id}
                className={
                  "group/chip inline-flex min-h-10 max-w-full items-center gap-1.5 rounded-full border py-1 pl-3 pr-1 " +
                  "text-xs font-medium transition-[background-color,border-color,opacity] duration-200 " +
                  (active
                    ? "border-[hsl(var(--brand)/0.52)] bg-[hsl(var(--brand)/0.16)] text-foreground"
                    : "border-white/10 bg-white/[0.045] text-foreground/75 hover:border-white/20 hover:bg-white/[0.075] hover:text-foreground")
                }
              >
                <button
                  type="button"
                  aria-pressed={active}
                  disabled={disabled || removing}
                  onClick={() => onChange(active ? null : preset.value)}
                  className={
                    "min-w-0 truncate rounded-full text-left transition-transform active:scale-[0.98] " +
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand-glow)/0.55)] " +
                    "disabled:opacity-55"
                  }
                >
                  {preset.label}
                </button>
                <button
                  type="button"
                  aria-label={`${preset.label} entfernen`}
                  disabled={disabled || removing}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    removePreset(preset);
                  }}
                  className={
                    "inline-flex h-8 w-8 flex-none items-center justify-center rounded-full text-foreground/45 " +
                    "transition-colors hover:bg-white/[0.08] hover:text-foreground focus-visible:outline-none " +
                    "focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand-glow)/0.45)] disabled:opacity-55"
                  }
                >
                  {removing ? <SpinnerIcon /> : <XIcon />}
                </button>
              </span>
            );
          })}
        </div>
      )}

      <div className="flex items-stretch gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submitDraft();
            }
            if (event.key === "Escape") {
              event.preventDefault();
              setDraft("");
              setFeedback(null);
            }
          }}
          placeholder="Eigenes Wort eingeben"
          disabled={disabled || pendingCreate}
          className={
            "min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5 text-sm " +
            "text-foreground placeholder:text-foreground/32 backdrop-blur-xl transition-colors " +
            "focus:border-[hsl(var(--brand)/0.4)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-glow)/0.28)] " +
            "disabled:opacity-55"
          }
        />
        <button
          type="button"
          onClick={submitDraft}
          disabled={!canCreate}
          aria-label={`${title} hinzufügen`}
          className={
            "inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-white/12 " +
            "bg-white/[0.06] text-foreground/80 transition-[background-color,border-color,transform] duration-200 " +
            "hover:border-[hsl(var(--brand)/0.45)] hover:bg-[hsl(var(--brand)/0.12)] hover:text-foreground " +
            "active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand-glow)/0.55)] " +
            "disabled:cursor-not-allowed disabled:opacity-40"
          }
        >
          {pendingCreate ? <SpinnerIcon /> : <PlusIcon />}
        </button>
      </div>
    </section>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        d="M8 3.5v9M3.5 8h9"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        d="M5 5l6 6M11 5l-6 6"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
      className="animate-spin"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        d="M8 2.5a5.5 5.5 0 0 1 5.5 5.5"
      />
    </svg>
  );
}
