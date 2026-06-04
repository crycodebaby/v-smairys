import Image from "next/image";
import React from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/motion/Reveal";
import type { CaseStudy } from "@/config/case-studies";

type CaseStudyNarrativeProps = {
  caseStudy: CaseStudy;
};

/**
 * Erzählerischer Hauptteil mit Sidebar (Portrait / Stamm-Daten).
 *
 * Layout:
 *  - Sidebar links (sticky ab `lg`): Portrait + Kunden-Stammdaten.
 *  - Hauptbereich rechts: Challenge / Approach / Outcome als drei
 *    aufeinander aufbauende Blöcke mit Brand-Akzent-Punkten.
 */
export function CaseStudyNarrative({ caseStudy }: CaseStudyNarrativeProps) {
  return (
    <Section className="bg-background">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal as="aside" className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              {caseStudy.portrait && (
                <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 shadow-[0_24px_60px_-30px_hsl(0_0%_0%/0.7)]">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
                  />
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={caseStudy.portrait.src}
                      alt={caseStudy.portrait.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, 70vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <dl className="mt-6 divide-y divide-border/40 rounded-2xl border border-border/40 bg-card/40">
                <Row label="Auftraggeber" value={caseStudy.client} />
                {caseStudy.industry && <Row label="Branche" value={caseStudy.industry} />}
                {caseStudy.region && <Row label="Region" value={caseStudy.region} />}
                {caseStudy.timeframe && (
                  <Row label="Zeitraum" value={caseStudy.timeframe} />
                )}
                {caseStudy.liveUrl && (
                  <Row
                    label="Live"
                    value={
                      <a
                        href={caseStudy.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-brand-soft hover:underline"
                      >
                        {caseStudy.liveUrl.replace(/^https?:\/\//, "")}
                      </a>
                    }
                  />
                )}
              </dl>
            </div>
          </Reveal>

          <Reveal as="div" delay={120} className="lg:col-span-8">
            <Block
              kicker="Ausgangslage"
              title="Wo standen wir am Anfang?"
              items={caseStudy.challenge}
            />
            <Block
              kicker="Vorgehen"
              title="Wie haben wir es angegangen?"
              items={caseStudy.approach}
              className="mt-14"
            />
            <Block
              kicker="Ergebnis"
              title="Was hat sich messbar verändert?"
              items={caseStudy.outcome}
              accent
              className="mt-14"
            />

            {caseStudy.testimonial && (
              <figure className="mt-14 rounded-2xl border border-brand/30 bg-brand/[0.04] p-6 sm:p-8">
                <span
                  aria-hidden="true"
                  className="pointer-events-none mb-3 inline-block h-px w-10 bg-gradient-to-r from-brand to-brand-soft"
                />
                <blockquote className="text-lg leading-relaxed text-foreground sm:text-xl">
                  „{caseStudy.testimonial.quote}"
                </blockquote>
                <figcaption className="mt-4 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {caseStudy.testimonial.author}
                  </span>
                  {caseStudy.testimonial.role && (
                    <span> · {caseStudy.testimonial.role}</span>
                  )}
                </figcaption>
              </figure>
            )}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-4 px-5 py-4">
      <dt className="w-28 flex-none text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

function Block({
  kicker,
  title,
  items,
  accent = false,
  className = "",
}: {
  kicker: string;
  title: string;
  items: readonly string[];
  accent?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <Kicker accent={accent ? "brand" : "foreground"}>{kicker}</Kicker>
      <h3 className="text-fluid-h3 font-bold leading-[1.2] tracking-tight text-foreground">
        {title}
      </h3>
      <ul className="mt-6 flex flex-col gap-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-base leading-relaxed text-muted-foreground"
          >
            <span className="brand-dot mt-2 flex-none" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
