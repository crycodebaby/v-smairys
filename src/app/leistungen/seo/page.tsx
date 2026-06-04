import React from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Kicker } from '@/components/ui/Kicker';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { ContactFormBase } from '@/components/forms/ContactFormBase';
import { BackdropIcons } from '@/components/backdrop/BackdropIcons';
import { getPrimaryBookingTarget } from '@/config/site';

// ─── Tracking Konstante ───────────────────────────────────────────────────────
const PAGE_TYPE = 'service_seo';

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata = {
  title: 'Premium SEO | Nachhaltige Suchmaschinenoptimierung für den Mittelstand | Smairys',
  description:
    'Organisches Wachstum ohne Tricks. Wir machen Ihre Website zum wertvollsten Vertriebsmitarbeiter durch handwerklich saubere, nachhaltige Suchmaschinenoptimierung.',
};

// ─── Statische Daten (RSC) ────────────────────────────────────────────────────
const pillars = [
  {
    num: '01',
    title: 'Technische Exzellenz',
    desc: 'Core Web Vitals, saubere Crawlbarkeit, perfekte Indexierung. Unsere Next.js-Architektur ist der ideale technische SEO-Unterbau — schnell, stabil, skalierbar.',
  },
  {
    num: '02',
    title: 'Nutzerzentrierte Struktur',
    desc: 'Keyword-Cluster, Pillar-Pages und Siloing. Wir planen Ihre Inhaltsarchitektur so, dass Google und Ihre Besucher verstehen, wofür Sie die Nummer Eins sind.',
  },
  {
    num: '03',
    title: 'Nachhaltige Autorität',
    desc: 'Hochwertiger Content und qualifizierter Linkaufbau als strategischer Vermögensaufbau. Kein Spam, keine grauen Methoden. Nur Substanz, die langfristig rankt.',
  },
];

const reportingPoints = [
  {
    label: 'Keyword-Ranking-Reports',
    desc: 'Monatliche Auswertung Ihrer wichtigsten Zielkeywords — inklusive Positionsveränderungen und Suchvolumina.',
  },
  {
    label: 'Traffic-Analyse',
    desc: 'Entwicklung organischer Sitzungen, Seitenaufrufe und Verweildauer im zeitlichen Verlauf.',
  },
  {
    label: 'Conversion-Attribution',
    desc: 'Welche organischen Seiten generieren Leads? Wir verknüpfen SEO-Daten mit Ihren Formular-Conversions.',
  },
  {
    label: 'Maßnahmenplan',
    desc: 'Jeder Report endet mit einem klaren, priorisierten Maßnahmenplan für den Folgemonat. Keine Blackbox.',
  },
];

const faqs = [
  {
    q: 'Garantieren Sie Platz 1?',
    a: 'Nein. Und jede Agentur, die das tut, lügt Sie an. Google-Rankings werden von hunderten Faktoren bestimmt, die kein externer Dienstleister vollständig kontrolliert. Was wir garantieren: systematische, nachweislich saubere Maßnahmen, monatliches Reporting und kontinuierliche Optimierung auf Basis echter Daten.',
  },
  {
    q: 'Wie lange dauert es, bis SEO wirkt?',
    a: 'Erste messbare Verbesserungen sind in der Regel nach 3–6 Monaten sichtbar. Wettbewerbsstarke Keywords in gut etablierten Märkten brauchen 9–18 Monate. SEO ist ein Investitionsprozess, kein Schalter. Wer das nicht akzeptieren möchte, ist bei uns wirklich falsch.',
  },
  {
    q: 'Warum ein monatliches Budget und kein Einmalauftrag?',
    a: 'Google bewertet kontinuierlichen Aufbau. Einmalmaßnahmen verpuffen, weil Autorität, Indexierungsfrequenz und Content-Frische permanente Signale sind. Nachhaltige Ergebnisse entstehen durch monatliche, strukturierte Maßnahmen — nicht durch einen Einmal-Sprint.',
  },
  {
    q: 'Wir haben bereits eine Website — können Sie trotzdem einsteigen?',
    a: 'Ja. Wir beginnen mit einem technischen Audit Ihrer bestehenden Seite. Auf Basis der Befunde definieren wir, welche Quick-Wins möglich sind und welche strukturellen Maßnahmen langfristig priorisiert werden. Das Audit ist Teil jedes Projektstarts.',
  },
];

