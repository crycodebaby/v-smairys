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
          {/* Konzentrische Linien als ruhiges Hintergrund-Motiv. Auf Mobile
              versteckt, damit der Text nicht von dekorativer Geometrie
              eingedrückt wird. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[-15%] top-1/2 hidden aspect-square w-[80vw] max-w-[900px] -translate-y-1/2 opacity-[0.04] md:right-0 md:block md:opacity-[0.03] md:w-[65vw]"
          >
            <div className="h-full w-full rounded-full border border-foreground" />
            <div className="absolute inset-[10%] rounded-full border border-foreground" />
            <div className="absolute inset-[20%] rounded-full border border-foreground" />
          </div>

          {/* Tiefenschärfe: Programmier-Icons, ab `sm` sichtbar */}
          <BackdropIcons preset="tech" showFrom="sm" />

          <Container
            size="wide"
            className="relative z-10 grid items-center gap-8 md:grid-cols-12"
          >
            <div className="flex flex-col items-start gap-6 sm:gap-8 md:col-span-9 lg:col-span-8">
              <Kicker>Next.js Webentwicklung</Kicker>

              <h1 className="text-fluid-h1 font-bold leading-[1.05] tracking-tight text-foreground">
                Ihre digitale Infrastruktur.{' '}
                <span className="font-light text-muted-foreground">
                  Handgebaut, sicher und vollständig betreut.
                </span>
              </h1>

              <p className="max-w-2xl text-fluid-p leading-relaxed text-muted-foreground">
                Wir liefern keine „schönen Webseiten" — wir entwickeln vollständige digitale
                Infrastrukturen. Code, Hosting, E-Mail, Wartung. Alles aus einer Hand. Alles auf
                technisch höchstem Niveau.
              </p>

              <Button
                variant="brand"
                size="lg"
                href={booking.href}
                external={booking.external}
                cta_id="CTA_WEB_CONSULT"
                cta_label="Projektanfrage starten"
                cta_position="hero_primary"
                page_type={PAGE_TYPE}
                className="w-full sm:w-auto"
              >
                Projektanfrage starten
              </Button>
            </div>
          </Container>
        </Section>

        {/* ── 2. RUNDUM-SORGLOS PARADIGMA ────────────────────────────────────── */}
        <Section className="bg-background">
          <Container>
            <div className="mb-10 sm:mb-14 lg:mb-16">
              <Kicker>Das Rundum-Sorglos-Paradigma</Kicker>
              <h2 className="mt-4 max-w-2xl text-fluid-h2 font-bold leading-tight text-foreground">
                Vier Säulen. Eine Verantwortung.
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
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

        {/* ── 3. HANDWERK vs. MASSENWARE ─────────────────────────────────────── */}
        <Section className="border-y border-border bg-background">
          <Container>
            <div className="grid items-start gap-10 md:gap-14 lg:grid-cols-2 lg:gap-24 xl:gap-32">

              {/* Linke Spalte: Intro */}
              <div className="flex flex-col gap-5 sm:gap-6 lg:sticky lg:top-32">
                <Kicker>Handwerk vs. Massenware</Kicker>
                <h2 className="text-fluid-h2 font-bold leading-tight text-foreground">
                  Warum echter Code den Unterschied macht.
                </h2>
                <p className="text-fluid-p leading-relaxed text-muted-foreground">
                  WordPress und Wix lösen ein Problem — für Hobbyprojekte. Für professionellen B2B-Vertrieb
                  sind sie strukturelle Handicaps: langsam, angreifbar und schwer skalierbar.
                </p>
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Unsere Next.js-Architektur rendert Seiten auf Edge-Servern in unter einer Sekunde,
                  besitzt keine angreifbare Admin-Oberfläche und wächst nahtlos mit Ihrem Unternehmen.
                  Das ist kein Marketing-Versprechen — das sind messbare, technische Fakten.
                </p>
              </div>

              {/*
               * Rechte Spalte: Vergleichs-Tabelle
               *
               * Mobile (<640): jede Zeile wird zur eigenen Karte (vertikales
               * Stack), Header-Zeile ausgeblendet.
               * Ab `sm`: klassische 3-Spalten-Tabelle.
               */}
              <div className="border-t border-border">
                <div className="hidden grid-cols-3 gap-4 border-b border-border/40 py-4 sm:grid">
                  <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">Kriterium</div>
                  <div className="text-xs font-medium uppercase tracking-widest text-foreground">Smairys Code</div>
                  <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">Baukästen</div>
                </div>

                {comparisons.map((row) => (
                  <div
                    key={row.label}
                    className="group flex flex-col gap-3 border-b border-border/30 py-5 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-soft sm:text-sm sm:font-semibold sm:normal-case sm:tracking-normal sm:text-muted-foreground sm:transition-colors sm:group-hover:text-foreground">
                      {row.label}
                    </div>
                    <div className="text-sm leading-snug text-foreground">
                      <span className="mr-1 inline-block text-[10px] font-semibold uppercase tracking-widest text-foreground/60 sm:hidden">
                        Smairys
                      </span>
                      {row.craft}
                    </div>
                    <div className="text-sm leading-snug text-muted-foreground/60 line-through decoration-muted-foreground/30">
                      <span className="mr-1 inline-block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 no-underline sm:hidden">
                        Baukasten
                      </span>
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
          <Container size="tight">
            <div className="mb-10 sm:mb-14 lg:mb-16">
              <Kicker>Häufige Fragen</Kicker>
              <h2 className="mt-4 text-fluid-h2 font-bold leading-tight text-foreground">
                Klare Antworten auf harte Einwände.
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

        {/* ── 5. FINAL CTA & FORMULAR ────────────────────────────────────────── */}
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
                  Bereit für Ihre neue digitale Infrastruktur?
                </h2>

                <p className="mt-6 max-w-lg text-fluid-p leading-relaxed opacity-70 sm:mt-8">
                  Schildern Sie uns kurz Ihr Vorhaben. Wir prüfen, ob Ihr Projekt zu unserem
                  Anforderungsprofil passt und melden uns innerhalb von 24 Stunden mit einer
                  unverbindlichen Ersteinschätzung.
                </p>

                <ul className="mt-8 space-y-3 border-t border-background/20 pt-6 text-sm font-medium opacity-80 sm:mt-12 sm:space-y-4 sm:pt-8">
                  <li className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-sm bg-background" />
                    Keine Agenturfloskeln — direkte, technische Ersteinschätzung
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-sm bg-background" />
                    Angebot erst nach gemeinsamem Briefing, nicht aus der Schublade
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-sm bg-background" />
                    100 % DSGVO-konforme Infrastruktur von Anfang an
                  </li>
                </ul>
              </div>

              <div className="relative overflow-hidden rounded-sm bg-background p-5 text-foreground shadow-2xl sm:p-8 md:p-12">
                <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
                <h3 className="mb-2 text-2xl font-bold">Projektanfrage starten</h3>
                <p className="mb-6 text-sm text-muted-foreground sm:mb-8">
                  Wählen Sie <strong>„Webseiten"</strong> als Leistung und Ihr ungefähres Budget.
                  Wir melden uns zeitnah.
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
