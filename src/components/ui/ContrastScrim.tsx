// src/components/ui/ContrastScrim.tsx
"use client";

import React from "react";
import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Deckkraft der Fläche (0..1) */
  strength?: number;
  /** Blur in px (6–10 wirkt „Apple-clean“) */
  blur?: number;
  /** Eckenradius in px */
  radius?: number;
  /** z. B. "px-3 py-2" */
  insetClassName?: string;
  /** Radiale Maskierung für weiche Ränder */
  masked?: boolean;
};

/** Erweitertes Style-Objekt mit typisierter CSS-Variable */
type StyleWithVars = React.CSSProperties & {
  ["--scrim-radius"]?: string;
};

export default function ContrastScrim({
  children,
  className,
  strength = 0.72,
  blur = 9,
  radius = 14,
  insetClassName = "",
  masked = true,
}: Props) {
  // Theme-sicher: nutzt deine HSL-Token direkt (Light/Dark-fähig)
  const background = `hsl(var(--background) / ${Math.round(strength * 100)}%)`;

  const layerStyle: StyleWithVars = {
    background,
    // Dynamischer Blur per inline-style (funktioniert auf iOS/Safari/Chrome)
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    // Eckenradius als CSS-Var, falls du ihn in Klassen referenzieren willst
    borderRadius: `${radius}px`,
    ["--scrim-radius"]: `${radius}px`,
    // Weiche Kanten via Mask – doppelt für WebKit
    maskImage: masked
      ? "radial-gradient(120% 100% at 50% 50%, black 65%, transparent 100%)"
      : undefined,
    WebkitMaskImage: masked
      ? "radial-gradient(120% 100% at 50% 50%, black 65%, transparent 100%)"
      : undefined,
  };

  return (
    <div className={clsx("relative", className)}>
      {/* Scrim-Layer (unter dem Content) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={layerStyle}
      />
      {/* Inhalt bleibt im normalen Flow */}
      <div className={clsx("relative", insetClassName)}>{children}</div>
    </div>
  );
}
