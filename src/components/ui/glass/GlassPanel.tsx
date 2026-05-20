import React from "react";

/**
 * Liquid-Glass-Panel für das dunkle High-End-Interface.
 *
 * Drei Tiefen-Stufen:
 *  - subtle   → unauffällige Container (z. B. Debug-Sektion, Inline-Notizen)
 *  - default  → Standard für interaktive Cards
 *  - strong   → Hero-Container (PIN-Gate, Detail-Hero)
 *
 * Visuell:
 *  - Linearer Glas-Verlauf (oben heller, unten dunkler) für echte Tiefe
 *  - Hairline-Highlight oben (Lichtkante)
 *  - Backdrop-Blur + Saturation für die Liquid-Anmutung
 *  - Weicher Außen-Schatten + inset-Highlight via `.glass-surface*` Utility
 */
export type GlassPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  emphasis?: "subtle" | "default" | "strong";
  /** Optional: Außen-Glow in einer Akzentfarbe (z. B. bei Fehler-States). */
  glow?: "none" | "danger" | "success" | "accent";
};

const SURFACE: Record<NonNullable<GlassPanelProps["emphasis"]>, string> = {
  subtle: "glass-surface-subtle",
  default: "glass-surface",
  strong: "glass-surface-strong",
};

const GLOW: Record<NonNullable<GlassPanelProps["glow"]>, string> = {
  none: "",
  danger:
    "ring-1 ring-rose-400/30 shadow-[0_0_0_1px_hsl(345_90%_65%/0.25),0_0_60px_-12px_hsl(345_90%_60%/0.40)]",
  success:
    "ring-1 ring-emerald-400/25 shadow-[0_0_0_1px_hsl(155_80%_55%/0.20),0_0_60px_-12px_hsl(155_70%_50%/0.30)]",
  accent:
    "ring-1 ring-sky-400/25 shadow-[0_0_0_1px_hsl(210_90%_60%/0.20),0_0_60px_-12px_hsl(210_90%_55%/0.30)]",
};

export function GlassPanel({
  children,
  className = "",
  emphasis = "default",
  glow = "none",
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${SURFACE[emphasis]} ${GLOW[glow]} ${className}`}
      {...props}
    >
      {/* Top-Highlight: simuliert die scharfe Lichtkante eines echten
          Glas-Panels. Bewusst sehr schmal, nur 1px Diffusion. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />
      {/* Innere Hairline – seitlich – sehr dezent. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/15 via-transparent to-transparent"
      />
      {children}
    </div>
  );
}
