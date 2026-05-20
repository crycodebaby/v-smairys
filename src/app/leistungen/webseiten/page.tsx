import React from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Kicker } from '@/components/ui/Kicker';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { ContactFormBase } from '@/components/forms/ContactFormBase';

// ─── Tracking Konstante (zentral für diese Seite) ────────────────────────────
const PAGE_TYPE = 'service_web';

// ─── Metadata ────────────────────────────────────────────────────────────────
export const metadata = {
  title: 'Next.js Webseiten & digitale Infrastruktur | Smairys Netz-Manufaktur',
  description:
    'Maßgeschneiderte, sichere und vollständig betreute digitale Infrastrukturen für mittelständische Unternehmen. Kein Baukasten. Echter Code. Echter Support.',
};

// ─── Statische Daten (kein Runtime-State nötig → RSC) ────────────────────────
const pillars = [
  {
    num: '01',
    title: 'Maßgeschneiderter Code',
    desc: 'Jede Zeile Code wurde für Ihr Unternehmen geschrieben. Keine generischen Themes, keine Kompromisse bei Performance oder Sicherheit.',
  },
  {
    num: '02',
    title: 'Premium-Hosting & Domain',
    desc: 'Managed Hosting auf europäischen Servern mit SLA, Uptime-Monitoring und automatischen HTTPS-Zertifikaten inklusive.',
  },
  {
    num: '03',
    title: 'E-Mail-Infrastruktur',
    desc: 'Professionelle E-Mail-Adressen auf Ihrer Domain. Setup, DNS-Konfiguration und Spam-Schutz (SPF, DKIM, DMARC) komplett von uns.',
  },
  {
    num: '04',
    title: 'Laufende Betreuung',
    desc: 'Nicht nur der Launch zählt. Monatliche Updates, Security-Patches und Performance-Monitoring halten Ihre Infrastruktur auf dem Stand der Technik.',
  },
];

const comparisons = [
  {
    label: 'Ladezeit',
    craft: '< 1 Sekunde (Core Web Vitals: A)',
    mass: '3–8 Sekunden (Plugin-Last)',
  },
  {
    label: 'Sicherheit',
    craft: 'Kein CMS-Admin, kein angreifbares Plugin-System',
    mass: 'WordPress: ~90 % aller gehackten Sites',
  },
  {
    label: 'SEO-Fundament',
    craft: 'Server-Side Rendering, saubere Markup-Struktur',
    mass: 'Automatisch generierter, aufgeblähter HTML-Code',
  },
  {
    label: 'Skalierbarkeit',
    craft: 'Edge Deployment, API-fähig, CMS-erweiterbar',
    mass: 'Monolithische Serverarchitektur',
  },
];

const faqs = [
  {
    q: 'Warum kein Baukasten (Wix, Squarespace)?',
    a: 'Baukästen sind für Hobbyprojekte designed, nicht für professionellen Vertrieb. Generierter Code, unflexible Vorlagen und geteilte Server-Infrastruktur erzeugen schlechte Core Web Vitals – und schlechte Vitals bedeuten schlechtere Google-Rankings und höhere Ads-Kosten.',
  },
  {
    q: 'Warum ist Hosting inklusive?',
    a: 'Performance und Sicherheit lassen sich nicht trennen. Wir steuern Environment-Variablen, Deploy-Strategien und Edge-Konfiguration direkt. Kein Drittanbieter kann unsere Architekturen unterlaufen.',
  },
  {
    q: 'Ab welchem Budget arbeiten wir zusammen?',
    a: 'Einstiegsprojekte beginnen bei 3.000 €. Das umfasst Design-Konzept, vollständige Implementierung, Hosting-Setup und einen Monat Betreuung. Für komplexe Infrastrukturen (Multi-Page, CMS-Anbindung, Analytics) klären wir den genauen Scope im Erstgespräch.',
  },
  {
    q: 'Wie lange dauert die Umsetzung?',
    a: 'Zwischen Briefing und Go-Live planen wir in der Regel 4–8 Wochen. Der exakte Zeitplan hängt vom Scope und Ihrer Reaktionszeit bei Freigaben ab. Kein Projekt startet ohne klares Timing-Commitment von beiden Seiten.',
  },
];

