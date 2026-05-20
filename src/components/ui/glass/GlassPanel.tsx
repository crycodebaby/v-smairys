import React from "react";

/**
 * Liquid-Glass-Panel.
 *
 * Bewusst minimal: nur die Hülle. Inhalt + Padding bestimmt der Aufrufer.
 * Funktioniert hell wie dunkel, weil semi-transparent über dem Hintergrund.
 */
export type GlassPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Etwas mehr Blur/Schatten für hervorgehobene Container. */
  emphasis?: "subtle" | "default" | "strong";
};

export function GlassPanel({
  children,
  className = "",
  emphasis = "default",
  ...props
}: GlassPanelProps) {
  const emphasisStyles = {
    subtle:
      "bg-white/40 dark:bg-white/[0.04] backdrop-blur-md border border-white/30 dark:border-white/10 shadow-sm",
    default:
      "bg-white/60 dark:bg-white/[0.06] backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-md",
    strong:
      "bg-white/70 dark:bg-white/[0.08] backdrop-blur-2xl border border-white/50 dark:border-white/15 shadow-xl",
  }[emphasis];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${emphasisStyles} ${className}`}
      {...props}
    >
      {/* Top-Highlight: simuliert die Lichtkante eines echten Glas-Panels. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/20"
      />
      {children}
    </div>
  );
}
