// src/components/ResultsSection.tsx
"use client";

import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import Link from "next/link";

const stats = [
  {
    kpi: "+300 %",
    label: "Website-Traffic",
    company: "Ergart GmbH",
    detail: "Von Platz 64 auf Platz 1 bei Google – in 3 Monaten",
  },
  {
    kpi: "+140 %",
    label: "Projektanfragen",
    company: "Crncic Bausanierung",
    detail: "Kompletter Neuauftritt mit technischem SEO",
  },
  {
    kpi: "4×",
    label: "Online-Buchungen",
    company: "Eppelstyle",
    detail: "KI-Buchungstool & modernes Design",
  },
  {
    kpi: "98+",
    label: "Lighthouse Score",
    company: "Durchschnitt aller Projekte",
    detail: "Performance, SEO & Best Practices",
  },
];

export default function ResultsSection() {
  return (
    <section
      id="ergebnisse"
      className="relative py-20 scroll-mt-28 sm:py-24"
      aria-labelledby="ergebnisse-title"
    >
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute left-1/2 top-1/2 h-[40rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl bg-[radial-gradient(closest-side,hsl(var(--primary)/0.06),transparent_70%)]" />
      </div>

        <div className="container relative z-10">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center">
            <h2
              id="ergebnisse-title"
              className="text-3xl font-bold tracking-tight font-heading sm:text-4xl"
            >
              Ergebnisse, die sprechen
            </h2>
            <p className="mt-4 text-base leading-7 text-foreground/80 sm:text-lg">
              Echte Zahlen, echte Unternehmen – aus Handwerk, Bau und
              Dienstleistung in der Region.
            </p>
          </div>
        </FadeIn>

        {/* Statistiken Grid */}
        <FadeIn>
          <div className="grid grid-cols-1 gap-4 mx-auto mt-12 max-w-5xl sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                whileHover={{ y: -3, boxShadow: "0 12px 32px -8px rgba(0,0,0,0.18)" }}
                className="relative flex flex-col p-6 border rounded-2xl border-border/60 bg-card/80 shadow-sm transition-colors"
              >
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent"
                />
                <div className="relative z-10">
                  <div className="text-4xl font-bold text-primary font-heading">
                    {s.kpi}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-foreground">
                    {s.label}
                  </div>
                  <div className="mt-1 text-xs text-foreground/60">
                    {s.company}
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/50 text-[11px] text-foreground/65 leading-relaxed">
                    {s.detail}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        {/* Link zur Case Study */}
        <FadeIn>
          <div className="mt-10 text-center">
            <Link
              href="/projekte/ergart"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              Vollständige Case Study: Ergart GmbH ansehen
              <span aria-hidden>&#8594;</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