// ─── Page Component (RSC) ─────────────────────────────────────────────────────
export default function WebseitenPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col w-full">

        {/* ── 1. HERO ────────────────────────────────────────────────────────── */}
        <Section
          isHero
          className="relative bg-background border-b border-border flex items-center overflow-hidden"
        >
          {/*
            3D-MARKENREGEL: Wenn ThreeLogoWrapper hier genutzt wird, dann ausschließlich
            mit opacity-5 + pointer-events-none als Hintergrund-Akzent.
            Derzeit statische Geometrie gemäß Markenregel (kein visueller Eingriff in Text).
          */}
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
              <Kicker>Next.js Webentwicklung</Kicker>

              <h1 className="text-fluid-h1 font-bold leading-[1.05] tracking-tight text-foreground">
                Ihre digitale Infrastruktur.{' '}
                <span className="text-muted-foreground font-light">
                  Handgebaut, sicher und vollständig betreut.
                </span>
              </h1>

              <p className="text-fluid-p text-muted-foreground leading-relaxed max-w-2xl">
                Wir liefern keine „schönen Webseiten" — wir entwickeln vollständige digitale
                Infrastrukturen. Code, Hosting, E-Mail, Wartung. Alles aus einer Hand. Alles auf
                technisch höchstem Niveau.
              </p>

              <Button
                variant="primary"
                size="lg"
                cta_id="CTA_WEB_CONSULT"
                cta_label="Projektanfrage starten"
                cta_position="hero_primary"
                page_type={PAGE_TYPE}
              >
                Projektanfrage starten
              </Button>
            </div>
          </Container>
        </Section>

        {/* ── 2. RUNDUM-SORGLOS PARADIGMA ────────────────────────────────────── */}
        <Section className="bg-background">
          <Container>
            <div className="mb-16">
              <Kicker>Das Rundum-Sorglos-Paradigma</Kicker>
              <h2 className="text-fluid-h2 font-bold mt-4 leading-tight text-foreground max-w-2xl">
                Vier Säulen. Eine Verantwortung.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* ── 3. HANDWERK vs. MASSENWARE ─────────────────────────────────────── */}
        <Section className="bg-background border-y border-border">
          <Container>
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">

              {/* Linke Spalte: Intro */}
              <div className="lg:sticky lg:top-32 flex flex-col gap-6">
                <Kicker>Handwerk vs. Massenware</Kicker>
                <h2 className="text-fluid-h2 font-bold leading-tight text-foreground">
                  Warum echter Code den Unterschied macht.
                </h2>
                <p className="text-fluid-p text-muted-foreground leading-relaxed">
                  WordPress und Wix lösen ein Problem — für Hobbyprojekte. Für professionellen B2B-Vertrieb
                  sind sie strukturelle Handicaps: langsam, angreifbar und schwer skalierbar.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Unsere Next.js-Architektur rendert Seiten auf Edge-Servern in unter einer Sekunde,
                  besitzt keine angreifbare Admin-Oberfläche und wächst nahtlos mit Ihrem Unternehmen.
                  Das ist kein Marketing-Versprechen — das sind messbare, technische Fakten.
                </p>
              </div>

              {/* Rechte Spalte: Vergleichs-Tabelle */}
              <div className="border-t border-border">
                {/* Header Row */}
                <div className="grid grid-cols-3 gap-4 py-4 border-b border-border/40">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium">Kriterium</div>
                  <div className="text-xs uppercase tracking-widest text-foreground font-medium">Smairys Code</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium">Baukästen</div>
                </div>

                {comparisons.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-3 gap-4 py-5 border-b border-border/30 items-start group"
                  >
                    <div className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                      {row.label}
                    </div>
                    <div className="text-sm text-foreground leading-snug">{row.craft}</div>
                    <div className="text-sm text-muted-foreground/60 leading-snug line-through decoration-muted-foreground/30">
                      {row.mass}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* ── 4. FAQ ─────────────────────────────────────────────────────────── */}
        <Section className="bg-background">
          <Container className="max-w-4xl">
            <div className="mb-16">
              <Kicker>Häufige Fragen</Kicker>
              <h2 className="text-fluid-h2 font-bold mt-4 leading-tight text-foreground">
                Klare Antworten auf harte Einwände.
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

        {/* ── 5. FINAL CTA & FORMULAR ────────────────────────────────────────── */}
        <Section id="anfrage" className="bg-foreground text-background">
          <Container>
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

              <div className="flex flex-col">
                {/* Inline Kicker (Off-White Variante) */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-[1px] w-8 bg-background" />
                  <span className="text-sm uppercase tracking-widest font-medium opacity-70">
                    Jetzt anfragen
                  </span>
                </div>

                <h2 className="text-fluid-h1 font-bold leading-[1.05] tracking-tight">
                  Bereit für Ihre neue digitale Infrastruktur?
                </h2>

                <p className="mt-8 text-fluid-p opacity-70 leading-relaxed max-w-lg">
                  Schildern Sie uns kurz Ihr Vorhaben. Wir prüfen, ob Ihr Projekt zu unserem
                  Anforderungsprofil passt und melden uns innerhalb von 24 Stunden mit einer
                  unverbindlichen Ersteinschätzung.
                </p>

                <ul className="mt-12 pt-8 border-t border-background/20 space-y-4 text-sm font-medium opacity-80">
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-background rounded-sm shrink-0" />
                    Keine Agenturfloskeln — direkte, technische Ersteinschätzung
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-background rounded-sm shrink-0" />
                    Angebot erst nach gemeinsamem Briefing, nicht aus der Schublade
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-background rounded-sm shrink-0" />
                    100 % DSGVO-konforme Infrastruktur von Anfang an
                  </li>
                </ul>
              </div>

              {/* Formular — ContactFormBase aus Phase 3.5 ──────────────────── */}
              <div className="bg-background text-foreground p-8 md:p-12 rounded-sm shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
                <h3 className="text-2xl font-bold mb-2">Projektanfrage starten</h3>
                <p className="text-sm text-muted-foreground mb-8">
                  Wählen Sie <strong>„Webseiten"</strong> als Leistung und Ihr ungefähres Budget.
                  Wir melden uns zeitnah.
                </p>
                {/* Tracking page_type wird korrekt durchgereicht */}
                <ContactFormBase page_type={PAGE_TYPE} />
              </div>

            </div>
          </Container>
        </Section>

      </main>
    </>
  );
}
