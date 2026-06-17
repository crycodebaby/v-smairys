import React from "react";
import Image from "next/image";
import { Section } from "../ui/Section";
import { Container } from "../ui/Container";
import { Kicker } from "../ui/Kicker";
import { Reveal } from "../motion/Reveal";
import { SITE } from "@/config/site";

const TEAM_PHOTO_ALT = `Das Team der ${SITE.legalName}: Kundendienst, Geschäftsführer ${SITE.owner.name} (Mitte) und zwei Entwickler.`;

const ROLES: { label: string; description: string }[] = [
  { label: "Kundendienst", description: "Direkter Draht, schnelle Antworten." },
  { label: "Geschäftsführung", description: `${SITE.owner.name}, persönlich erreichbar.` },
  { label: "Entwicklung", description: "Sauberer Code, messbare Ergebnisse." },
];

/**
 * Team-/CEO-Sektion der Startseite.
 *
 * Zweck: die Website menschlicher und vertrauenswürdiger machen – echtes
 * Gruppenfoto statt gesichtsloser Stockoptik. Ergänzt das bestehende
 * Einzelporträt von Robin in der `TrustSection` (ersetzt es nicht).
 */
export function TeamSection() {
  return (
    <Section className="relative overflow-hidden border-b border-border/60 bg-background ambient-glow-amber">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <Reveal as="div" className="order-2 flex flex-col gap-8 lg:order-1">
            <div>
              <Kicker accent="brand">Die Menschen dahinter</Kicker>
              <h2 className="mt-4 text-fluid-h2 font-bold leading-[1.15] text-foreground">
                Nicht anonym. Persönlich erreichbar. Technisch stark.
              </h2>
              <p className="mt-5 max-w-md text-fluid-p leading-relaxed text-muted-foreground">
                Hinter Smairys steht ein festes Team – kein Callcenter, keine
                wechselnden Freelancer. Sie wissen jederzeit, wer an Ihrem
                Projekt arbeitet und wen Sie anrufen.
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-3 lg:gap-5">
              {ROLES.map((role) => (
                <li key={role.label} className="relative pl-4">
                  <span
                    aria-hidden="true"
                    className="brand-line-vertical absolute left-0 top-1 bottom-1"
                  />
                  <p className="text-sm font-semibold tracking-tight text-foreground">
                    {role.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {role.description}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal as="figure" delay={140} className="order-1 lg:order-2">
            <div className="relative">
              {/* Warmer Brand-Glow hinter der Bildkarte */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem]"
                style={{
                  background:
                    "radial-gradient(55% 55% at 50% 25%, hsl(var(--brand-glow) / 0.18), transparent 70%)",
                  filter: "blur(48px)",
                }}
              />
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-border bg-card/40 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.65)]">
                <Image
                  src="/ceo-pictures/ceo-team-grou-photo-3persons.webp"
                  alt={TEAM_PHOTO_ALT}
                  fill
                  sizes="(min-width: 1024px) 48vw, 92vw"
                  className="object-cover object-center"
                />
                {/* dezenter Glas-Spitzlicht-Rand */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
                />
                {/* feine Brand-Kante unten */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/55 to-transparent"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
