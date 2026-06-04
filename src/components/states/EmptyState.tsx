import Image from "next/image";
import React from "react";
import { StateScaffold } from "./StateScaffold";

type EmptyStateProps = {
  title?: string;
  body?: React.ReactNode;
  action?: React.ReactNode;
  /** Variante des Icons:
   *  - `keyword` – fürs leere Suchergebnis / Filter
   *  - `prettier` – fürs „noch nichts da, kommt bald"
   *  - `none` – ohne Icon, nur Titel + Body
   */
  variant?: "keyword" | "prettier" | "none";
  size?: "sm" | "md";
  className?: string;
};

const ICON_SRC: Record<Exclude<EmptyStateProps["variant"], "none" | undefined>, string> = {
  keyword: "/svg_librarie/keyword-16-svgrepo-com.svg",
  prettier: "/svg_librarie/prettier-16-svgrepo-com.svg",
};

/**
 * "Leer"-Zustand für Listen, Filter ohne Treffer, Sektionen ohne Inhalt.
 *
 * Wichtig: das ist **kein 404**. Für „Seite nicht gefunden" → `NotFoundState`
 * bzw. `app/not-found.tsx`.
 */
export function EmptyState({
  title = "Keine Einträge",
  body = "Sobald hier Inhalte vorhanden sind, erscheinen sie an dieser Stelle.",
  action,
  variant = "keyword",
  size = "md",
  className = "",
}: EmptyStateProps) {
  return (
    <StateScaffold
      className={className}
      size={size}
      icon={
        variant === "none" ? (
          <span className="brand-dot" aria-hidden="true" />
        ) : (
          <Image
            src={ICON_SRC[variant]}
            alt=""
            aria-hidden="true"
            width={22}
            height={22}
            className="opacity-90"
          />
        )
      }
      title={title}
      body={body}
      action={action}
    />
  );
}
