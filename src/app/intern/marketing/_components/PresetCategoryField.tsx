"use client";

import React, { useState } from "react";
import { ChipGroup } from "@/components/ui/glass/ChipGroup";
import type { CampaignBuilderPreset, PresetCategory } from "@/lib/campaign-builder-presets-db";
import type { PresetActionState } from "../actions";

type PresetCategoryFieldProps = {
  category: PresetCategory;
  label: string;
  presets: readonly CampaignBuilderPreset[];
  value: string | null;
  onChange: (value: string) => void;
  onPresetCreated: (preset: CampaignBuilderPreset) => void;
  createPresetAction: (
    prevState: PresetActionState,
    formData: FormData
  ) => Promise<PresetActionState>;
  disabled?: boolean;
};

/**
 * Dynamische Preset-Chips + Inline-Eingabe zum Anlegen neuer Wörter.
 * Presets kommen aus Supabase; nach dem Speichern erscheint der Chip sofort.
 */
export function PresetCategoryField({
  category,
  label,
  presets,
  value,
  onChange,
  onPresetCreated,
  createPresetAction,
  disabled = false,
}: PresetCategoryFieldProps) {
  const [draft, setDraft] = useState("");
  const [state, formAction, isPending] = React.useActionState(createPresetAction, {
    ok: false,
    message: "",
  });

  const categoryPresets = presets.filter((p) => p.category === category);

  React.useEffect(() => {
    if (state.ok && state.preset) {
      onPresetCreated(state.preset);
      onChange(state.preset.value);
      setDraft("");
    }
  }, [state.ok, state.preset, onPresetCreated, onChange]);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-foreground/70">{label}</span>

      {categoryPresets.length === 0 ? (
        <p className="text-[11px] text-foreground/45">Erstes Wort hinzufügen</p>
      ) : (
        <ChipGroup
          ariaLabel={label}
          options={categoryPresets.map((p) => ({ value: p.value, label: p.label }))}
          value={value}
          onChange={onChange}
        />
      )}

      <form action={formAction} className="flex items-stretch gap-2">
        <input type="hidden" name="category" value={category} />
        <input
          name="label"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Eigenes Wort eingeben"
          disabled={disabled || isPending}
          className={
            "min-w-0 flex-1 rounded-xl border border-white/12 bg-white/[0.05] px-3 py-2.5 text-sm " +
            "text-foreground placeholder:text-foreground/35 backdrop-blur-xl " +
            "focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-55"
          }
        />
        <button
          type="submit"
          disabled={disabled || isPending || !draft.trim()}
          aria-label={`${label} hinzufügen`}
          className={
            "inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-white/12 " +
            "bg-white/[0.06] text-foreground/80 transition-[background-color,border-color,transform] duration-200 " +
            "hover:border-[hsl(var(--brand)/0.45)] hover:bg-[hsl(var(--brand)/0.12)] hover:text-foreground " +
            "active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand-glow)/0.55)] " +
            "disabled:cursor-not-allowed disabled:opacity-45"
          }
        >
          <PlusIcon />
        </button>
      </form>

      {state.message && !state.ok && (
        <p className="text-[11px] text-rose-200">{state.message}</p>
      )}
    </div>
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
