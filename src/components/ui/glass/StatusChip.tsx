import React from "react";

/**
 * Status-Chip für das interne Dashboard.
 *
 * - Subtile Glas-Optik, kein knalliger Pill
 * - Tonale Akzentfarbe je nach Variante
 * - Optional mit einem Punkt vor dem Label (z. B. live-Indikator)
 */
export type StatusChipVariant =
  | "draft"
  | "active"
  | "paused"
  | "archived"
  | "info"
  | "warning"
  | "danger"
  | "neutral";

type StatusChipProps = {
  variant?: StatusChipVariant;
  children: React.ReactNode;
  /** Aktiver Live-Dot vor dem Label (z. B. für `active`-Kampagnen). */
  withDot?: boolean;
  /** Kompakte Variante, kleinere Höhe + kleinere Schrift. */
  size?: "sm" | "md";
  className?: string;
};

/**
 * Map: Variante → [Outer-Border + Tinte, Text, Dot-Farbe]
 *
 * Wir nutzen bewusst niedrige Alpha-Werte für die Tinte,
 * damit sich der Chip in jedes Glass-Panel einfügt.
 */
const VARIANT_STYLES: Record<
  StatusChipVariant,
  { wrap: string; text: string; dot: string }
> = {
  draft: {
    wrap: "border-slate-300/25 bg-slate-200/[0.07]",
    text: "text-slate-100",
    dot: "bg-slate-300",
  },
  active: {
    wrap: "border-emerald-400/30 bg-emerald-400/10",
    text: "text-emerald-100",
    dot: "bg-emerald-300",
  },
  paused: {
    wrap: "border-amber-400/35 bg-amber-400/10",
    text: "text-amber-100",
    dot: "bg-amber-300",
  },
  archived: {
    wrap: "border-white/12 bg-white/[0.05]",
    text: "text-foreground/60",
    dot: "bg-white/45",
  },
  info: {
    wrap: "border-[hsl(var(--brand)/0.35)] bg-[hsl(var(--brand)/0.1)]",
    text: "text-[hsl(28_90%_82%)]",
    dot: "bg-[hsl(var(--brand))]",
  },
  warning: {
    wrap: "border-amber-400/40 bg-amber-400/10",
    text: "text-amber-100",
    dot: "bg-amber-300",
  },
  danger: {
    wrap: "border-rose-400/40 bg-rose-400/10",
    text: "text-rose-100",
    dot: "bg-rose-300",
  },
  neutral: {
    wrap: "border-white/15 bg-white/5",
    text: "text-foreground/80",
    dot: "bg-white/60",
  },
};

const SIZE_STYLES = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
} as const;

export function StatusChip({
  variant = "neutral",
  children,
  withDot = false,
  size = "sm",
  className = "",
}: StatusChipProps) {
  const v = VARIANT_STYLES[variant];
  return (
    <span
      className={
        `inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-[0.14em] ` +
        `${v.wrap} ${v.text} ${SIZE_STYLES[size]} ${className}`
      }
    >
      {withDot && (
        <span className="relative inline-flex h-1.5 w-1.5">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${v.dot} opacity-60`}
          />
          <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${v.dot}`} />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}
