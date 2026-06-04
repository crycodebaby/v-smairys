import React from 'react';
import Image from 'next/image';
import { Section } from '../ui/Section';
import { Container } from '../ui/Container';
import { Kicker } from '../ui/Kicker';
import { Reveal } from '../motion/Reveal';
import { SITE } from '@/config/site';

const OWNER_PORTRAIT_ALT = `${SITE.owner.name}, ${SITE.owner.role} der ${SITE.legalName}`;

export function TrustSection() {
  return (
    <Section className="relative bg-background border-y border-border/60 ambient-glow-amber">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">

          <Reveal as="div" className="order-2 flex flex-col gap-8 lg:order-1">
            <div>
              <Kicker accent="brand">Die Manufaktur</Kicker>
              <h2 className="mt-4 text-fluid-h2 font-bold leading-[1.15] text-foreground">
                Radikale Transparenz und handwerkliche Tiefe.
              </h2>
            </div>

            <div className="space-y-6 text-fluid-p leading-relaxed text-muted-foreground">
              <p>
                Seit 6 Jahren entwickeln wir digitale Infrastrukturen für den
                Mittelstand. Was im {SITE.address.region} mit einem klaren
                Anspruch an Code-Qualität begann, ist heute eine
                hochspezialisierte Agentur für messbaren B2B-Vertrieb.
              </p>
              <p>
                {SITE.owner.name} und das Team der Netz-Manufaktur arbeiten
                nicht mit Fließband-Lösungen. Jedes Projekt ist eine
                maßgeschneiderte Architektur, die sich an harten KPIs messen
                lassen muss. Wir versprechen keine Wunder. Wir liefern
                Systematik.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-8 border-t border-border/40 pt-6">
              <Stat value="6+" label="Jahre Erfahrung" />
              <Stat value="100 %" label="Inhabergeführt" />
            </div>
          </Reveal>

          <Reveal as="div" delay={140} className="order-1 lg:order-2">
            <div className="relative">
              {/* Brand-Glow im Hintergrund */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl"
                style={{
                  background:
                    "radial-gradient(50% 60% at 30% 20%, hsl(var(--brand-glow) / 0.20), transparent 70%)",
                  filter: "blur(40px)",
                }}
              />
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-card/40">
                <Image
                  src="/ceo-pictures/robin_smairys_portrait.webp"
                  alt={OWNER_PORTRAIT_ALT}
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover object-top"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              </div>
            </div>
          </Reveal>

        </div>
      </Container>
    </Section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="relative pl-4">
      <span
        aria-hidden="true"
        className="brand-line-vertical absolute left-0 top-1 bottom-1"
      />
      <div className="text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </div>
      <div className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
