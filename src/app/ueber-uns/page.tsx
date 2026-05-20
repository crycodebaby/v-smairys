import React from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Header } from '@/components/layout/Header';
import { Kicker } from '@/components/ui/Kicker';

export const metadata = {
  title: 'Über uns & Philosophie',
  description: 'Die Haltung der Smairys Netz-Manufaktur. Handwerk statt Fließband.',
};

export default function UeberUnsPage() {
  return (
    <>
      <Header />
      <Section className="bg-background min-h-screen pt-32 pb-16">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
              {/* Neutraler, maßstabsgetreuer Platzhalter für Portrait */}
              <div className="w-full max-w-[500px] aspect-[3/4] bg-muted flex flex-col items-center justify-center rounded-sm border border-border">
                <span className="text-muted-foreground font-mono text-sm tracking-widest">[Platzhalter Portrait]</span>
                <span className="text-muted-foreground font-mono text-xs mt-2">Maße: 1200x1600px (S/W)</span>
                <span className="text-muted-foreground font-mono text-xs mt-1">Alt: Robin Schmeiries - Gründer Smairys</span>
              </div>
            </div>

            <div className="flex flex-col order-1 lg:order-2">
              <Kicker>Die Philosophie</Kicker>
              <h1 className="text-fluid-h1 font-bold mt-2 leading-[1.05] tracking-tight">
                Handwerk statt Fließband.
              </h1>
              
              <div className="mt-8 space-y-6 text-fluid-p text-muted-foreground leading-relaxed">
                <p>
                  Seit 6 Jahren entwickeln wir digitale Infrastrukturen, die exakt einem Zweck dienen: Dem Aufbau sicherer, starker und messbarer Vertriebskanäle für mittelständische Unternehmen.
                </p>
                <p>
                  Unsere Philosophie ist simpel: Qualität lässt sich nicht skalieren, indem man Abstriche macht. Wir lehnen Massenproduktionen ab und konzipieren stattdessen jede Plattform wie eine maßgefertigte Architektur. 
                </p>
                <p>
                  Gegründet und geführt von Robin Schmeiries im Saarland, stehen wir als Inhaber-Agentur für persönliche Verantwortung, direkte Kommunikation und technologische Exzellenz in Next.js, SEO und B2B-Kampagnen.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-border/50">
                <div>
                  <div className="text-4xl font-bold text-foreground">6+</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider mt-2 font-medium">Jahre Expertise im Web/SEO Bereich</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-foreground">100%</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider mt-2 font-medium">Inhouse Entwicklung im Saarland</div>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </Section>
    </>
  );
}
