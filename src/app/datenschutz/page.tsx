import React from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Header } from '@/components/layout/Header';
import { Kicker } from '@/components/ui/Kicker';
import { SITE } from '@/config/site';

export const metadata = {
  title: 'Datenschutzerklärung',
};

export default function DatenschutzPage() {
  return (
    <>
      <Header />
      <Section variant="page-header" className="bg-background pb-16">
        <Container className="max-w-3xl">
          <Kicker accent="brand">Rechtliches</Kicker>
          <h1 className="text-fluid-h1 font-bold leading-[1.05] tracking-tight">Datenschutzerklärung</h1>

          <div className="prose prose-invert prose-neutral mt-12 max-w-none space-y-8 leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-foreground text-xl font-bold mb-4">1. Datenschutz auf einen Blick</h2>
            <p>
              Diese Datenschutzerklärung informiert Sie über die Verarbeitung personenbezogener Daten
              beim Besuch unserer Website. Verantwortlich für die Verarbeitung ist die {SITE.legalName},
              vertreten durch {SITE.owner.name}, {SITE.address.street}, {SITE.address.postalCode}{' '}
              {SITE.address.city}.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-xl font-bold mb-4">2. Allgemeine Hinweise und Pflichtinformationen</h2>
            <p>
              Verantwortlicher gemäß Art. 4 Abs. 7 DSGVO ist:
            </p>
            <address className="not-italic mt-3 text-foreground">
              {SITE.legalName}<br />
              {SITE.owner.name}<br />
              {SITE.address.street}<br />
              {SITE.address.postalCode} {SITE.address.city}<br />
              E-Mail: <a href={SITE.email.mailto} className="text-foreground hover:text-brand-soft hover:underline">{SITE.email.display}</a><br />
              Telefon: <a href={SITE.phone.tel} className="text-foreground hover:text-brand-soft hover:underline">{SITE.phone.display}</a>
            </address>
          </section>

          <section>
            <h2 className="text-foreground text-xl font-bold mb-4">3. Datenerfassung auf dieser Website (Tracking, Analytics)</h2>
            <p>
              Für die Auswertung unserer Marketing-, Such- und Print-Kampagnen
              setzen wir eine bewusst cookielose, privatsphärefreundliche
              Analyse-Lösung ein. Es findet weder ein Cross-Site-Tracking
              statt, noch werden personenbezogene Profile aufgebaut.
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
              Sie haben jederzeit das Recht auf Auskunft über die zu Ihrer Person gespeicherten
              Daten (Art. 15 DSGVO), auf Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO),
              Einschränkung der Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO)
              sowie ein Widerspruchsrecht (Art. 21 DSGVO). Bitte richten Sie Anfragen an{' '}
              <a href={SITE.email.mailto} className="text-foreground hover:text-brand-soft hover:underline">{SITE.email.display}</a>.
            </p>
            <p className="mt-4">
              Daneben steht Ihnen ein Beschwerderecht bei der zuständigen Datenschutz-Aufsichtsbehörde
              zu (Art. 77 DSGVO).
            </p>
          </section>
        </div>
        </Container>
      </Section>
    </>
  );
}
