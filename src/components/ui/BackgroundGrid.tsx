// src/components/ui/BackgroundGrid.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Subtiles, performantes Punkt-Raster mit sanfter Drift,
 * optimiert für Größe, Sichtbarkeit und Geschwindigkeit.
 */
export default function BackgroundGrid() {
  return (
    <motion.div
      aria-hidden
      className={[
        "pointer-events-none absolute inset-0 z-0 select-none",
        "lg:[mask-image:radial-gradient(120%_100%_at_50%_40%,black,transparent_78%)]",
        // TUNING: Sichtbarkeit (Alpha) für beide Themes erhöht
        "[--grid-alpha:0.22] dark:[--grid-alpha:0.13]",
        // TUNING: Dichte (Abstand) der Punkte vergrößert
        "[--grid-size:30px] sm:[--grid-size:32px] md:[--grid-size:36px]",
      ].join(" ")}
      style={
        {
          backgroundImage:
            // TUNING: Punktgröße von 1px auf 2px erhöht
            "radial-gradient(2px 2px at 15px 15px, hsl(var(--foreground) / var(--grid-alpha)) 2px, transparent 2px)",
          backgroundSize: "var(--grid-size) var(--grid-size)",
          filter: "saturate(90%)",
        } as React.CSSProperties
      }
      // TUNING: Animationsdauer für langsamere Drift erhöht (60s -> 90s)
      animate={{
        backgroundPosition: ["0px 0px", "180px 270px", "0px 0px"],
      }}
      transition={{
        duration: 90,
        ease: "linear",
        repeat: Infinity,
      }}
    />
  );
}
