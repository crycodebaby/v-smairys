// src/components/CaseStudyPreview.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { ArrowRight, TrendingUp, Search, Star } from "lucide-react";

const chips = [
  { icon: <TrendingUp className="h-3.5 w-3.5" />, label: "+300 % Traffic" },
  { icon: <Search className="h-3.5 w-3.5" />, label: "Platz 1 bei Google" },
  { icon: <Star className="h-3.5 w-3.5" />, label: "3 Monate" },
];

export default function CaseStudyPreview() {
  return (
    <section
      id="case-study-preview"
      className="container py-20 scroll-mt-28 sm:py-24"
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
            <div className="absolute -right-24 -top-24 h-[30rem] w-[30rem] rounded-full blur-3xl bg-[radial-gradient(closest-side,hsl(var(--primary)/0.10),transparent_70%)]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Linke Seite: Text */}
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
              <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-medium text-primary mb-4">
                Case Study
              </span>

              <h2
                id="case-preview-title"
                className="text-2xl font-bold tracking-tight font-heading sm:text-3xl"
              >
                Von Platz 64 auf Platz 1 bei Google
              </h2>
              <p className="text-sm font-medium text-foreground/60 mt-1">
                Ergart GmbH · Handwerksmeister im Saarland
              </p>

              <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                Alexander Ergart hatte weder Zeit noch Ambitionen, sich mit
                Website und SEO zu beschäftigen. Innerhalb von drei Monaten
                nach Relaunch: Platz 1 bei den wichtigsten Suchbegriffen,
                300 % mehr Traffic, voller Terminkalender.
              </p>

              {/* KPI Chips */}
              <div className="flex flex-wrap gap-2 mt-5">
                {chips.map((c, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-[11px] font-medium text-foreground/70"
                  >
                    {c.icon}
                    {c.label}
                  </span>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  href="/projekte/ergart"
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Vollständige Story lesen
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Rechte Seite: Logo + Screenshot Platzhalter */}
            <div className="relative flex items-center justify-center p-8 bg-gradient-to-br from-primary/5 via-transparent to-transparent md:rounded-r-3xl min-h-[280px]">
              <div className="relative w-48 h-24">
                <Image
                  src="/testimonials/ergart-logo.png"
                  alt="Ergart GmbH Logo"
                  fill
                  className="object-contain"
                  sizes="192px"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </FadeIn>
    </section>
  );
}