// ─── Page Component (RSC) ─────────────────────────────────────────────────────
export default function SEOPage() {
  const booking = getPrimaryBookingTarget();
  return (
    <>
      <Header />
      <main className="flex flex-col w-full">

        {/* ── 1. HERO ────────────────────────────────────────────────────────── */}
        <Section
          isHero
          className="relative flex items-center overflow-hidden border-b border-border bg-background pt-24 sm:pt-28 md:pt-20"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[-15%] top-1/2 hidden aspect-square w-[80vw] max-w-[900px] -translate-y-1/2 opacity-[0.04] md:right-0 md:block md:w-[65vw] md:opacity-[0.03]"
          >
            <div className="h-full w-full rounded-full border border-foreground" />
            <div className="absolute inset-[10%] rounded-full border border-foreground" />
            <div className="absolute inset-[20%] rounded-full border border-foreground" />
          </div>

          <BackdropIcons preset="generic" showFrom="sm" />

          <Container size="wide" className="relative z-10 grid items-center gap-8 md:grid-cols-12">
            <div className="flex flex-col items-start gap-6 sm:gap-8 md:col-span-9 lg:col-span-8">
              <Kicker>Premium SEO</Kicker>

              <h1 className="text-fluid-h1 font-bold leading-[1.05] tracking-tight text-foreground">
                Organisches Wachstum.{' '}
                <span className="font-light text-muted-foreground">
                  Ohne Tricks, ohne leere Versprechungen.
                </span>
              </h1>

              <p className="max-w-2xl text-fluid-p leading-relaxed text-muted-foreground">
                Wir machen Ihre Website zum wertvollsten Vertriebsmitarbeiter — durch handwerklich
                saubere, nachhaltige Suchmaschinenoptimierung, die messbar Leads generiert.
              </p>

              <Button
                variant="brand"
                size="lg"
                href={booking.href}
                external={booking.external}
                cta_id="CTA_SEO_CONSULT"
                cta_label="SEO-Audit anfordern"
                cta_position="hero_primary"
                page_type={PAGE_TYPE}
                className="w-full sm:w-auto"
              >
                SEO-Audit anfordern
              </Button>
            </div>
          </Container>
        </Section>

        {/* ── 2. DIE HARTE WAHRHEIT ──────────────────────────────────────────── */}
        <Section className="border-b border-border bg-background">
          <Container>
            <div className="grid items-center gap-10 md:gap-14 lg:grid-cols-2 lg:gap-24 xl:gap-32">

              <div className="flex flex-col gap-5 sm:gap-7">
                <Kicker>Klare Positionierung</Kicker>
                <h2 className="text-fluid-h2 font-bold leading-tight text-foreground">
                  Wer schnelle Hacks sucht, ist bei uns falsch.
                </h2>
                <div className="space-y-4 text-fluid-p leading-relaxed text-muted-foreground sm:space-y-5">
                  <p>
                    Agenturen, die Ihnen &bdquo;100 Backlinks in 30 Tagen&ldquo; oder
                    &bdquo;garantierten Platz 1&ldquo; versprechen, verkaufen Ihnen
                    Kurzfristrisiken verpackt als Chancen. Googles Algorithmen erkennen
                    und bestrafen alle grauen Methoden — und die Rechnung zahlen Sie.
                  </p>
                  <p>
                    Echte Suchmaschinenoptimierung ist ein strategischer Vermögensaufbau. Hohe Rankings für
                    lukrative Keywords sind keine Momentaufnahmen, sondern langfristige Positionsgewinne, die
                    organischen Traffic aufbauen, der Ihnen gehört — unabhängig von Ihrem Ads-Budget.
                  </p>
                </div>
              </div>

              {/* Numerische Kontrastaussage – Stat-Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:gap-6">
                {[
                  { stat: '~68 %', label: 'aller Online-Erfahrungen beginnen mit einer Suchmaschine' },
                  { stat: '< 1 %', label: 'der Nutzer klickt auf Ergebnisse auf Seite 2 von Google' },
                  { stat: '3–6 M', label: 'bis erste, messbare SEO-Wirkung einsetzt (bei sauberem Fundament)' },
                  { stat: '∞', label: 'organischer Traffic läuft weiter — auch wenn Sie Ihr Ads-Budget stoppen' },
                ].map((item) => (
                  <Card key={item.stat} className="flex flex-col gap-3 sm:gap-4">
                    <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                      {item.stat}
                    </div>
                    <div className="text-xs leading-snug text-muted-foreground sm:text-sm">
                      {item.label}
                    </div>
                  </Card>
                ))}
              </div>

            </div>
          </Container>
        </Section>

        {/* ── 3. DIE 3 SÄULEN ────────────────────────────────────────────────── */}
        <Section className="bg-background">
          <Container>
            <div className="mb-10 sm:mb-14 lg:mb-16">
              <Kicker>Unsere Methodik</Kicker>
              <h2 className="mt-4 max-w-2xl text-fluid-h2 font-bold leading-tight text-foreground">
                Drei Säulen. Ein nachhaltiges Fundament.
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3">
              {pillars.map((pillar) => (
                <Card key={pillar.num} className="flex flex-col gap-5 sm:gap-6">
                  <span className="font-mono text-3xl font-light tracking-tighter text-muted-foreground/50 sm:text-4xl">
                    {pillar.num}
                  </span>
                  <div>
                    <h3 className="mb-3 text-lg font-bold text-foreground">{pillar.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{pillar.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {/* ── 4. TRANSPARENZ & REPORTING ─────────────────────────────────────── */}
        <Section className="border-y border-border bg-background">
          <Container>
            <div className="grid items-start gap-10 md:gap-14 lg:grid-cols-2 lg:gap-24 xl:gap-32">

              <div className="flex flex-col gap-5 sm:gap-6 lg:sticky lg:top-32">
                <Kicker>Transparenz & Reporting</Kicker>
                <h2 className="text-fluid-h2 font-bold leading-tight text-foreground">
                  Sie wissen immer, was mit Ihrem Budget passiert.
                </h2>
                <p className="text-fluid-p leading-relaxed text-muted-foreground">
                  Monatliches Reporting ist kein nettes Extra — es ist Grundlage jeder seriösen SEO-Partnerschaft.
                  Wir übersetzen Daten in eindeutige, handlungsrelevante Aussagen.
                </p>
                <Button
                  variant="outline"
                  size="md"
                  href="#anfrage"
                  cta_id="CTA_SEO_REPORTING"
                  cta_label="Reporting-Ansatz ansehen"
                  cta_position="reporting_section"
                  page_type={PAGE_TYPE}
                  className="w-full sm:w-fit"
                >
                  Mehr erfahren →
                </Button>
              </div>

              <div className="flex flex-col border-t border-border">
                {reportingPoints.map((point) => (
                  <div key={point.label} className="group flex flex-col gap-2 border-b border-border/40 py-6 sm:py-8">
                    <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-brand-soft">
                      {point.label}
                    </h3>
                    <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{point.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </Container>
        </Section>

        {/* ── 5. FAQ ─────────────────────────────────────────────────────────── */}
        <Section className="bg-background">
          <Container size="tight">
            <div className="mb-10 sm:mb-14 lg:mb-16">
              <Kicker>Häufige Fragen</Kicker>
              <h2 className="mt-4 text-fluid-h2 font-bold leading-tight text-foreground">
                Direkte Antworten auf die richtigen Fragen.
              </h2>
            </div>

            <div className="flex flex-col border-t border-border">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group cursor-pointer list-none border-b border-border py-6 [&::-webkit-details-marker]:hidden sm:py-8"
                >
                  <summary className="flex select-none items-center justify-between gap-4 text-base font-semibold leading-tight text-foreground sm:gap-6 sm:text-lg md:text-xl">
                    <span>{faq.q}</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-2xl leading-none text-muted-foreground transition-transform duration-300 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-5 max-w-3xl pt-2 text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:text-base">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </Container>
        </Section>

        {/* ── 6. FINAL CTA & FORMULAR ────────────────────────────────────────── */}
        <Section id="anfrage" className="bg-foreground text-background">
          <Container>
            <div className="grid items-start gap-10 md:gap-14 lg:grid-cols-2 lg:gap-24">

              <div className="flex flex-col">
                <div className="mb-5 flex items-center gap-4 sm:mb-6">
                  <div className="h-px w-8 bg-background" />
                  <span className="text-xs font-medium uppercase tracking-widest opacity-70 sm:text-sm">
                    Jetzt anfragen
                  </span>
                </div>

                <h2 className="text-fluid-h1 font-bold leading-[1.05] tracking-tight">
                  Bereit für nachhaltigen organischen Vertrieb?
                </h2>

                <p className="mt-6 max-w-lg text-fluid-p leading-relaxed opacity-70 sm:mt-8">
                  Schildern Sie kurz Ihre aktuelle Situation. Wir führen ein kostenloses, technisches
                  SEO-Audit durch und teilen unsere ehrliche Ersteinschätzung — ohne Verkaufsdruck.
                </p>

                <ul className="mt-8 space-y-3 border-t border-background/20 pt-6 text-sm font-medium opacity-80 sm:mt-12 sm:space-y-4 sm:pt-8">
                  <li className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-sm bg-background" />
                    Technisches SEO-Audit als Projektstart inklusive
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-sm bg-background" />
                    Keine &bdquo;Platz 1&ldquo;-Versprechen — ehrliche Ersteinschätzung
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-sm bg-background" />
                    Monatliches Reporting ohne Blackbox
                  </li>
                </ul>
              </div>

              <div className="relative overflow-hidden rounded-sm bg-background p-5 text-foreground shadow-2xl sm:p-8 md:p-12">
                <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
                <h3 className="mb-2 text-2xl font-bold">SEO-Audit anfordern</h3>
                <p className="mb-6 text-sm text-muted-foreground sm:mb-8">
                  Wählen Sie <strong>„SEO"</strong> als Leistung und Ihr ungefähres Monatsbudget.
                </p>
                <ContactFormBase page_type={PAGE_TYPE} />
              </div>

            </div>
          </Container>
        </Section>

      </main>
    </>
  );
}
