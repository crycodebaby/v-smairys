"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Logo = {
  id: string;
  name: string;
  /** Entweder SVG-String ODER Bild-URL (PNG/WEBP/SVG-Datei) */
  svg?: string;
  image?: string;
  /** z.B. "h-6 md:h-8" */
  height?: string;
};

type Speed = "slow" | "normal" | "fast";
type Direction = "left" | "right";

const SPEED_MAP: Record<Speed, string> = {
  slow: "30s",
  normal: "20s",
  fast: "12s",
};

export interface ScrollingLogosProps {
  logos: Logo[];
  speed?: Speed;
  direction?: Direction;
  className?: string;
  /** Marquee pausiert bei Hover */
  pauseOnHover?: boolean;
  /** Graustufen/Transparenz für subtilen Look */
  subtle?: boolean;
}

export default function ScrollingLogos({
  logos,
  speed = "normal",
  direction = "left",
  className,
  pauseOnHover = true,
  subtle = true,
}: ScrollingLogosProps) {
  const animationDirection = direction === "left" ? "reverse" : "normal";

  // Für nahtlose Loops: Liste verdreifachen (einmal definieren → nahtlos)
  const tripled = React.useMemo(() => [...logos, ...logos, ...logos], [logos]);

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "group flex overflow-hidden",
          pauseOnHover && "hover:[--play-state:paused]"
        )}
        style={
          {
            "--duration": SPEED_MAP[speed],
            "--play-state": "running",
          } as React.CSSProperties
        }
        aria-label="Logoleiste – automatisch scrollend"
      >
        <div
          className={cn(
            "flex shrink-0 animate-marquee",
            "[animation-duration:var(--duration)]",
            "[animation-play-state:var(--play-state)]",
            "[animation-timing-function:linear]",
            "[animation-iteration-count:infinite]"
          )}
          style={
            {
              animationDirection,
            } as React.CSSProperties
          }
        >
          {tripled.map((logo, idx) => (
            <div
              key={`${idx}-${logo.id}`}
              className={cn(
                "mx-8 flex items-center whitespace-nowrap",
                subtle &&
                  "opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
              )}
            >
              {logo.svg ? (
                <div
                  className={cn("fill-current", logo.height ?? "h-6 md:h-8")}
                  aria-label={logo.name}
                  role="img"
                  dangerouslySetInnerHTML={{ __html: logo.svg }}
                />
              ) : logo.image ? (
                <Image
                  src={logo.image}
                  alt={logo.name}
                  width={180}
                  height={64}
                  className={cn("h-auto w-auto", logo.height ?? "h-6 md:h-8")}
                  priority={false}
                  loading="lazy"
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Soft Gradient Fades (maskieren die Kanten, subtil & hochwertig) */}
      <div className="absolute inset-y-0 left-0 w-1/4 pointer-events-none bg-gradient-to-r from-background to-transparent" />
      <div className="absolute inset-y-0 right-0 w-1/4 pointer-events-none bg-gradient-to-l from-background to-transparent" />

      {/* Komponentenspezifischer Reduced-Motion-Fallback (ergänzend zu deiner globalen Regel) */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          :global(.animate-marquee) {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
