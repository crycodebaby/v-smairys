import React from 'react';
import { Section } from '../ui/Section';
import { Container } from '../ui/Container';
import { Kicker } from '../ui/Kicker';

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
    <Section className="bg-background">
      <Container>
        <div className="flex flex-col md:flex-row gap-16 lg:gap-32">
          
          <div className="md:w-1/3">
            <div className="sticky top-32">
              <Kicker>Die Systematik</Kicker>
              <h2 className="text-fluid-h2 font-bold text-foreground mt-4 mb-6 leading-tight">
                Ein Prozess, der Fehler eliminiert.
              </h2>
              <p className="text-muted-foreground text-fluid-p leading-relaxed">
                Reibungslose Umsetzung durch vordefinierte Architektur-Blueprints. Wir arbeiten phasengesteuert und datengetrieben.
              </p>
            </div>
          </div>

          <div className="md:w-2/3">
            <div className="flex flex-col border-t border-border">
              {steps.map((step, index) => (
                <div key={step.num} className="flex gap-6 md:gap-12 py-12 border-b border-border group">
                  <div className="text-3xl md:text-5xl font-mono text-muted-foreground font-light tracking-tighter w-12 shrink-0 group-hover:text-foreground transition-colors">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed max-w-xl">{step.desc}</p>
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
