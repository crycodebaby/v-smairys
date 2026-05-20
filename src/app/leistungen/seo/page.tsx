import React from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Kicker } from '@/components/ui/Kicker';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { ContactFormBase } from '@/components/forms/ContactFormBase';

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
  return (
    <>
      <Header />
      <main className="flex flex-col w-full">

        {/* ── 1. HERO ────────────────────────────────────────────────────────── */}
        <Section
          isHero
          className="relative bg-background border-b border-border flex items-center overflow-hidden"
        >
          {/* CSS-only Ringe-Akzent (technische Kontinuität zu Webseiten-Seite) */}
          <div
            aria-hidden="true"
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[65vw] max-w-[900px] aspect-square opacity-[0.03] pointer-events-none"
          >
            <div className="w-full h-full border border-foreground rounded-full" />
            <div className="absolute inset-[10%] border border-foreground rounded-full" />
            <div className="absolute inset-[20%] border border-foreground rounded-full" />
          </div>

          <Container className="relative z-10 grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-9 lg:col-span-8 flex flex-col items-start gap-8">
              <Kicker>Premium SEO</Kicker>

              <h1 className="text-fluid-h1 font-bold leading-[1.05] tracking-tight text-foreground">
                Organisches Wachstum.{' '}
                <span className="text-muted-foreground font-light">
                  Ohne Tricks, ohne leere Versprechungen.
                </span>
              </h1>

              <p className="text-fluid-p text-muted-foreground leading-relaxed max-w-2xl">
                Wir machen Ihre Website zum wertvollsten Vertriebsmitarbeiter — durch handwerklich
                saubere, nachhaltige Suchmaschinenoptimierung, die messbar Leads generiert.
              </p>

              <Button
                variant="primary"
                size="lg"
                cta_id="CTA_SEO_CONSULT"
                cta_label="SEO-Audit anfordern"
                cta_position="hero_primary"
                page_type={PAGE_TYPE}
              >
                SEO-Audit anfordern
              </Button>
            </div>
          </Container>
        </Section>

        {/* ── 2. DIE HARTE WAHRHEIT ──────────────────────────────────────────── */}
        <Section className="bg-background border-b border-border">
          <Container>
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">

              <div className="flex flex-col gap-8">
                <Kicker>Klare Positionierung</Kicker>
                <h2 className="text-fluid-h2 font-bold leading-tight text-foreground">
                  Wer schnelle Hacks sucht, ist bei uns falsch.
                </h2>
                <div className="space-y-5 text-fluid-p text-muted-foreground leading-relaxed">
                  <p>
                    Agenturen, die Ihnen "100 Backlinks in 30 Tagen" oder "garantierten Platz 1" versprechen,
                    verkaufen Ihnen Kurzfristrisiken verpackt als Chancen. Googles Algorithmen erkennen
                    und bestrafen alle grauen Methoden — und die Rechnung zahlen Sie.
                  </p>
                  <p>
                    Echte Suchmaschinenoptimierung ist ein strategischer Vermögensaufbau. Hohe Rankings für
                    lukrative Keywords sind keine Momentaufnahmen, sondern langfristige Positionsgewinne, die
                    organischen Traffic aufbauen, der Ihnen gehört — unabhängig von Ihrem Ads-Budget.
                  </p>
                </div>
              </div>

              {/* Numerische Kontrastaussage */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { stat: '~68 %', label: 'aller Online-Erfahrungen beginnen mit einer Suchmaschine' },
                  { stat: '< 1 %', label: 'der Nutzer klickt auf Ergebnisse auf Seite 2 von Google' },
                  { stat: '3–6 M', label: 'bis erste, messbare SEO-Wirkung einsetzt (bei sauberem Fundament)' },
                  { stat: '∞', label: 'organischer Traffic läuft weiter — auch wenn Sie Ihr Ads-Budget stoppen' },
                ].map((item) => (
                  <Card key={item.stat} className="flex flex-col gap-4">
                    <div className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{item.stat}</div>
                    <div className="text-sm text-muted-foreground leading-snug">{item.label}</div>
                  </Card>
                ))}
              </div>

            </div>
          </Container>
        </Section>

        {/* ── 3. DIE 3 SÄULEN ────────────────────────────────────────────────── */}
        <Section className="bg-background">
          <Container>
            <div className="mb-16">
              <Kicker>Unsere Methodik</Kicker>
              <h2 className="text-fluid-h2 font-bold mt-4 leading-tight text-foreground max-w-2xl">
                Drei Säulen. Ein nachhaltiges Fundament.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pillars.map((pillar) => (
                <Card key={pillar.num} className="flex flex-col gap-6">
                  <span className="font-mono text-4xl font-light text-muted-foreground/50 tracking-tighter">
                    {pillar.num}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-3">{pillar.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {/* ── 4. TRANSPARENZ & REPORTING ─────────────────────────────────────── */}
        <Section className="bg-background border-y border-border">
          <Container>
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">

              <div className="lg:sticky lg:top-32 flex flex-col gap-6">
                <Kicker>Transparenz & Reporting</Kicker>
                <h2 className="text-fluid-h2 font-bold leading-tight text-foreground">
                  Sie wissen immer, was mit Ihrem Budget passiert.
                </h2>
                <p className="text-fluid-p text-muted-foreground leading-relaxed">
                  Monatliches Reporting ist kein nettes Extra — es ist Grundlage jeder seriösen SEO-Partnerschaft.
                  Wir übersetzen Daten in eindeutige, handlungsrelevante Aussagen.
                </p>
                <Button
                  variant="outline"
                  size="md"
                  cta_id="CTA_SEO_REPORTING"
                  cta_label="Reporting-Ansatz ansehen"
                  cta_position="reporting_section"
                  page_type={PAGE_TYPE}
                  className="w-fit"
                >
                  Mehr erfahren →
                </Button>
              </div>

              <div className="flex flex-col border-t border-border">
                {reportingPoints.map((point) => (
                  <div key={point.label} className="flex flex-col gap-2 py-8 border-b border-border/40 group">
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {point.label}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-md">{point.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </Container>
        </Section>

        {/* ── 5. FAQ ─────────────────────────────────────────────────────────── */}
        <Section className="bg-background">
          <Container className="max-w-4xl">
            <div className="mb-16">
              <Kicker>Häufige Fragen</Kicker>
              <h2 className="text-fluid-h2 font-bold mt-4 leading-tight text-foreground">
                Direkte Antworten auf die richtigen Fragen.
              </h2>
            </div>

            <div className="flex flex-col border-t border-border">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group border-b border-border py-8 cursor-pointer list-none [&::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between gap-6 text-foreground font-semibold text-lg md:text-xl leading-tight select-none">
                    <span>{faq.q}</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45 text-2xl leading-none"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-6 text-muted-foreground leading-relaxed max-w-3xl pt-2">
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
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

              <div className="flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-[1px] w-8 bg-background" />
                  <span className="text-sm uppercase tracking-widest font-medium opacity-70">
                    Jetzt anfragen
                  </span>
                </div>

                <h2 className="text-fluid-h1 font-bold leading-[1.05] tracking-tight">
                  Bereit für nachhaltigen organischen Vertrieb?
                </h2>

                <p className="mt-8 text-fluid-p opacity-70 leading-relaxed max-w-lg">
                  Schildern Sie kurz Ihre aktuelle Situation. Wir führen ein kostenloses, technisches
                  SEO-Audit durch und teilen unsere ehrliche Ersteinschätzung — ohne Verkaufsdruck.
                </p>

                <ul className="mt-12 pt-8 border-t border-background/20 space-y-4 text-sm font-medium opacity-80">
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-background rounded-sm shrink-0" />
                    Technisches SEO-Audit als Projektstart inklusive
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-background rounded-sm shrink-0" />
                    Keine "Platz 1"-Versprechen — ehrliche Ersteinschätzung
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-background rounded-sm shrink-0" />
                    Monatliches Reporting ohne Blackbox
                  </li>
                </ul>
              </div>

              <div className="bg-background text-foreground p-8 md:p-12 rounded-sm shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
                <h3 className="text-2xl font-bold mb-2">SEO-Audit anfordern</h3>
                <p className="text-sm text-muted-foreground mb-8">
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
