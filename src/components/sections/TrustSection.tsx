import React from 'react';
import { Section } from '../ui/Section';
import { Container } from '../ui/Container';
import { Kicker } from '../ui/Kicker';

export function TrustSection() {
  return (
    <Section className="bg-background border-y border-border">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col gap-8 order-2 lg:order-1">
            <div>
              <Kicker>Die Manufaktur</Kicker>
              <h2 className="text-fluid-h2 font-bold text-foreground mt-4 leading-[1.15]">
                Radikale Transparenz und handwerkliche Tiefe.
              </h2>
            </div>
            
            <div className="space-y-6 text-fluid-p text-muted-foreground leading-relaxed">
              <p>
                Seit 6 Jahren entwickeln wir digitale Infrastrukturen für den Mittelstand. Was im Saarland mit einem klaren Anspruch an Code-Qualität begann, ist heute eine hochspezialisierte Agentur für messbaren B2B-Vertrieb.
              </p>
              <p>
                Robin Schmeiries und das Team der Netz-Manufaktur arbeiten nicht mit Fließband-Lösungen. Jedes Projekt ist eine maßgeschneiderte Architektur, die sich an harten KPIs messen lassen muss. Wir versprechen keine Wunder. Wir liefern Systematik.
              </p>
            </div>

            <div className="flex gap-12 pt-6 border-t border-border/40 mt-4">
              <div>
                <div className="text-3xl font-bold text-foreground">6+</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Jahre Erfahrung</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">100%</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Inhabergeführt</div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            {/* Neutraler Placeholder für Robin Schmeiries wie gefordert */}
            <div className="w-full aspect-[4/5] bg-muted flex flex-col items-center justify-center rounded-sm border border-border">
              <span className="text-muted-foreground font-mono text-sm tracking-widest">[Platzhalter Profilbild]</span>
              <span className="text-muted-foreground font-mono text-xs mt-2">Maße: 800x1000px</span>
              <span className="text-muted-foreground font-mono text-xs mt-1">Alt: Robin Schmeiries - Gründer Smairys</span>
            </div>
          </div>

        </div>
      </Container>
    </Section>
  );
}
