"use client";

import React from "react";

/**
 * Liquid-Glass-Button für das dunkle Interface.
 *
 * - Standardvariante `subtle`: dezent, sekundäre Aktionen.
 * - `solid`: leicht stärker; primärer CTA innerhalb einer Glas-Oberfläche.
 * - `ghost`: nur Hover-Glow, kein dauerhafter Hintergrund.
 * - `tonal`: heller akzent, z. B. für Detail-Toolbar.
 *
 * Microinteractions:
 *  - Hover: subtiler Chroma/RGB-Glow im Inneren des Buttons
 *  - Pressed: leicht skaliert, Glow intensiver
 *  - Focus: feiner Außen-Ring (Tastatur-A11y)
 *
 * Reine UI-Primitive – kein Tracking eingebaut.
 */
export type GlassButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "subtle" | "solid" | "ghost" | "tonal";
  size?: "sm" | "md" | "lg";
  /** Optional: Inhalt links vor dem Label (Icon). */
  leadingIcon?: React.ReactNode;
};

const SIZE = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-6 text-base",
} as const;

const VARIANT = {
  subtle:
    "bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 hover:border-white/20 text-foreground/85 backdrop-blur-xl",
  solid:
    "bg-white/[0.14] hover:bg-white/[0.22] border border-white/20 hover:border-white/30 text-foreground backdrop-blur-xl",
  ghost:
    "bg-transparent hover:bg-white/[0.06] border border-transparent hover:border-white/10 text-foreground/80",
  tonal:
    "bg-white/[0.10] hover:bg-white/[0.16] border border-white/15 hover:border-white/25 text-foreground backdrop-blur-xl",
} as const;

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    { className = "", variant = "subtle", size = "md", leadingIcon, children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={
          "group relative inline-flex select-none items-center justify-center gap-2 " +
          "overflow-hidden rounded-full font-medium tracking-tight " +
          "transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out " +
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 " +
          "active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-inherit " +
          `${VARIANT[variant]} ${SIZE[size]} ${className}`
        }
        {...props}
      >
        {/* Chroma-Glow: erscheint nur beim Hover. Drei farbige Punkte unter
            dem Button, weichgezeichnet → wirkt wie iridescent light leak. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100"
        >
          <span className="absolute -left-6 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-fuchsia-500/40 blur-2xl" />
          <span className="absolute left-1/2 top-1/2 h-16 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/30 blur-2xl" />
          <span className="absolute -right-6 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-violet-400/40 blur-2xl" />
        </span>
        {/* Top-Highlight Hairline */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />
        {leadingIcon && (
          <span className="relative -ml-0.5 inline-flex h-4 w-4 items-center justify-center opacity-90">
            {leadingIcon}
          </span>
        )}
        <span className="relative">{children}</span>
      </button>
    );
  }
);

GlassButton.displayName = "GlassButton";
