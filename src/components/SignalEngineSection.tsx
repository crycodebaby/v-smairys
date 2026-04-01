"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

type NodeId = "sichtbarkeit" | "vertrauen" | "anfragen";

interface SignalNode {
  id: NodeId;
  label: string;
  text: string;
  sub: string;
  // position in the arc around the logo, as angle in degrees (0 = top)
  angle: number;
  // brand colour stop per node
  color: string;
  glow: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const NODES: SignalNode[] = [
  {
    id: "sichtbarkeit",
    label: "Sichtbarkeit",
    text: "Gefunden werden, bevor Ihre Konkurrenz angerufen wird.",
    sub: "Technisches SEO, das nachweislich rankt.",
    angle: -115,
    color: "#b2ef80",
    glow: "rgba(178,239,128,0.22)",
  },
  {
    id: "vertrauen",
    label: "Vertrauen",
    text: "Ein professioneller erster Eindruck entscheidet oft vor dem ersten Gespräch.",
    sub: "Design und Substanz, die bleiben.",
    angle: 0,
    color: "#37e5da",
    glow: "rgba(55,229,218,0.22)",
  },
  {
    id: "anfragen",
    label: "Anfragen",
    text: "Aus Besuchern werden Gespräche, wenn Struktur und Klarheit stimmen.",
    sub: "Conversion-Architektur, nicht Baukastenlogik.",
    angle: 115,
    color: "#ecfbdf",
    glow: "rgba(236,251,223,0.18)",
  },
];

// ─── Geometry helpers ─────────────────────────────────────────────────────────

const DEG = Math.PI / 180;

function polarToXY(angleDeg: number, radius: number): { x: number; y: number } {
  // angle 0 = top, clockwise
  const rad = (angleDeg - 90) * DEG;
  return {
    x: Math.cos(rad) * radius,
    y: Math.sin(rad) * radius,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated SVG line from logo centre to node */
function SignalLine({
  angle,
  radius,
  color,
  active,
  reduced,
}: {
  angle: number;
  radius: number;
  color: string;
  active: boolean;
  reduced: boolean;
}) {
  const { x, y } = polarToXY(angle, radius);
  // path from 0,0 to x,y in SVG space (origin at centre)
  const d = `M 0 0 L ${x} ${y}`;
  const len = Math.sqrt(x * x + y * y);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`${-radius - 32} ${-radius - 32} ${(radius + 32) * 2} ${(radius + 32) * 2}`}
      aria-hidden
    >
      <defs>
        <linearGradient
          id={`grad-${angle}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
          gradientUnits="userSpaceOnUse"
          x1Attr={`0`}
          y1Attr={`0`}
          x2Attr={`${x}`}
          y2Attr={`${y}`}
        >
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="100%" stopColor={color} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path
        d={d}
        stroke={`url(#grad-${angle})`}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={active && !reduced ? 0 : len}
        style={{
          transition: reduced
            ? "none"
            : `stroke-dashoffset ${active ? "0.55s" : "0.3s"} cubic-bezier(0.4,0,0.2,1)`,
          opacity: active ? 1 : 0,
        }}
      />
    </svg>
  );
}

/** Ambient pulse ring on the logo when a node is active */
function LogoPulse({
  active,
  color,
  reduced,
}: {
  active: boolean;
  color: string;
  reduced: boolean;
}) {
  return (
    <span
      aria-hidden
      className="absolute inset-0 rounded-full pointer-events-none"
      style={{
        boxShadow: active ? `0 0 0 10px ${color}` : "0 0 0 0px transparent",
        transition: reduced ? "none" : "box-shadow 0.5s cubic-bezier(0.4,0,0.2,1)",
      }}
    />
  );
}

/** Single orbital node button */
function NodeButton({
  node,
  active,
  radius,
  onClick,
  reduced,
}: {
  node: SignalNode;
  active: boolean;
  radius: number;
  onClick: () => void;
  reduced: boolean;
}) {
  const { x, y } = polarToXY(node.angle, radius);

  // translate so that the button centres on the computed point
  const transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;

  return (
    <button
      aria-label={`${node.label} – ${node.text}`}
      aria-pressed={active}
      onClick={onClick}
      className="absolute left-1/2 top-1/2 focus-visible:outline-none group"
      style={{ transform }}
    >
      {/* outer ring */}
      <span
        className="flex items-center justify-center w-14 h-14 rounded-full border transition-all duration-300"
        style={{
          borderColor: active ? node.color : "rgba(236,251,223,0.14)",
          background: active
            ? `radial-gradient(circle at 50% 50%, ${node.glow}, transparent 70%)`
            : "rgba(9,16,2,0.55)",
          boxShadow: active ? `0 0 22px 4px ${node.glow}` : "none",
        }}
      >
        {/* inner dot */}
        <span
          className="w-2.5 h-2.5 rounded-full transition-all duration-300"
          style={{
            background: active ? node.color : "rgba(236,251,223,0.30)",
            boxShadow: active ? `0 0 8px 2px ${node.color}` : "none",
          }}
        />
      </span>

      {/* label */}
      <span
        className="absolute left-1/2 -translate-x-1/2 mt-2 top-full whitespace-nowrap text-xs font-medium tracking-widest uppercase transition-all duration-300"
        style={{
          color: active ? node.color : "rgba(236,251,223,0.45)",
        }}
      >
        {node.label}
      </span>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SignalEngineSection() {
  const reduced = useReducedMotion() ?? false;
  const [active, setActive] = useState<NodeId | null>(null);
  const [appeared, setAppeared] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Stagger-reveal on first viewport entry
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
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const toggleNode = useCallback(
    (id: NodeId) => setActive((prev) => (prev === id ? null : id)),
    []
  );

  // close on outside click / tap
  const handleBackdrop = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) setActive(null);
    },
    []
  );

  const activeNode = NODES.find((n) => n.id === active) ?? null;

  // Responsive orbit radius (CSS variable approach — use fixed values for SSR safety)
  const ORBIT_R = 148;

  return (
    <section
      ref={sectionRef}
      id="signal-engine"
      aria-labelledby="se-heading"
      className="relative py-28 sm:py-36 overflow-hidden"
      style={{ background: "#091002" }}
    >
      {/* ── ambient background glow ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 60%, rgba(19,146,94,0.12) 0%, transparent 70%)",
        }}
      />

      {/* ── grid texture ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(236,251,223,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(236,251,223,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container-soft relative z-10 mx-auto">
        {/* ── Header ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 22 }}
          animate={appeared ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20 sm:mb-24"
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
            style={{ color: "rgba(236,251,223,0.55)" }}
          >
            Keine Baukastenfl&auml;che. Sondern ein digitaler Auftritt, der f&uuml;r Ihr Unternehmen
            arbeitet.
          </p>
        </motion.div>

        {/* ── Stage ── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.97 }}
          animate={appeared ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center"
          style={{ height: `${(ORBIT_R + 80) * 2}px` }}
          onClick={handleBackdrop}
          aria-label="Interaktive Bühne – Wählen Sie einen Bereich"
        >
          {/* orbit track */}
          <div
            aria-hidden
            className="absolute rounded-full border pointer-events-none"
            style={{
              width: `${ORBIT_R * 2}px`,
              height: `${ORBIT_R * 2}px`,
              borderColor: "rgba(236,251,223,0.07)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          />

          {/* signal lines — rendered behind the logo */}
          {NODES.map((n) => (
            <div
              key={n.id}
              className="absolute inset-0 pointer-events-none"
              aria-hidden
            >
              <SignalLine
                angle={n.angle}
                radius={ORBIT_R}
                color={n.color}
                active={active === n.id}
                reduced={reduced}
              />
            </div>
          ))}

          {/* ── Logo centre ── */}
          <div className="relative flex items-center justify-center z-10">
            {/* pulse ring */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: "96px",
                height: "96px",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
              }}
            >
              <LogoPulse
                active={!!active}
                color={activeNode?.glow ?? "rgba(178,239,128,0.15)"}
                reduced={reduced}
              />
            </div>

            {/* logo image */}
            <div
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex items-center justify-center"
              style={{
                background: "rgba(9,16,2,0.85)",
                border: "1px solid rgba(236,251,223,0.12)",
                boxShadow: active
                  ? `0 0 40px 8px ${activeNode?.glow}`
                  : "0 0 0 0px transparent",
                transition: reduced
                  ? "none"
                  : "box-shadow 0.5s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <Image
                src="/logo/smairys.png"
                alt="SMAIRYS Netz-Manufaktur"
                width={64}
                height={64}
                className="object-contain w-14 h-14 relative z-10"
              />
            </div>
          </div>

          {/* ── Node buttons ── */}
          {NODES.map((node) => (
            <NodeButton
              key={node.id}
              node={node}
              active={active === node.id}
              radius={ORBIT_R}
              onClick={() => toggleNode(node.id)}
              reduced={reduced}
            />
          ))}
        </motion.div>

        {/* ── Info panel ── */}
        <div className="mt-8 flex justify-center min-h-[90px]" aria-live="polite">
          <AnimatePresence mode="wait">
            {activeNode ? (
              <motion.div
                key={activeNode.id}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="text-center max-w-md"
              >
                <p
                  className="text-lg font-medium leading-snug text-balance"
                  style={{ color: activeNode.color }}
                >
                  {activeNode.text}
                </p>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: "rgba(236,251,223,0.45)" }}
                >
                  {activeNode.sub}
                </p>
              </motion.div>
            ) : (
              <motion.p
                key="idle"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-center"
                style={{ color: "rgba(236,251,223,0.28)" }}
              >
                W&auml;hlen Sie einen Bereich
              </motion.p>
            )}
          </AnimatePresence>
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
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={appeared ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/leistungen"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200"
            style={{
              background: "#b2ef80",
              color: "#091002",
              boxShadow: "0 8px 24px -8px rgba(178,239,128,0.4)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.filter =
                "brightness(1.08)";
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
            style={{ color: "rgba(236,251,223,0.45)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "rgba(236,251,223,0.85)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "rgba(236,251,223,0.45)";
            }}
          >
            Case Study ansehen
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
