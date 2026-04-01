// src/components/CaseStudyPreview.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { ArrowRight, TrendingUp, Search, Clock } from "lucide-react";

const chips = [
  { icon: <TrendingUp className="h-3.5 w-3.5" />, label: "+300 % Traffic" },
  { icon: <Search className="h-3.5 w-3.5" />, label: "Platz 1 bei Google" },
  { icon: <Clock className="h-3.5 w-3.5" />, label: "1,5+ Jahre Partnerschaft" },
];

export default function CaseStudyPreview() {
  return (
    <section
      id="case-study-preview"
      className="container relative z-10 py-20 scroll-mt-28 sm:py-24"
      aria-labelledby="case-preview-title"
    >
      <FadeIn>
        <motion.div
          whileHover={{ scale: 1.005 }}
          transition={{ type: "spring", stiffness: 150, damping: 22 }}
          className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-md"
        >
          {/* Brand-Glow */}
          <div aria-hidden className="absolute inset-0 pointer-events-none -z-10">
            <div className="absolute -right-24 -top-24 h-[30rem] w-[30rem] rounded-full blur-3xl bg-[radial-gradient(closest-side,hsl(var(--primary)/0.08),transparent_70%)]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Linke Seite: Text */}
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
              <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-medium text-primary mb-4">
                Case Study
              </span>

              {/* Ergart SVG Logo */}
              <div className="mb-4">
                <Image
                  src="/case-studies/ergart/logo.svg"
                  alt="Ergart GmbH"
                  width={120}
                  height={44}
                  className="h-8 w-auto"
                />
              </div>

              <h2
                id="case-preview-title"
                className="text-2xl font-bold tracking-tight font-heading sm:text-3xl text-balance"
              >
                Vom lokalen Handwerker zur ersten Adresse bei Google
              </h2>
              <p className="text-sm font-medium text-foreground/55 mt-1">
                Ergart GmbH &middot; Handwerksmeister im Saarland
              </p>

              <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                Alexander Ergart hatte weder Zeit noch Ambitionen, sich mit
                Website und SEO zu beschäftigen. Drei Monate nach Relaunch:
                Platz&nbsp;1 bei den wichtigsten Suchbegriffen, 300&nbsp;%
                mehr Traffic, voller Terminkalender.
              </p>

              {/* KPI Chips */}
              <div className="flex flex-wrap gap-2 mt-5">
                {chips.map((c) => (
                  <span
                    key={c.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-[11px] font-medium text-foreground/70"
                  >
                    {c.icon}
                    {c.label}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/projekte/ergart"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Vollständige Story lesen
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://alexander-ergart.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2.5 text-sm text-foreground/60 hover:text-foreground transition-colors"
                >
                  alexander-ergart.de besuchen
                </a>
              </div>
            </div>

            {/* Rechte Seite: Firmenzentrale Foto mit dezenter Parallax */}
            <motion.div
              className="relative min-h-[280px] md:min-h-full overflow-hidden md:rounded-r-3xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Image
                src="/case-studies/ergart/firmenzentrale.webp"
                alt="Firmenzentrale Ergart GmbH mit Firmenfahrzeugen im Saarland"
                fill
                className="object-cover transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
              />
            </motion.div>
          </div>
        </motion.div>
      </FadeIn>
    </section>
  );
}
