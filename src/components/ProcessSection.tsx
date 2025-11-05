// src/components/ProcessSection.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import FadeIn from "./FadeIn";
import { Handshake, Code2, Rocket } from "lucide-react";

const phases = [
  {
    icon: <Handshake className="w-10 h-10 text-primary" />,
    title: "Verstehen",
    text: "Du erklärst, was du brauchst – ich höre zu, stelle Fragen und denke mit.",
  },
  {
    icon: <Code2 className="w-10 h-10 text-primary" />,
    title: "Bauen",
    text: "Ich programmiere deine Lösung, sauber, skalierbar, präzise. So, als wäre sie meine eigene.",
  },
  {
    icon: <Rocket className="w-10 h-10 text-primary" />,
    title: "Begleiten",
    text: "Nach dem Launch bleibe ich an deiner Seite; für Updates, Wachstum und neue Ideen.",
  },
];

export default function ProcessSection() {
  return (
    <section
      id="prozess"
      className="relative py-24 overflow-hidden sm:py-32 scroll-mt-28"
    >
      <FadeIn>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight font-heading sm:text-4xl">
            Der Weg mit SMAIRYS
          </h2>
          <p className="mt-4 text-lg text-foreground/80">
            Kein komplizierter Prozess. Nur du, ich – und dein Ziel.
          </p>
        </div>
      </FadeIn>

      {/* zarte Verbindungslinie */}
      <div
        aria-hidden
        className="absolute inset-x-0 h-px pointer-events-none top-1/2 -z-10 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
      />

      {/* Timeline */}
      <div className="container relative grid gap-16 mt-16 sm:gap-12 md:grid-cols-3">
        {phases.map((p, i) => (
          <FadeIn key={i}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative flex flex-col items-center p-8 text-center transition-all border shadow-sm rounded-2xl border-border/60 bg-card/80 hover:shadow-md"
            >
              <div
                aria-hidden
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent"
              />
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full shadow-inner bg-background ring-2 ring-primary/70">
                  {p.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold font-heading">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/80">{p.text}</p>
              </div>
            </motion.div>
          </FadeIn>
        ))}
      </div>

      {/* CTA */}
      <FadeIn>
        <div className="mt-16 text-center">
          <Link
            href="#kontakt"
            className="inline-flex items-center justify-center btn-premium"
          >
            Jetzt unverbindlich sprechen
          </Link>
          <p className="mt-3 text-sm text-foreground/70">
            Persönlich. Transparent. Ohne Agentur-Bla.
          </p>
        </div>
      </FadeIn>
    </section>
  );
}
