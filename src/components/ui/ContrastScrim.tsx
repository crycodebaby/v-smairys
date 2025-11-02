"use client";

import React from "react";
import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** 0..1 Deckkraft des Panels */
  strength?: number;
  /** px-Blur; z.B. 6–10 für „Apple-clean“ */
  blur?: number;
  /** px-Eckenradius */
  radius?: number;
  /** z.B. "px-3 py-2" */
  insetClassName?: string;
  /** radiale Maske für weiche Ränder */
  masked?: boolean;
};

export default function ContrastScrim({
  children,
  className,
  strength = 0.62,
  blur = 8,
  radius = 14,
  insetClassName = "",
  masked = true,
}: Props) {
  // Fallback-sicher: hsl(var(--background) / α)
  const bg = `hsl(var(--background) / ${Math.round(strength * 100)}%)`;

  return (
    <div className={clsx("relative", className)}>
      <div
        aria-hidden
        className={clsx(
          "pointer-events-none absolute inset-0",
          // Tailwind Backdrop (funktioniert zuverlässig auf iOS/Chrome)
          // Arbitrary value für Blur:
          `backdrop-blur-[${blur}px]`,
          "rounded-[var(--scrim-radius)]"
        )}
        style={{
          background: bg,
          WebkitBackdropFilter: `blur(${blur}px)`,
          borderRadius: `${radius}px`,
          // sanfte, radiale Kante
          maskImage: masked
            ? "radial-gradient(120% 100% at 50% 50%, black 65%, transparent 100%)"
            : undefined,
          // Für Safari: ein Hauch Weichzeichner auf der Kante
          WebkitMaskImage: masked
            ? "radial-gradient(120% 100% at 50% 50%, black 65%, transparent 100%)"
            : undefined,
          ["--scrim-radius" as any]: `${radius}px`,
        }}
      />
      <div className={clsx("relative", insetClassName)}>{children}</div>
    </div>
  );
}
