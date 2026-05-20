import React from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';

export const metadata = {
  title: 'Impressum',
};

export default function ImpressumPage() {
  return (
    <Section className="bg-background min-h-screen pt-32 pb-16">
      <Container className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-12">Impressum</h1>
        
        <div className="prose prose-invert prose-neutral max-w-none text-muted-foreground space-y-8 leading-relaxed">
          <section>
            <h2 className="text-foreground text-xl font-bold mb-4">Verantwortlich für den Inhalt</h2>
            <p>
              [PLATZHALTER: FINALE RECHTSTEXTE WERDEN HIER EINGEFÜGT]
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-xl font-bold mb-4">Kontakt</h2>
            <p>
              [PLATZHALTER: FINALE RECHTSTEXTE WERDEN HIER EINGEFÜGT]
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-xl font-bold mb-4">Umsatzsteuer-ID</h2>
            <p>
              [PLATZHALTER: FINALE RECHTSTEXTE WERDEN HIER EINGEFÜGT]
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-xl font-bold mb-4">Streitschlichtung</h2>
            <p>
              [PLATZHALTER: FINALE RECHTSTEXTE WERDEN HIER EINGEFÜGT]
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
