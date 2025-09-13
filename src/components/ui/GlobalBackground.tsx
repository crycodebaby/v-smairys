// src/components/ui/GlobalBackground.tsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React from "react";

export default function GlobalBackground() {
  const { scrollYProgress } = useScroll();
  // Sanfte Parallax-Bewegung: Die Position des Grids ändert sich langsam beim Scrollen
  const pos = useTransform(scrollYProgress, [0, 1], ["0px 0px", "240px 180px"]);

  return (
    <motion.div
      aria-hidden
      // position: fixed sorgt dafür, dass es immer im Hintergrund bleibt
      className="fixed inset-0 pointer-events-none select-none -z-10"
      style={{
        // Die Definitionen aus unserem alten BackgroundGrid, jetzt global
        backgroundImage:
          "radial-gradient(2px 2px at 15px 15px, hsl(var(--foreground) / var(--grid-alpha, 0.18)) 2px, transparent 2px)",
        backgroundSize: "36px 36px",
        backgroundPosition: pos,
      }}
      transition={{ type: "tween", ease: "linear" }}
    />
  );
}
