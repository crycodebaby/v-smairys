import React from 'react';
import { Section } from '../ui/Section';
import { Container } from '../ui/Container';
import { Kicker } from '../ui/Kicker';
import { BackdropIcons } from '../backdrop/BackdropIcons';

export function ProcessSection() {
  const steps = [
    {
      num: '01',
      title: 'Analyse & Strategie',
      desc: 'Audit bestehender Systeme. Definition der Ziel-KPIs und Architekturplanung. Nichts bleibt dem Zufall überlassen.'
    },
    {
      num: '02',
      title: 'Technische Implementierung',
      desc: 'Entwicklung des Next.js Frontends und strikte Einrichtung passwortfreier, consent-gesteuerter Tracking-Fundamente.'
    },
    {
      num: '03',
      title: 'Content & SEO Seeding',
      desc: 'Integration von suchmaschinenoptimiertem Pillar-Content. Aufbau der indexierbaren URL-Struktur für organische Dominanz.'
    },
    {
      num: '04',
      title: 'Skalierung (Google Ads)',
      desc: 'Launch der datengetriebenen Suchnetzwerk-Kampagnen. Kontinuierliche Optimierung auf harten ROAS (Return on Ad Spend).'
    }
  ];

  return (
    <Section className="relative overflow-hidden bg-background">
      {/* Tiefenschärfe: Programmier-Icons hinter dem Prozess-Layout */}
      <BackdropIcons preset="tech" showFrom="md" />

      <Container className="relative z-10">
        {/*
         * Auf Mobile/Tablet stapelt sich die Sektion vertikal mit komfortablem
         * Abstand. Ab `lg` öffnet sich das klassische Sticky-Sidebar-Layout.
         */}
        <div className="flex flex-col gap-10 md:gap-14 lg:flex-row lg:gap-24 xl:gap-32">

          <div className="lg:w-1/3">
            <div className="lg:sticky lg:top-32">
              <Kicker accent="brand">Die Systematik</Kicker>
              <h2 className="mb-4 mt-4 text-fluid-h2 font-bold leading-tight text-foreground sm:mb-6">
                Ein Prozess, der Fehler eliminiert.
              </h2>
              <p className="text-fluid-p leading-relaxed text-muted-foreground">
                Reibungslose Umsetzung durch vordefinierte Architektur-Blueprints. Wir arbeiten phasengesteuert und datengetrieben.
              </p>
            </div>
          </div>

          <div className="lg:w-2/3">
            <div className="flex flex-col border-t border-border/60">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="group relative flex gap-4 border-b border-border/60 py-8 sm:gap-6 sm:py-10 md:gap-12 md:py-12"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-8 left-0 w-px bg-gradient-to-b from-brand/0 via-brand/0 to-brand/0 transition-colors duration-500 group-hover:via-brand/50 sm:inset-y-10 md:inset-y-12"
                  />
                  <div className="w-10 shrink-0 font-mono text-2xl font-light tracking-tighter text-muted-foreground transition-colors group-hover:text-brand-soft sm:w-12 sm:text-3xl md:text-5xl">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-foreground sm:mb-3 sm:text-xl md:text-2xl">
                      {step.title}
                    </h3>
                    <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </Container>
    </Section>
  );
}
