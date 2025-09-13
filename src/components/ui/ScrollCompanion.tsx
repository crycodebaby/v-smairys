// src/components/ui/ScrollCompanion.tsx
"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionStyle,
} from "framer-motion";

export default function ScrollCompanion() {
  const { scrollYProgress } = useScroll();
  const prefersReduced = useReducedMotion();

  const x = useTransform(scrollYProgress, [0, 1], ["60%", "20%"]);
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "75%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.18, 0.12]);

  // typsicher statt "as any"
  const style: MotionStyle = prefersReduced
    ? { opacity: 0.08 }
    : { x, y, scale, opacity };

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 w-64 h-64 -translate-x-1/2 rounded-full pointer-events-none left-1/2 -z-10 bg-primary/25 blur-3xl dark:bg-primary/20 sm:h-72 sm:w-72 md:h-80 md:w-80"
      style={style}
    />
  );
}
