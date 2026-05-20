import React from 'react';
import { Section } from '../ui/Section';
import { Container } from '../ui/Container';
import { Kicker } from '../ui/Kicker';
import { ContactFormBase } from '../forms/ContactFormBase';

export function CtaSection() {
  return (
    <Section id="kontakt" className="bg-foreground text-background">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-8 bg-background" />
              <span className="text-sm uppercase tracking-widest font-medium text-background">
                Initiative Ergreifen
              </span>
            </div>
            
            <h2 className="text-fluid-h1 font-bold mt-2 leading-[1.05] tracking-tight">
              Ihre digitale Infrastruktur. Auf höchstem Niveau.
            </h2>
            
            <p className="mt-8 text-fluid-p opacity-80 leading-relaxed max-w-lg">
              Füllen Sie das Formular aus, um eine unverbindliche Projektbewertung zu erhalten. Wir prüfen Ihre Anfrage und melden uns innerhalb von 24 Stunden mit einer Ersteinschätzung.
            </p>
            
            {/* Trust Badges Minimal */}
            <div className="mt-16 pt-8 border-t border-background/20 hidden md:block">
              <p className="text-sm uppercase tracking-widest opacity-60 mb-6 font-medium">Unsere Standards</p>
              <ul className="space-y-4 font-medium opacity-90">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-background rounded-sm" /> Strenges NDA auf Anfrage
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-background rounded-sm" /> 100% DSGVO & TTDSG konform
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-background rounded-sm" /> Kein Outsourcing. Inhouse Code.
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-background text-foreground p-8 md:p-12 rounded-sm shadow-2xl">
            <h3 className="text-2xl font-bold mb-8">Projektanfrage starten</h3>
            <ContactFormBase page_type="homepage_invert_cta" />
          </div>

        </div>
      </Container>
    </Section>
  );
}
