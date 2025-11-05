"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Code2,
  Palette,
  ArrowRight,
  Gauge,
  SearchCheck,
  Rocket,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import FadeIn from "@/components/FadeIn";
import EdgeFade from "./ui/EdgeFade";

/* ----------------------------------------------------
   Base Styles (Performance & Eleganz)
---------------------------------------------------- */
const cardBase =
  "relative flex flex-col rounded-2xl border border-border/60 bg-card/90 shadow-sm ring-1 ring-black/0 transition-all";
const hoverFx =
  "hover:shadow-xl hover:ring-black/5 hover:border-border/80 motion-safe:hover:-translate-y-[2px]";
const titleCls = "text-[17px] font-semibold font-heading tracking-tight";
const textCls = "text-sm text-foreground/80 leading-6";
const chipCls =
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium border-border/60 text-foreground/70 bg-background/60";

/* ----------------------------------------------------
   iOS-Safe Glow (keine Blurs, kein Overdraw)
---------------------------------------------------- */
const Glow = () => (
  <div
    aria-hidden
    className="absolute inset-0 pointer-events-none -z-10"
    style={{
      background:
        "linear-gradient(160deg, hsl(var(--primary)/0.08) 0%, transparent 70%)",
    }}
  />
);

/* ----------------------------------------------------
   Sparkline (leicht animiert, sichtbar auf iOS)
---------------------------------------------------- */
function Sparkline({
  points = [3, 4, 4, 6, 5, 8, 7, 9, 12, 13],
}: {
  points?: number[];
}) {
  const max = Math.max(...points);
  const d = points
    .map((y, i) => `${i === 0 ? "M" : "L"} ${i * 10} ${20 - (y / max) * 18}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 22" className="w-full text-primary">
      <motion.path
        d={d}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
    </svg>
  );
}

/* ----------------------------------------------------
   Progress Bars (KPI Visualisierung)
---------------------------------------------------- */
function Progress({ value, delay = 0 }: { value: number; delay?: number }) {
  return (
    <div className="w-full h-2 overflow-hidden rounded-full bg-border/60">
      <motion.div
        className="h-full rounded-full bg-primary will-change-[width]"
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
      />
    </div>
  );
}

/* ----------------------------------------------------
   KPI Chip (Icon + Label)
---------------------------------------------------- */
function Kpi({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <span className={chipCls}>
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {label}
    </span>
  );
}

/* ----------------------------------------------------
   SECTION
---------------------------------------------------- */
export default function BentoGridSection() {
  return (
    <section
      id="leistungen"
      className="container py-18 scroll-mt-28 sm:py-24 lg:py-28"
      aria-labelledby="leistungen-title"
    >
      {/* ---------- Intro ---------- */}
      <FadeIn>
        <div className="max-w-3xl mx-auto text-center">
          <h2
            id="leistungen-title"
            className="text-3xl font-bold tracking-tight font-heading sm:text-4xl"
          >
            Deine Vision. Unser Handwerk.
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-base leading-7 text-foreground/80 sm:text-lg">
            SMAIRYS vereint Design, Technologie und Strategie zu digitalen
            Erlebnissen, die sichtbar performen.
          </p>
        </div>
      </FadeIn>

      {/* ---------- GRID ---------- */}
      <FadeIn>
        <div
          className="
            mx-auto mt-12 grid max-w-7xl
            auto-rows-[1fr]
            grid-cols-1 gap-4
            md:grid-cols-12
          "
        >
          {/* ----------- Web-Entwicklung ----------- */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={`${cardBase} ${hoverFx} md:col-span-8 p-5 sm:p-6`}
          >
            <Glow />
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              <h3 className={titleCls}>Premium Web-Entwicklung</h3>
            </div>
            <p className={`${textCls} mt-2`}>
              Handgeschriebener Code, modulare Architektur, kompromisslose
              Performance – entwickelt für Marken, die wachsen.
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-4">
              <Kpi icon={Gauge} label="Lighthouse 98–100" />
              <Kpi icon={Rocket} label="TTFB < 100 ms" />
              <Kpi icon={ShieldCheck} label="DSGVO & Hosting DE" />
            </div>

            <div className="grid grid-cols-3 gap-3 mt-5 text-xs text-foreground/70">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span>Performance</span>
                  <span>100</span>
                </div>
                <Progress value={100} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span>SEO</span>
                  <span>98</span>
                </div>
                <Progress value={98} delay={0.05} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span>Best Practices</span>
                  <span>100</span>
                </div>
                <Progress value={100} delay={0.1} />
              </div>
            </div>
          </motion.div>

          {/* ----------- SEO ----------- */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={`${cardBase} ${hoverFx} md:col-span-4 p-5 sm:p-6`}
          >
            <Glow />
            <div className="flex items-center gap-2">
              <SearchCheck className="w-5 h-5 text-primary" />
              <h3 className={titleCls}>Nachhaltiges SEO</h3>
            </div>

            <div className="p-3 mt-3 border rounded-lg border-border/60 bg-background/70">
              <Sparkline />
            </div>

            <ul className="grid gap-1 pl-4 mt-3 text-sm list-disc text-foreground/75">
              <li>Technisches Fundament (Core Web Vitals)</li>
              <li>Content-Strategie statt „Tricks“</li>
              <li>Saubere Informationsarchitektur</li>
            </ul>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className={chipCls}>+ 180 % Sichtbarkeit</span>
              <span className={chipCls}>Indexierung stabil</span>
              <span className={chipCls}>Schema-Markup</span>
            </div>
          </motion.div>

          {/* ----------- Design & Branding ----------- */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={`${cardBase} ${hoverFx} md:col-span-4 p-5 sm:p-6`}
          >
            <Glow />
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              <h3 className={titleCls}>Markenidentität & Design</h3>
            </div>
            <p className={`${textCls} mt-2`}>
              Konsistente Typografie, modulare Systeme, sinnvolle Bewegung –
              Design, das Vertrauen schafft.
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className={chipCls}>Design-System</span>
              <span className={chipCls}>Komponenten-Library</span>
              <span className={chipCls}>Motion-Guidelines</span>
            </div>

            <div
              aria-hidden
              className="p-3 mt-4 border rounded-xl border-border/60 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"
            >
              <div className="grid grid-cols-3 gap-2 text-[11px] text-foreground/70">
                <div className="p-2 text-center border rounded-lg border-border/60 bg-card/80">
                  Buttons
                </div>
                <div className="p-2 text-center border rounded-lg border-border/60 bg-card/80">
                  Forms
                </div>
                <div className="p-2 text-center border rounded-lg border-border/60 bg-card/80">
                  Badges
                </div>
              </div>
            </div>
          </motion.div>

          {/* ----------- CTA / Versprechen ----------- */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={`${cardBase} ${hoverFx} md:col-span-8 items-center justify-center text-center p-6`}
          >
            <Glow />
            <div className="max-w-lg mx-auto">
              <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-[11px] font-medium text-foreground/70">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Von der Idee zum Launch in 30 Tagen</span>
              </div>
              <h3 className="text-2xl font-bold font-heading">
                Deine Vision. Unsere Expertise.
              </h3>
              <p className="mt-2 text-sm text-foreground/80">
                Wir entwickeln Lösungen, die deine Ziele nicht nur erreichen,
                sondern übertreffen: messbar und nachhaltig.
              </p>
              <Link
                href="#prozess"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 mt-4 text-sm font-semibold transition-colors border rounded-lg group border-border/60 bg-background/70 text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                Unser Prozess
                <ArrowRight
                  className="ml-0.5 transition-transform group-hover:translate-x-1"
                  size={16}
                />
              </Link>
            </div>
          </motion.div>

          {/* ----------- Sicherheit ----------- */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={`${cardBase} ${hoverFx} md:col-span-4 p-5 sm:p-6`}
          >
            <Glow />
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h3 className={titleCls}>Sicherheit & Compliance</h3>
            </div>
            <p className={`${textCls} mt-2`}>
              DSGVO-konform, Hosting in Deutschland, sichere Deploy-Pipelines.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className={chipCls}>ISO-27001 Cloud</span>
              <span className={chipCls}>Pen-Test ready</span>
              <span className={chipCls}>Role-based Access</span>
            </div>
          </motion.div>
        </div>
      </FadeIn>

      <EdgeFade />
    </section>
  );
}
