import React from "react";

/**
 * Liquid-Glass-Button.
 *
 * - Standard-Variante: dezent, für sekundäre Aktionen (z. B. „Kundenlogin").
 * - Variante `solid`: leicht stärker, für primäre Aktionen im Glass-Kontext.
 *
 * Bewusst keine eigenen Tracking-Hooks – das ist eine reine UI-Primitive.
 * Wer Tracking will, nutzt `TrackedButton` oder fügt selbst `onClick` hinzu.
 */
export type GlassButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "subtle" | "solid";
  size?: "sm" | "md" | "lg";
};

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className = "", variant = "subtle", size = "md", children, ...props }, ref) => {
    const sizeStyles = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-5 text-sm",
      lg: "h-14 px-6 text-base",
    }[size];

    const variantStyles = {
      subtle:
        "bg-white/40 dark:bg-white/[0.06] hover:bg-white/55 dark:hover:bg-white/[0.10] " +
        "border border-white/40 dark:border-white/10 text-foreground/90 " +
        "backdrop-blur-xl shadow-sm",
      solid:
        "bg-white/70 dark:bg-white/[0.10] hover:bg-white/85 dark:hover:bg-white/[0.16] " +
        "border border-white/50 dark:border-white/20 text-foreground " +
        "backdrop-blur-xl shadow-md",
    }[variant];

    return (
      <button
        ref={ref}
        className={
          "inline-flex select-none items-center justify-center gap-2 rounded-full " +
          "font-medium tracking-tight transition-all duration-200 " +
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 " +
          "active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 " +
          `${variantStyles} ${sizeStyles} ${className}`
        }
        {...props}
      >
        {children}
      </button>
    );
  }
);

GlassButton.displayName = "GlassButton";
