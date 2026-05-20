import React from "react";
import { GlassPanel } from "./GlassPanel";

/**
 * Glass-Card mit konsistentem Padding + optional Header.
 *
 * Wrappt `GlassPanel`. Falls Marker (`label`/`title`) gesetzt sind, rendert
 * sie einen kompakten Kopfbereich. Sonst ist die Card eine reine Hülle.
 */
export type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  label?: string;
  title?: string;
  description?: string;
  emphasis?: "subtle" | "default" | "strong";
  /** Aktionen rechts im Header (Buttons, Badges, …). */
  actions?: React.ReactNode;
};

export function GlassCard({
  label,
  title,
  description,
  emphasis = "default",
  actions,
  children,
  className = "",
  ...props
}: GlassCardProps) {
  const hasHeader = Boolean(label || title || description || actions);
  return (
    <GlassPanel emphasis={emphasis} className={className} {...props}>
      <div className="p-6 sm:p-7">
        {hasHeader && (
          <header className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-white/30 pb-4 dark:border-white/10">
            <div className="min-w-0">
              {label && (
                <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground/55">
                  {label}
                </p>
              )}
              {title && (
                <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-1 max-w-xl text-sm text-foreground/70">
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
