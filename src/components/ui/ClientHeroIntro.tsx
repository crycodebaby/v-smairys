"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import ThreeLogo, { type LogoPhase } from "@/components/ui/ThreeLogo";
import { invalidate } from "@react-three/fiber";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { useSectionAct, type SectionAct } from "@/lib/useSectionAct";

interface ClientHeroIntroProps {
  children?: ReactNode;
}

const INACTIVITY_MS = 12000;

export default function ClientHeroIntro({ children }: ClientHeroIntroProps) {
  const [phase, setPhase] = useState<LogoPhase>("intro");
  const [showcaseSeq, setShowcaseSeq] = useState<number>(0);
  const scroll = useScrollProgress();
  const act = useSectionAct();

  useEffect(() => {
    const id = setTimeout(() => {
      setPhase("park");
      invalidate();
    }, 1200);
    return () => clearTimeout(id);
  }, []);

  // Inaktivitäts-Showcase
  useEffect(() => {
    let timer: number | null = null;
    const reset = () => {
      if (timer) clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (document.visibilityState === "visible") {
          setShowcaseSeq((n) => n + 1);
          invalidate();
        }
      }, INACTIVITY_MS);
    };
    const onAny = () => reset();
    const onVis = () =>
      document.visibilityState === "visible"
        ? reset()
        : timer && clearTimeout(timer);

    ["pointermove", "wheel", "keydown", "touchstart"].forEach((e) =>
      window.addEventListener(e, onAny, { passive: true })
    );
    document.addEventListener("visibilitychange", onVis);
    reset();

    return () => {
      if (timer) clearTimeout(timer);
      ["pointermove", "wheel", "keydown", "touchstart"].forEach((e) =>
        window.removeEventListener(e, onAny)
      );
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Invalidate bei Scroll/Act-Wechsel
  useEffect(() => {
    invalidate();
  }, [scroll, act]);

  const heroVisible = phase === "park";

  return (
    <>
      <ThreeLogo
        phase={phase}
        showcaseSeq={showcaseSeq}
        scroll={scroll}
        act={act}
      />

      <motion.div
        initial={{ opacity: 0.8 }}
        animate={{ opacity: heroVisible ? 0 : 0.8 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="pointer-events-none fixed inset-0 -z-5 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55),rgba(0,0,0,0.9))]"
      />

      <motion.div
        initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
        animate={{
          opacity: heroVisible ? 1 : 0,
          y: heroVisible ? 0 : 10,
          filter: heroVisible ? "blur(0px)" : "blur(6px)",
        }}
        transition={{
          delay: heroVisible ? 0.05 : 0,
          duration: 0.55,
          ease: "easeOut",
        }}
        className="relative z-0"
      >
        {children}
      </motion.div>
    </>
  );
}
