import React from "react";

type ContentPlaceholderProps = {
  /** Anzahl der Skeleton-Zeilen. */
  lines?: number;
  /** Skeleton mit Titel oben + Untertitel + N Linien? */
  withTitle?: boolean;
  /** Optional: Avatar-Skeleton (z. B. für Listen). */
  withAvatar?: boolean;
  className?: string;
};

/**
 * Skelett-Placeholder mit subtilem Shimmer.
 *
 * Eingesetzt für:
 *  - Server-Loading-Slots (Suspense fallback)
 *  - inline Loading-Karten (z. B. Case-Study-Vorschau, die nachgeladen wird)
 *
 * Der Shimmer ist sehr dezent (3 → 8 % Alpha-Sweep) und respektiert
 * `prefers-reduced-motion` (CSS-Regel in `globals.css` setzt die
 * Animationsdauer global auf 0.01 ms).
 */
export function ContentPlaceholder({
  lines = 3,
  withTitle = true,
  withAvatar = false,
  className = "",
}: ContentPlaceholderProps) {
  return (
    <div
      className={`flex gap-4 rounded-2xl border border-border/50 bg-card/60 p-5 ${className}`}
      aria-busy="true"
      aria-live="polite"
    >
      {withAvatar && (
        <div className="skeleton-shimmer h-12 w-12 flex-none rounded-full" />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {withTitle && (
          <>
            <div className="skeleton-shimmer h-4 w-1/3" />
            <div className="skeleton-shimmer h-3 w-1/2 opacity-80" />
          </>
        )}
        <div className="flex flex-col gap-2 pt-1">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="skeleton-shimmer h-2.5"
              style={{ width: `${100 - i * 8}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
