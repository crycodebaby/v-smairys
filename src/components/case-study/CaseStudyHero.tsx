import Image from "next/image";
import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import type { CaseStudy } from "@/config/case-studies";

type CaseStudyHeroProps = {
  caseStudy: CaseStudy;
};

/**
 * Hero einer Case Study. Großes Firmenzentrale-Bild bekommt Bühne, das
 * Logo sitzt in einer kleinen Glass-Plakette darüber. Brand-Akzent
 * begrenzt sich auf die Kicker-Linie und ein dezentes Glow hinter der
 * Bild-Maske.
 */
export function CaseStudyHero({ caseStudy }: CaseStudyHeroProps) {
  return (
    <Section variant="page-header" className="relative bg-background">
      <Container>
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal as="div" className="lg:col-span-6">
            <div className="flex items-center gap-3">
              <span
                className="brand-underline"
                style={{ width: "2.5rem" }}
                aria-hidden="true"
              />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-soft">
                Case Study
              </span>
            </div>

            {caseStudy.logo && (
              <div className="mt-6 inline-flex items-center gap-3 rounded-lg border border-border/60 bg-card/50 px-4 py-2 shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.06)]">
                <Image
                  src={caseStudy.logo.src}
                  alt={caseStudy.logo.alt}
                  width={120}
                  height={32}
                  className="h-7 w-auto object-contain"
                />
                {caseStudy.industry && (
                  <span className="border-l border-border/60 pl-3 text-xs uppercase tracking-widest text-muted-foreground">
                    {caseStudy.industry}
                  </span>
                )}
              </div>
            )}

            <h1 className="mt-8 text-fluid-h1 font-bold leading-[1.05] tracking-tight text-foreground">
              {caseStudy.headline}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {caseStudy.summary}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-y-4 gap-x-8 border-t border-border/40 pt-6 text-sm sm:max-w-md">
              {caseStudy.region && (
                <>
                  <dt className="text-muted-foreground">Region</dt>
                  <dd className="font-medium text-foreground">{caseStudy.region}</dd>
                </>
              )}
              {caseStudy.timeframe && (
                <>
                  <dt className="text-muted-foreground">Zeitraum</dt>
                  <dd className="font-medium text-foreground">{caseStudy.timeframe}</dd>
                </>
              )}
              <dt className="text-muted-foreground">Status</dt>
              <dd className="flex items-center gap-2 font-medium text-foreground">
                <span
                  className={`brand-dot ${
                    caseStudy.status === "active" ? "animate-brand-pulse" : ""
                  }`}
                  aria-hidden="true"
                />
                {caseStudy.status === "active" ? "Laufende Betreuung" : "Abgeschlossen"}
              </dd>
            </dl>
          </Reveal>

          <Reveal as="div" delay={140} className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-2xl border border-border/60 shadow-[0_30px_90px_-30px_hsl(0_0%_0%/0.7)]">
              {/* Brand-Glow hinter dem Hero */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-12 -top-20 h-40"
                style={{
                  background:
                    "radial-gradient(50% 60% at 50% 0%, hsl(var(--brand-glow) / 0.30), transparent 70%)",
                  filter: "blur(40px)",
                }}
              />
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={caseStudy.hero.src}
                  alt={caseStudy.hero.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                  className="object-cover"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
