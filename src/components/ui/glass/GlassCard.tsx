import React from "react";
import { GlassPanel, type GlassPanelProps } from "./GlassPanel";

/**
 * GlassCard = GlassPanel mit konsistentem Padding und einem optionalen
 * Kopfbereich (Label, Title, Description, Actions).
 *
 * Bewusst keine eigene visuelle Tiefe – das ist `GlassPanel`s Aufgabe.
 * GlassCard kümmert sich nur um Layout und Hierarchie.
 */
export type GlassCardProps = Omit<GlassPanelProps, "children"> & {
  label?: string;
  title?: string;
  description?: string;
  /** Aktionen rechts im Header. */
  actions?: React.ReactNode;
  /** Standard-Padding ausschalten, falls die Card eigenes Layout braucht. */
  noPadding?: boolean;
  children?: React.ReactNode;
};

export function GlassCard({
  label,
  title,
  description,
  actions,
  noPadding = false,
  className = "",
  children,
  ...panelProps
}: GlassCardProps) {
  const hasTitleOrDesc = Boolean(title || description);
  const hasHeader = Boolean(label || hasTitleOrDesc || actions);
  // Wenn nur ein Label (z. B. "Interne Notiz") vorhanden ist, lassen wir die
  // Trennlinie weg – sonst entsteht eine ungenutzte horizontale Hairline.
  const headerHasBorder = hasTitleOrDesc || Boolean(actions);
  return (
    <GlassPanel className={className} {...panelProps}>
      <div className={noPadding ? "" : "p-5 sm:p-7"}>
        {hasHeader && (
          <header
            className={
              "flex flex-wrap items-start justify-between gap-3 " +
              (headerHasBorder
                ? "mb-5 border-b border-white/10 pb-4"
                : "mb-3")
            }
          >
            <div className="min-w-0">
              {label && (
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/55">
                  {label}
                </p>
              )}
              {title && (
                <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-foreground/65">
                  {description}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex flex-wrap items-center gap-2">{actions}</div>
            )}
          </header>
        )}
        {children}
      </div>
    </GlassPanel>
  );
}
