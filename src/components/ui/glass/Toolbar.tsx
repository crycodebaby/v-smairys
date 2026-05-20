import React from "react";

/**
 * Schmale Toolbar/TopBar mit Glas-Optik für interne Layouts.
 *
 * - Links: Markenslot (z. B. Logo/Schriftzug + Sub-Label)
 * - Mitte: Title + optional Description
 * - Rechts: Actions (Buttons, Chips)
 *
 * Wird als Sticky-Header über dem Master-Detail-Layout verwendet.
 */
type ToolbarProps = {
  brand?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export function Toolbar({
  brand,
  title,
  description,
  actions,
  className = "",
}: ToolbarProps) {
  return (
    <div
      className={
        "relative flex flex-wrap items-center justify-between gap-4 rounded-2xl " +
        "glass-surface-subtle px-4 py-3 sm:px-5 sm:py-4 " +
        className
      }
    >
      <div className="flex min-w-0 items-center gap-3">
        {brand}
        {(title || description) && (
          <div className="min-w-0">
            {title && (
              <h1 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
                {title}
              </h1>
            )}
            {description && (
              <p className="hidden truncate text-xs text-foreground/60 sm:block sm:text-sm">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}

/**
 * Kompakter Brand-Slot mit Logo-Punkt und zwei Textzeilen.
 */
export function ToolbarBrand({
  label,
  sublabel,
}: {
  label: string;
  sublabel?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white text-background shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
        <span className="absolute inset-0 -z-0 bg-gradient-to-br from-white via-zinc-100 to-zinc-300" />
        <span className="relative z-10 text-[15px] font-bold tracking-tighter">S</span>
      </span>
      <div className="hidden sm:block">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/55">
          {label}
        </p>
        {sublabel && (
          <p className="text-xs font-medium text-foreground/85">{sublabel}</p>
        )}
      </div>
    </div>
  );
}
