import React from "react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Kicker";
import { Reveal } from "@/components/motion/Reveal";
import { ClientLogoStrip } from "./ClientLogoStrip";

type SocialProofSectionProps = {
  /** Kicker-Text über der Headline. */
  kicker?: string;
  /** Headline. */
  title?: string;
  /** Sub-Text rechts neben der Headline. */
  description?: string;
  /** Optional: Link auf die Projekte-Übersicht. */
  ctaHref?: string;
  ctaLabel?: string;
  className?: string;
};

/**
 * Wiederverwendbare Social-Proof-Sektion.
 *
 * Layout-Idee:
 *  - Header links (Kicker + Headline + Beschreibung)
 *  - Logo-Grid rechts
 *  - Auf Mobile gestackt
 *
 * Bewusst keine Sterne-Bewertungen oder Karussell – nur eine ruhige Reihe
 * Kundenlogos in Glas-Tiles. Brand-Akzent ist die Kicker-Linie.
 */
export function SocialProofSection({
  kicker = "Ausgewählte Kunden",
  title = "Mittelständische Marken vertrauen uns ihre digitalen Vertriebsfundamente an.",
  description = "Eine Auswahl von Auftraggebern aus dem Saarland und Bayern – vom regionalen Stahlhandel bis hin zu spezialisierten Dienstleistern.",
  ctaHref = "/projekte",
  ctaLabel = "Alle Case Studies ansehen",
  className = "",
}: SocialProofSectionProps) {
  return (
    <Section className={`bg-background border-y border-border/60 ${className}`}>
      <Container>
        <div className="grid items-start gap-10 md:grid-cols-12 md:gap-12">
          <Reveal as="div" className="md:col-span-5">
            <Kicker accent="brand">{kicker}</Kicker>
            <h2 className="text-fluid-h3 font-bold leading-[1.2] tracking-tight text-foreground">
              {title}
            </h2>
            {description && (
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
            {ctaHref && (
              <Link
                href={ctaHref}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground/85 underline-offset-4 transition-colors hover:text-brand-soft hover:underline"
              >
                {ctaLabel}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            )}
          </Reveal>

          <div className="md:col-span-7">
            <ClientLogoStrip surface="dark" height={44} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
