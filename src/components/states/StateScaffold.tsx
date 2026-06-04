import React from "react";

/**
 * Gemeinsames Scaffolding für Loading/Empty/NotFound/Placeholder-States.
 *
 * - Zentriertes Icon + Titel + Body + optionale Action
 * - Glass-Hintergrund neutral, brand-Akzentlinie über Titel
 * - Wird **nicht** als 404-Vollseite verwendet (dafür gibt es `not-found.tsx`),
 *   sondern als inline-Slot innerhalb von Sections/Cards.
 */
type StateScaffoldProps = {
  icon: React.ReactNode;
  title: string;
  body?: React.ReactNode;
  action?: React.ReactNode;
  /** Layout-Variante: kompakt (kleinere Höhe) vs. comfortable. */
  size?: "sm" | "md";
  className?: string;
};

export function StateScaffold({
  icon,
  title,
  body,
  action,
  size = "md",
  className = "",
}: StateScaffoldProps) {
  const pad = size === "sm" ? "px-5 py-7" : "px-7 py-10 sm:py-12";
  return (
    <div
      className={
        "flex flex-col items-center justify-center gap-4 rounded-2xl border border-border/60 bg-card/60 text-center " +
        `${pad} ${className}`
      }
    >
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-brand/10 blur-xl"
        />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-border bg-background/80">
          {icon}
        </span>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span className="brand-underline" aria-hidden="true" />
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        {body && (
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {body}
          </p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
