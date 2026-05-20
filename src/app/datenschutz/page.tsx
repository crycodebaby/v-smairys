import React from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';

export const metadata = {
  title: 'Datenschutzerklärung',
};

export default function DatenschutzPage() {
  return (
    <Section className="bg-background min-h-screen pt-32 pb-16">
      <Container className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-12">Datenschutzerklärung</h1>
        
        <div className="prose prose-invert prose-neutral max-w-none text-muted-foreground space-y-8 leading-relaxed">
          <section>
            <h2 className="text-foreground text-xl font-bold mb-4">1. Datenschutz auf einen Blick</h2>
            <p>
              [PLATZHALTER: FINALE RECHTSTEXTE WERDEN HIER EINGEFÜGT]
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-xl font-bold mb-4">2. Allgemeine Hinweise und Pflichtinformationen</h2>
            <p>
              [PLATZHALTER: FINALE RECHTSTEXTE WERDEN HIER EINGEFÜGT]
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-xl font-bold mb-4">3. Datenerfassung auf dieser Website (Tracking, Analytics)</h2>
            <p>
              [PLATZHALTER: FINALE RECHTSTEXTE WERDEN HIER EINGEFÜGT]
            </p>

            <h3 className="text-foreground text-lg font-semibold mt-8 mb-3">3.1 Plausible Analytics</h3>
            <p>
              Wir nutzen <strong>Plausible Analytics</strong> zur anonymisierten, privatsphärefreundlichen
              Auswertung der Nutzung unserer Website. Plausible setzt keine Cookies und legt keine
              individuellen Nutzerprofile an. Es findet kein geräte- oder seitenübergreifendes
              Wiedererkennen einzelner Besucherinnen und Besucher statt.
            </p>
            <p className="mt-4">
              Erhoben werden ausschließlich aggregierte, nicht-personenbezogene Nutzungsdaten – darunter
              insbesondere die aufgerufene Seite, das Herkunftsland (auf Länderebene), die Art des
              verwendeten Endgeräts und des Browsers sowie die ungefähre Verweildauer. IP-Adressen
              werden nicht gespeichert; sie dienen Plausible ausschließlich kurzzeitig zur technischen
              Verarbeitung und werden nicht zur Identifikation einzelner Personen verwendet.
            </p>
            <p className="mt-4">
              Zweck der Verarbeitung ist die kontinuierliche Verbesserung unserer Website, die
              Auswertung von Marketing- und Print-Kampagnen sowie die technische Optimierung der
              Auslieferung. Ergänzend erheben wir intern aggregierte Klick-Ereignisse auf zentralen
              Schaltflächen und Kontaktelementen (z. B. Telefon-, E-Mail- und Terminbuchungs-Links),
              um Nutzungsverhalten in Summe zu verstehen – ebenfalls ohne Personenbezug und ohne
              Cookies.
            </p>
            <p className="mt-4">
              Weiterführende Informationen zu Plausible finden Sie unter{" "}
              <a
                href="https://plausible.io/data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                plausible.io/data-policy
              </a>
              .
            </p>
          </section>
          
          <section>
            <h2 className="text-foreground text-xl font-bold mb-4">4. Ihre Rechte</h2>
            <p>
              [PLATZHALTER: FINALE RECHTSTEXTE WERDEN HIER EINGEFÜGT]
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
