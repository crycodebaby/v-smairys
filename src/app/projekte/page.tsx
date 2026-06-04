import React from "react";
import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Header } from "@/components/layout/Header";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/motion/Reveal";
import { CaseStudyCard } from "@/components/case-study/CaseStudyCard";
import { EmptyState } from "@/components/states/EmptyState";
import { CASE_STUDIES } from "@/config/case-studies";
import { BackdropIcons } from "@/components/backdrop/BackdropIcons";

export const metadata: Metadata = {
  title: "Projekte & Case Studies",
  description:
    "Ausgewählte Projekte der Smairys Netz-Manufaktur – belegbare digitale Vertriebsergebnisse für den Mittelstand.",
};

export default function ProjektePage() {
  const studies = CASE_STUDIES.filter((c) => c.status === "active");

  return (
    <>
      <Header />
      <Section isHero className="relative overflow-hidden bg-background pt-24 sm:pt-32">
        <BackdropIcons preset="generic" showFrom="sm" />
        <Container className="relative z-10">
          <Reveal as="div" className="max-w-2xl">
            <Kicker accent="brand">Projekte</Kicker>
            <h1 className="text-fluid-h1 font-bold leading-[1.05] tracking-tight text-foreground">
              Belegbare Vertriebsfundamente. Keine Showreels.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
              Wir zeigen Projekte, deren Wirkung sich messen lässt – über die
              Google Search Console, Ads-Reportings und harte
              Vertriebskennzahlen. Diese Auswahl wächst kontinuierlich.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section className="bg-background pb-16 sm:pb-24">
        <Container>
          {studies.length === 0 ? (
            <EmptyState
              variant="prettier"
              title="Bald verfügbar"
              body="Die ersten Case Studies werden gerade redaktionell finalisiert."
            />
          ) : (
            <div className="grid gap-5 sm:gap-6 lg:grid-cols-2 lg:gap-8">
              {studies.map((cs, idx) => (
                <Reveal key={cs.slug} delay={idx * 120}>
                  <CaseStudyCard caseStudy={cs} />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
