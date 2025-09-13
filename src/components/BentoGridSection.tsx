// src/components/ui/BentoGridSection.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Code2, Palette, ArrowRight } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import EdgeFade from "./ui/EdgeFade";

// Kleine Sub-Komponente für den animierten SEO-"Chart"
const ChartBar = ({ height, delay }: { height: string; delay: number }) => (
  <motion.div
    initial={{ height: 0 }}
    whileInView={{ height }}
    viewport={{ once: true, amount: 0.8 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className="w-full rounded-t bg-primary/80"
  />
);

const cardBase =
  "relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-sm";

export default function BentoGridSection() {
  return (
    <section id="leistungen" className="container py-24 scroll-mt-28 sm:py-32">
      <FadeIn>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight font-heading sm:text-4xl">
            Ihre Vision, unser Handwerk.
          </h2>
          <p className="mt-6 text-lg leading-8 text-foreground/80">
            Strategisches Design trifft technologische Exzellenz – für digitale
            Erlebnisse, die beeindrucken und messbar performen.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="grid grid-cols-1 gap-6 mx-auto mt-16 max-w-none md:grid-cols-3 lg:max-w-7xl">
          {/* Groß: Premium Web-Entwicklung */}
          <motion.div
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className={`${cardBase} md:col-span-2`}
          >
            <div
              aria-hidden
              className="absolute rounded-full -right-20 -bottom-20 h-52 w-52 bg-primary/10 blur-3xl"
            />
            <Code2 className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-xl font-semibold font-heading">
                Premium Web-Entwicklung
              </h3>
              <p className="mt-2 text-foreground/80">
                Handgeschriebener Code, moderne Architektur, kompromisslose
                Performance.
              </p>
            </div>
          </motion.div>

          {/* SEO: Mini-Chart */}
          <motion.div
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className={cardBase}
          >
            <div className="flex items-end w-full h-24 gap-2">
              <ChartBar height="40%" delay={0.1} />
              <ChartBar height="60%" delay={0.2} />
              <ChartBar height="50%" delay={0.3} />
              <ChartBar height="80%" delay={0.4} />
            </div>
            <div>
              <h3 className="text-xl font-semibold font-heading">
                Nachhaltiges SEO
              </h3>
              <p className="mt-2 text-foreground/80">
                Top-Platzierungen durch solides Tech-SEO & Content, der bleibt.
              </p>
            </div>
          </motion.div>

          {/* Brand & Design */}
          <motion.div
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className={cardBase}
          >
            <Palette className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-xl font-semibold font-heading">
                Markenidentität & Design
              </h3>
              <p className="mt-2 text-foreground/80">
                Konsistente Typo, Farben & Komponenten – Vertrauen, das man
                sieht.
              </p>
            </div>
          </motion.div>

          {/* Versprechen / CTA (breit) */}
          <motion.div
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className={`${cardBase} items-center justify-center text-center md:col-span-2`}
          >
            <div className="max-w-md">
              <h3 className="text-2xl font-bold font-heading">
                Ihre Vision. Unsere Expertise.
              </h3>
              <p className="mt-2 text-foreground/80">
                Lassen Sie uns etwas bauen, das Ihre Ziele nicht nur erreicht,
                sondern übertrifft.
              </p>
              <Link
                href="#prozess"
                className="inline-flex items-center mt-4 font-semibold group text-primary"
              >
                Unser Prozess
                <ArrowRight
                  className="ml-2 transition-transform group-hover:translate-x-1"
                  size={16}
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </FadeIn>
      <EdgeFade />
    </section>
  );
}
