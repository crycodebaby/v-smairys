"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Pillar {
  label: string;
  text: string;
  sub: string;
  color: string;
  glow: string;
  /** delay multiplier for stagger */
  order: number;
}

const PILLARS: Pillar[] = [
  {
    label: "Sichtbarkeit",
    text: "Gefunden werden, bevor Ihre Konkurrenz angerufen wird.",
    sub: "Technisches SEO, das nachweislich rankt.",
    color: "#b2ef80",
    glow: "rgba(178,239,128,0.18)",
    order: 0,
  },
  {
    label: "Vertrauen",
    text: "Ein professioneller erster Eindruck entscheidet vor dem ersten Gespräch.",
    sub: "Design und Substanz, die bleiben.",
    color: "#37e5da",
    glow: "rgba(55,229,218,0.18)",
    order: 1,
  },
  {
    label: "Anfragen",
    text: "Aus Besuchern werden Gespräche, wenn Struktur und Klarheit stimmen.",
    sub: "Conversion-Architektur, nicht Baukastenlogik.",
    color: "#ecfbdf",
    glow: "rgba(236,251,223,0.14)",
    order: 2,
  },
];

// ─── Animated connector dot ───────────────────────────────────────────────────

function ConnectorLine({
  color,
  appeared,
  delay,
  reduced,
}: {
  color: string;
  appeared: boolean;
  delay: number;
  reduced: boolean;
}) {
  return (
    <div className="hidden md:flex flex-col items-center mx-1" aria-hidden>
      {/* top dot */}
      <motion.span
        className="block w-1 h-1 rounded-full"
        style={{ background: color }}
        initial={reduced ? false : { opacity: 0, scale: 0 }}
        animate={appeared ? { opacity: 0.5, scale: 1 } : {}}
        transition={{ duration: 0.4, delay: delay + 0.15 }}
      />
      {/* line */}
      <motion.span
        className="block w-px my-1"
        style={{
          background: `linear-gradient(to bottom, ${color}55, transparent)`,
          height: "2.5rem",
        }}
        initial={reduced ? false : { scaleY: 0, originY: 0 }}
        animate={appeared ? { scaleY: 1 } : {}}
        transition={{ duration: 0.55, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

// ─── Single pillar card ───────────────────────────────────────────────────────

function PillarCard({
  pillar,
  appeared,
  reduced,
}: {
  pillar: Pillar;
  appeared: boolean;
  reduced: boolean;
}) {
  const delay = 0.18 + pillar.order * 0.13;

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={appeared ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex-1 min-w-0 rounded-2xl p-6 sm:p-8 flex flex-col gap-4 transition-all duration-500"
      style={{
        border: "1px solid rgba(236,251,223,0.08)",
        background: "rgba(9,16,2,0.72)",
      }}
      // subtle hover lift + glow — purely CSS, no click needed
      onMouseEnter={(e) => {
        if (reduced) return;
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = `0 0 48px 0px ${pillar.glow}, 0 8px 32px -8px rgba(0,0,0,0.5)`;
        el.style.borderColor = `${pillar.color}28`;
        el.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "";
        el.style.borderColor = "rgba(236,251,223,0.08)";
        el.style.transform = "";
      }}
    >
      {/* ambient inner glow — always visible, subtle */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${pillar.glow}, transparent 70%)`,
        }}
      />

      {/* top: indicator dot + label */}
      <div className="flex items-center gap-3 relative z-10">
        {/* pulsing dot — looping, no interaction needed */}
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-60"
            style={{
              background: pillar.color,
              animation: reduced
                ? "none"
                : `ping 2.8s cubic-bezier(0,0,0.2,1) infinite`,
              animationDelay: `${pillar.order * 0.7}s`,
            }}
          />
          <span
            className="relative inline-flex h-2.5 w-2.5 rounded-full"
            style={{ background: pillar.color }}
          />
        </span>

        <span
          className="text-xs font-semibold tracking-[0.18em] uppercase"
          style={{ color: pillar.color }}
        >
          {pillar.label}
        </span>
      </div>

      {/* main text */}
      <p
        className="text-base sm:text-lg font-medium leading-snug text-balance relative z-10"
        style={{ color: "#ecfbdf" }}
      >
        {pillar.text}
      </p>

      {/* sub */}
      <p
        className="text-sm leading-relaxed relative z-10 mt-auto"
        style={{ color: "rgba(236,251,223,0.45)" }}
      >
        {pillar.sub}
      </p>
    </motion.article>
  );
}

// ─── Central logo mark ────────────────────────────────────────────────────────

function LogoMark({ appeared, reduced }: { appeared: boolean; reduced: boolean }) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, scale: 0.88 }}
      animate={appeared ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex-shrink-0 flex items-center justify-center"
    >
      {/* outer ambient ring — slow rotation, purely decorative */}
      <div
        aria-hidden
        className="absolute rounded-full border"
        style={{
          width: "88px",
          height: "88px",
          borderColor: "rgba(178,239,128,0.12)",
          animation: reduced ? "none" : "spin 18s linear infinite",
          borderStyle: "dashed",
        }}
      />
      {/* second ring, counter-rotate */}
      <div
        aria-hidden
        className="absolute rounded-full border"
        style={{
          width: "108px",
          height: "108px",
          borderColor: "rgba(55,229,218,0.07)",
          animation: reduced ? "none" : "spin 28s linear infinite reverse",
          borderStyle: "dotted",
        }}
      />

      {/* logo disc */}
      <div
        className="relative w-16 h-16 rounded-full flex items-center justify-center z-10"
        style={{
          background: "rgba(9,16,2,0.9)",
          border: "1px solid rgba(236,251,223,0.14)",
          boxShadow: "0 0 32px 4px rgba(178,239,128,0.10)",
        }}
      >
        <Image
          src="/logo/smairys.png"
          alt="SMAIRYS Netz-Manufaktur"
          width={44}
          height={44}
          className="object-contain w-10 h-10"
        />
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SignalEngineSection() {
  const reduced = useReducedMotion() ?? false;
  const [appeared, setAppeared] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAppeared(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="signal-engine"
      aria-labelledby="se-heading"
      className="relative py-28 sm:py-36 overflow-hidden"
      style={{ background: "#091002" }}
    >
      {/* ambient radial glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 75% 50% at 50% 65%, rgba(19,146,94,0.11) 0%, transparent 70%)",
        }}
      />

      {/* grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(236,251,223,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(236,251,223,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container-soft relative z-10 mx-auto">
        {/* ── Header ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={appeared ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 sm:mb-20"
        >
          <p
            className="text-xs font-semibold tracking-[0.22em] uppercase mb-4"
            style={{ color: "#b2ef80" }}
          >
            Was eine starke Website wirklich leisten muss
          </p>
          <h2
            id="se-heading"
            className="text-3xl font-bold tracking-tight text-balance sm:text-5xl"
            style={{ color: "#ecfbdf" }}
          >
            Sichtbarkeit.&nbsp;Vertrauen.&nbsp;Anfragen.
          </h2>
          <p
            className="mt-4 text-base leading-relaxed max-w-xl mx-auto"
            style={{ color: "rgba(236,251,223,0.50)" }}
          >
            Kein Baukastenauftritt. Sondern ein digitaler Kanal,
            der f&uuml;r Ihr Unternehmen arbeitet.
          </p>
        </motion.div>

        {/* ── Three pillars + logo centre ── */}
        {/*
          Mobile: stack vertically
          Desktop: logo in centre, cards left + right  →  1 / logo / 2 / 3
          We use a flat flex row on md+ with a centred logo mark between card 0 and card 1+2
          Actually: all three cards + logo in a single responsive row.
          Layout: [card0] [connector] [logo] [connector] [card1] [connector] [card2]
        */}
        <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-0">
          {/* card 0 */}
          <PillarCard
            pillar={PILLARS[0]}
            appeared={appeared}
            reduced={reduced}
          />

          <ConnectorLine
            color={PILLARS[0].color}
            appeared={appeared}
            delay={0.22}
            reduced={reduced}
          />

          {/* logo mark — centred between cards on desktop, hidden on mobile */}
          <div className="hidden md:flex items-center justify-center mx-4">
            <LogoMark appeared={appeared} reduced={reduced} />
          </div>

          <ConnectorLine
            color={PILLARS[1].color}
            appeared={appeared}
            delay={0.3}
            reduced={reduced}
          />

          {/* card 1 */}
          <PillarCard
            pillar={PILLARS[1]}
            appeared={appeared}
            reduced={reduced}
          />

          <ConnectorLine
            color={PILLARS[2].color}
            appeared={appeared}
            delay={0.38}
            reduced={reduced}
          />

          {/* card 2 */}
          <PillarCard
            pillar={PILLARS[2]}
            appeared={appeared}
            reduced={reduced}
          />
        </div>

        {/* logo mark for mobile — visible below cards */}
        <div className="flex justify-center mt-10 md:hidden">
          <LogoMark appeared={appeared} reduced={reduced} />
        </div>

        {/* hairline */}
        <div
          aria-hidden
          className="mx-auto mt-16 mb-12"
          style={{
            height: "1px",
            maxWidth: "320px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(236,251,223,0.12) 50%, transparent 100%)",
          }}
        />

        {/* ── CTA ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={appeared ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/leistungen"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200"
            style={{
              background: "#b2ef80",
              color: "#091002",
              boxShadow: "0 8px 24px -8px rgba(178,239,128,0.40)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.filter = "brightness(1.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.filter = "";
            }}
          >
            Leistungen und Preise ansehen
          </Link>
          <Link
            href="/projekte/ergart"
            className="text-sm transition-all duration-200 underline underline-offset-4"
            style={{ color: "rgba(236,251,223,0.42)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "rgba(236,251,223,0.85)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "rgba(236,251,223,0.42)";
            }}
          >
            Case Study ansehen
          </Link>
        </motion.div>
      </div>

      {/* global keyframe for logo rings */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
