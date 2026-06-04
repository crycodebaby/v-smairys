import Image from "next/image";
import React from "react";
import { StateScaffold } from "./StateScaffold";

type NotFoundStateProps = {
  title?: string;
  body?: React.ReactNode;
  action?: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
};

/**
 * "Nicht gefunden"-Zustand. Nutzt das durchgestrichene Kreis-SVG aus
 * `public/svg_librarie`. Wird verwendet für:
 *  - inline 404-ähnliche Hinweise (z. B. „Diese Case Study existiert nicht")
 *  - Kontaktformular-Zusatzinfo „Kein Live-Chat / kein automatischer Slot"
 *
 * Bewusst kein Alarmton (kein Rot) – das Icon kommuniziert „neutral leer".
 */
export function NotFoundState({
  title = "Nicht gefunden",
  body = "Der angeforderte Inhalt existiert nicht oder wurde verschoben.",
  action,
  size = "md",
  className = "",
}: NotFoundStateProps) {
  return (
    <StateScaffold
      className={className}
      size={size}
      icon={
        <Image
          src="/svg_librarie/not-found-16-svgrepo-com.svg"
          alt=""
          aria-hidden="true"
          width={22}
          height={22}
          className="opacity-90"
        />
      }
      title={title}
      body={body}
      action={action}
    />
  );
}
