"use client";

import React, { useId, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type SegmentedTone = "default" | "live" | "draft" | "pause" | "archiv";

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  /** Akzentfarbe des aktiven Segments (Status-Hierarchie). */
  tone?: SegmentedTone;
};

/* Aktive Segment-Fläche (Hintergrund + Schatten) – Text bleibt hell. */
const ACTIVE_BG: Record<SegmentedTone, string> = {
  default:
    "bg-white/[0.14] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_6px_18px_-10px_rgba(0,0,0,0.6)]",
  live:
    "bg-emerald-400/[0.18] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_6px_18px_-10px_hsl(155_80%_50%/0.6)]",
  draft:
    "bg-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_6px_18px_-10px_rgba(0,0,0,0.6)]",
  pause:
    "bg-amber-400/[0.18] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_6px_18px_-10px_hsl(38_92%_55%/0.6)]",
  archiv:
    "bg-[hsl(var(--brand)/0.18)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16),0_6px_18px_-10px_hsl(var(--brand-glow)/0.6)]",
};

const ACTIVE_TEXT: Record<SegmentedTone, string> = {
  default: "text-foreground",
  live: "text-emerald-50",
  draft: "text-foreground",
  pause: "text-amber-50",
  archiv: "text-foreground",
};

type GlassSegmentedProps<T extends string> = {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
};

/**
 * iPadOS-inspiriertes Segmented Control auf Liquid-Glass-Basis.
 *
 * - role="radiogroup", Pfeiltasten navigieren, Home/End springen
 * - aktive Auswahl als animierte Glas-Kapsel (framer-motion `layoutId`),
 *   die beim Wechsel weich zur neuen Option gleitet (~200ms)
 * - `prefers-reduced-motion` deaktiviert die Layout-Animation
 */
export function GlassSegmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className = "",
}: GlassSegmentedProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduceMotion = useReducedMotion();
  const layoutId = useId();

  const move = (delta: number) => {
    const idx = options.findIndex((o) => o.value === value);
    const next = (idx + delta + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={
        "inline-flex w-full items-center gap-1 rounded-full border border-white/10 " +
        "bg-white/[0.04] p-1 backdrop-blur-xl " +
        className
      }
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          move(1);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          move(-1);
        } else if (e.key === "Home") {
          e.preventDefault();
          onChange(options[0].value);
          refs.current[0]?.focus();
        } else if (e.key === "End") {
          e.preventDefault();
          const last = options.length - 1;
          onChange(options[last].value);
          refs.current[last]?.focus();
        }
      }}
    >
      {options.map((option, i) => {
        const isActive = option.value === value;
        const tone = option.tone ?? "default";
        return (
          <button
            key={option.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={
              "group relative inline-flex h-9 flex-1 select-none items-center justify-center " +
              "rounded-full px-3 text-xs font-medium tracking-tight " +
              "transition-colors duration-200 ease-out " +
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 " +
              (isActive ? ACTIVE_TEXT[tone] : "text-foreground/60 hover:text-foreground/90")
            }
          >
            {isActive && (
              <motion.span
                aria-hidden="true"
                layoutId={reduceMotion ? undefined : `${layoutId}-active`}
                transition={{ type: "spring", stiffness: 520, damping: 40, mass: 0.7 }}
                className={
                  "pointer-events-none absolute inset-0 rounded-full " + ACTIVE_BG[tone]
                }
              >
                <span className="pointer-events-none absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </motion.span>
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
