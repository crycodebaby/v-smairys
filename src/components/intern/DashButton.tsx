"use client";

import React from "react";

export type DashButtonVariant =
  | "primary"
  | "secondary"
  | "utility"
  | "ghost"
  | "danger";

export type DashButtonSize = "xs" | "sm" | "md";

/**
 * Zentrale Button-Klassen des Dashboards (Liquid Amber Glass).
 *
 * Bewusst als Klassen-Helper, damit derselbe Look auch auf `<a>`-Elementen
 * (QR-SVG/PNG, externe Links) genutzt werden kann. Effekte/States leben in
 * `globals.css` unter `.dash-btn`. Nur intern verwendet – die öffentliche
 * Website nutzt weiterhin `<GlassButton>`.
 */
export function dashButtonClasses(
  variant: DashButtonVariant = "secondary",
  size: DashButtonSize = "sm",
  className = ""
): string {
  return ["dash-btn", `dash-btn--${variant}`, `dash-btn--${size}`, className]
    .filter(Boolean)
    .join(" ");
}

type DashButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: DashButtonVariant;
  size?: DashButtonSize;
  /** Aktiver/ausgewählter Zustand (Brand-Akzentfläche). */
  selected?: boolean;
  leadingIcon?: React.ReactNode;
};

export const DashButton = React.forwardRef<HTMLButtonElement, DashButtonProps>(
  function DashButton(
    {
      variant = "secondary",
      size = "sm",
      selected = false,
      leadingIcon,
      className = "",
      type = "button",
      children,
      ...rest
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={dashButtonClasses(
          variant,
          size,
          (selected ? "dash-btn--selected " : "") + className
        )}
        {...rest}
      >
        {leadingIcon ? (
          <span aria-hidden="true" className="-ml-0.5 flex shrink-0 items-center">
            {leadingIcon}
          </span>
        ) : null}
        {children}
      </button>
    );
  }
);
