// src/components/PricingSection.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    tagline: "Für Handwerker & Einsteiger",
    price: "ab 1.500 €",
    note: "Einmalig, netto",
    features: [
      "Bis zu 5 Unterseiten",
      "Responsives Design (Mobile-First)",
      "Kontaktformular & Google Maps",
      "On-Page SEO Grundgerüst",
      "DSGVO-konform (Hosting DE)",
      "30 Tage Support nach Launch",
    ],
    cta: "Anfragen",
    highlighted: false,
  },
  {
    name: "Professional",
    tagline: "Für Betriebe, die wachsen wollen",
    price: "ab 3.500 €",
    note: "Einmalig, netto",
    features: [
      "Bis zu 15 Unterseiten",
      "Individuelles Design-System",
      "Technisches SEO (Core Web Vitals)",
      "Schema-Markup & lokale Sichtbarkeit",
      "Performance-Optimierung",
      "3 Monate Betreuung inklusive",
      "Google Business Profil Setup",
    ],
    cta: "Projekt besprechen",
    highlighted: true,
  },
  {
    name: "Betreuung",
    tagline: "Laufende Pflege & Weiterentwicklung",
    price: "ab 250 €/Monat",
    note: "Monatlich, netto",
    features: [
      "Hosting & SSL-Zertifikat",
      "Technische Updates & Monitoring",
      "Inhaltliche Änderungen",
      "SEO-Reporting monatlich",
      "Direkte Erreichbarkeit",
      "Keine Mindestlaufzeit",
    ],
    cta: "Betreuung anfragen",
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <section
      id="preise"
      className="relative py-20 scroll-mt-28 sm:py-24"
      aria-labelledby="preise-title"
    >
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute left-1/2 top-1/2 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl bg-[radial-gradient(closest-side,hsl(var(--primary)/0.06),transparent_70%)]" />
      </div>

      <div className="container">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center">
            <h2
              id="preise-title"
              className="text-3xl font-bold tracking-tight font-heading sm:text-4xl"
            >
              Transparente Preise
            </h2>
            <p className="mt-4 text-base leading-7 text-foreground/80 sm:text-lg">
              Investition, die sich rechnet. Alle Pakete sind auf Anfrage
              erweiterbar – sprechen Sie mich direkt an.
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="grid grid-cols-1 gap-6 mx-auto mt-12 max-w-5xl md:grid-cols-3">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 22 }}
                className={`relative flex flex-col rounded-2xl border p-6 shadow-sm transition-all ${
                  plan.highlighted
                    ? "border-primary/60 bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.3),var(--shadow-md)] ring-1 ring-primary/20"
                    : "border-border/60 bg-card/80"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-primary px-3 py-0.5 text-[11px] font-semibold text-primary-foreground">
                      Empfohlen
                    </span>
                  </div>
                )}

                <div
                  aria-hidden
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent"
                />

                <div className="relative z-10">
                  <h3 className="text-lg font-bold font-heading">{plan.name}</h3>
                  <p className="mt-0.5 text-xs text-foreground/60">{plan.tagline}</p>

                  <div className="mt-4">
                    <span className="text-3xl font-bold text-foreground font-heading">
                      {plan.price}
                    </span>
                    <span className="ml-1 text-xs text-foreground/55">{plan.note}</span>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-sm text-foreground/80">
                        <Check
                          className="w-4 h-4 mt-0.5 shrink-0 text-primary"
                          aria-hidden
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <Link
                      href="/kontakt"
                      className={`inline-flex w-full items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold transition-colors ${
                        plan.highlighted
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border border-border/60 bg-background/70 text-foreground hover:border-foreground/30"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        <FadeIn>
          <p className="mt-8 text-center text-xs text-foreground/55">
            Alle Preise zzgl. MwSt. · Individuelle Projekte werden nach Aufwand
            kalkuliert · Im Erstgespräch erhalten Sie ein konkretes Angebot.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
