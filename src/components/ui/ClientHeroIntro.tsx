"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { invalidate } from "@react-three/fiber";
import ThreeLogo, { type LogoPhase } from "@/components/ui/ThreeLogo";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { useSectionAct, type SectionAct } from "@/lib/useSectionAct";
import { useViewportTier, type ViewportTier } from "@/hooks/useViewportTier";

/**
 * ClientHeroIntro:
 * - führt initiale 3D-Logo-Animation aus
 * - blendet Hero-Inhalt synchron ein
 * - startet Showcase bei Inaktivität
 * - reagiert auf Scroll und Section-Änderungen
 */

interface ClientHeroIntroProps {
  children?: ReactNode;
}

/** Showcase startet nach dieser Inaktivität (ms) */
const INACTIVITY_MS = 12000;
/** Zeit (ms) bis Logo von Intro → Park übergeht */
const INTRO_TO_PARK_MS = 1400;
/** Zeit (ms) bis Hero-Content sichtbar wird */
const HERO_REVEAL_DELAY_MS = 1500;

export default function ClientHeroIntro({ children }: ClientHeroIntroProps) {
  const [phase, setPhase] = useState<LogoPhase>("intro");
  const [showcaseSeq, setShowcaseSeq] = useState<number>(0);

  /** Scroll-Progress (0–1) & Section-State */
  const scroll = useScrollProgress();
  const act: SectionAct = useSectionAct();

  /** Gerätegröße einmalig ermitteln (stabil während Session) */
  const liveTier = useViewportTier();
  const [tierLocked] = useState<ViewportTier>(() => liveTier);

  /** Hero sichtbar, sobald Logo „geparkt“ ist */
  const heroVisible = phase === "park";

  /* -------------------------------
     A) Intro → Park & Hero-Reveal
  ------------------------------- */
  useEffect(() => {
    const introTimer = window.setTimeout(() => {
      setPhase("park");
      invalidate(); // Re-render Logo nach Phase-Wechsel
    }, INTRO_TO_PARK_MS);

    const heroTimer = window.setTimeout(() => {
      invalidate(); // sicherstellen, dass Hero nach Render sichtbar wird
    }, HERO_REVEAL_DELAY_MS);

    return () => {
      clearTimeout(introTimer);
      clearTimeout(heroTimer);
    };
  }, []);

  /* -------------------------------
     B) Showcase bei Inaktivität
  ------------------------------- */
  useEffect(() => {
    let timer: number | null = null;

    const triggerShowcase = () => {
      if (document.visibilityState === "visible") {
        setShowcaseSeq((n) => n + 1);
        invalidate();
      }
    };

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = window.setTimeout(triggerShowcase, INACTIVITY_MS);
    };

    const onActivity = () => resetTimer();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") resetTimer();
      else if (timer) clearTimeout(timer);
    };

    ["pointermove", "wheel", "keydown", "touchstart"].forEach((evt) =>
      window.addEventListener(evt, onActivity, { passive: true })
    );
    document.addEventListener("visibilitychange", onVisibilityChange);

    resetTimer(); // Timer initial starten

    return () => {
      if (timer) clearTimeout(timer);
      ["pointermove", "wheel", "keydown", "touchstart"].forEach((evt) =>
        window.removeEventListener(evt, onActivity)
      );
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  /* -------------------------------
     C) Re-render bei Scroll / Section-Änderung
  ------------------------------- */
  useEffect(() => {
    invalidate();
  }, [scroll, act]);

  /* -------------------------------
     D) Render
  ------------------------------- */
  return (
    <>
      {/* 3D-Logo – reagiert auf Scroll & Section */}
      <ThreeLogo
        phase={phase}
        showcaseSeq={showcaseSeq}
        scroll={scroll}
        act={act}
        tier={tierLocked}
      />

      {/* Dunkler radialer Hintergrund während Intro */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: heroVisible ? 0 : 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="pointer-events-none fixed inset-0 -z-5 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.6),rgba(0,0,0,0.9))]"
      />

      {/* Hero-Content – smooth fade-in */}
      <motion.div
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        animate={{
          opacity: heroVisible ? 1 : 0,
          y: heroVisible ? 0 : 12,
          filter: heroVisible ? "blur(0px)" : "blur(6px)",
        }}
        transition={{
          delay: heroVisible ? 0.08 : 0,
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
