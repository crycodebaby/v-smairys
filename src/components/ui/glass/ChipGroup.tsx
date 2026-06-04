"use client";

import React from "react";

export type ChipOption = {
  value: string;
  label: string;
};

type ChipGroupProps = {
  options: readonly ChipOption[];
  value: string | null;
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
};

/**
 * Single-Select Chip-Auswahl für Presets/Quick-Picks (Liquid Glass).
 * Touchfreundlich, hoher Kontrast, dezenter Akzent bei Auswahl.
 */
export function ChipGroup({
  options,
  value,
  onChange,
  ariaLabel,
  className = "",
}: ChipGroupProps) {
  return (
    <div role="group" aria-label={ariaLabel} className={"flex flex-wrap gap-2 " + className}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={
              "group relative inline-flex h-9 select-none items-center justify-center overflow-hidden " +
              "rounded-full px-3.5 text-xs font-medium tracking-tight transition-all duration-200 ease-out " +
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45 active:scale-[0.97] " +
              (isActive
                ? "border border-[#d47115]/50 bg-[#d47115]/15 text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_6px_20px_-12px_rgba(212,113,21,0.7)]"
                : "border border-white/10 bg-white/[0.04] text-foreground/70 hover:border-white/20 hover:bg-white/[0.08] hover:text-foreground")
            }
          >
            {isActive && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-[#d47115]/60 to-transparent"
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
