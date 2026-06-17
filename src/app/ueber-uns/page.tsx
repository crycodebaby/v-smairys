import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Header } from "@/components/layout/Header";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/motion/Reveal";
import { TechStackSection } from "@/components/sections/TechStackSection";
import { ContactFormSection } from "@/components/contact/ContactFormSection";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Über uns & Philosophie",
  description: "Die Haltung der Smairys Netz-Manufaktur. Handwerk statt Fließband.",
};

export default function UeberUnsPage() {
  return (
    <>
      <Header />
      <Section
        variant="hero"
        className="ambient-glow-amber relative overflow-hidden bg-background"
      >
        <Container>
          <div className="grid items-center gap-10 sm:gap-14 lg:grid-cols-2 lg:gap-24">

            <Reveal as="div" className="order-2 flex justify-center lg:order-1 lg:justify-start">
              <div className="relative w-full max-w-[420px] overflow-hidden sm:max-w-[500px]">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl"
                  style={{
                    background:
                      "radial-gradient(60% 60% at 40% 30%, hsl(var(--brand-glow) / 0.22), transparent 70%)",
                    filter: "blur(40px)",
                  }}
                />
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border bg-card/40">
                  <Image
                    src="/ceo-pictures/robin_smairys_portrait.webp"
                    alt={`${SITE.owner.name}, ${SITE.owner.role} der ${SITE.legalName}`}
                    fill
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className="object-cover object-top"
                    priority
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                </div>
              </div>
            </Reveal>

            <Reveal as="div" delay={120} className="order-1 flex flex-col lg:order-2">
              <Kicker accent="brand">Die Philosophie</Kicker>
              <h1 className="text-fluid-h1 font-bold leading-[1.05] tracking-tight">
                Handwerk statt Fließband.
              </h1>

              <div className="mt-8 space-y-6 text-fluid-p leading-relaxed text-muted-foreground">
                <p>
                  Seit 6 Jahren entwickeln wir digitale Infrastrukturen, die
                  exakt einem Zweck dienen: dem Aufbau sicherer, starker und
                  messbarer Vertriebskanäle für mittelständische Unternehmen.
                </p>
                <p>
                  Unsere Philosophie ist simpel: Qualität lässt sich nicht
                  skalieren, indem man Abstriche macht. Wir lehnen
                  Massenproduktionen ab und konzipieren stattdessen jede
                  Plattform wie eine maßgefertigte Architektur.
                </p>
                <p>
                  Gegründet und geführt von {SITE.owner.name} im{" "}
                  {SITE.address.region}, stehen wir als Inhaber-Agentur für
                  persönliche Verantwortung, direkte Kommunikation und
                  technologische Exzellenz in Next.js, SEO und B2B-Kampagnen.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-6 border-t border-border/50 pt-6 sm:mt-12 sm:gap-8 sm:pt-8">
                <div className="relative pl-4">
                  <span aria-hidden="true" className="brand-line-vertical absolute bottom-1 left-0 top-1" />
                  <div className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">6+</div>
                  <div className="mt-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
                    Jahre Expertise in Web &amp; SEO
                  </div>
                </div>
                <div className="relative pl-4">
                  <span aria-hidden="true" className="brand-line-vertical absolute bottom-1 left-0 top-1" />
                  <div className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">100 %</div>
                  <div className="mt-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
                    Inhouse-Entwicklung im {SITE.address.region}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <TechStackSection />

      <ContactFormSection
        pageType="ueber_uns"
        contactLocation="kontakt"
        kicker="Im Gespräch bleiben"
        title="Sie haben unsere Haltung gelesen. Sprechen wir über Ihr Projekt."
        description="Wir nehmen uns Zeit für eine erste Einschätzung – ohne Verkaufsdruck und ohne Massen-Workflow."
        withStandards={false}
        withAvailabilityNote={false}
      />
    </>
  );
}
