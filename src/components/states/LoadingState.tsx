import Image from "next/image";
import React from "react";
import { StateScaffold } from "./StateScaffold";

type LoadingStateProps = {
  title?: string;
  body?: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
};

/**
 * Lade-Zustand mit dezent rotierendem SVG-Icon aus `public/svg_librarie`.
 *
 * - Tailwinds `animate-spin` (1 s) wird per inline-Style auf 3.5 s
 *   verlangsamt – damit wirkt das Icon ruhig, nicht klinisch.
 * - `prefers-reduced-motion` greift global via globals.css.
 */
export function LoadingState({
  title = "Wird geladen",
  body,
  size = "md",
  className = "",
}: LoadingStateProps) {
  return (
    <StateScaffold
      className={className}
      size={size}
      icon={
        <span className="relative inline-flex h-7 w-7 items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-brand/30" />
          <Image
            src="/svg_librarie/loading-16-svgrepo-com.svg"
            alt=""
            aria-hidden="true"
            width={20}
            height={20}
            className="opacity-90 animate-spin"
            style={{ animationDuration: "3.5s" }}
          />
        </span>
      }
      title={title}
      body={body}
    />
  );
}
