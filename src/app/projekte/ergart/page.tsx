// src/app/projekte/ergart/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, TrendingUp, Search, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import BookingCard from "@/components/contact/BookingCard";

export const metadata: Metadata = {
  title: "Case Study: Ergart GmbH – Von Platz 64 auf Platz 1 bei Google | SMAIRYS",
  description:
    "Wie Handwerksmeister Alexander Ergart mit SMAIRYS binnen 3 Monaten auf Platz 1 bei Google landete und seinen Traffic um 300 % steigerte.",
  alternates: { canonical: "https://smairys-netz-manufaktur.de/projekte/ergart" },
  openGraph: {
    title: "Case Study: Ergart GmbH – Von Platz 64 auf Platz 1 bei Google",
    description:
      "300 % mehr Traffic, Platz 1 bei Google – in 3 Monaten. Die vollständige Story.",
    url: "https://smairys-netz-manufaktur.de/projekte/ergart",
    type: "article",
    images: [
      {
        url: "/case-studies/ergart/firmenzentrale.webp",
        width: 1400,
        height: 933,
        alt: "Firmenzentrale Ergart GmbH",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Study: Ergart GmbH – +300 % Traffic in 3 Monaten",
    description: "Wie technisches SEO und ein neuer Webauftritt den Terminkalender füllten.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Von Platz 64 auf Platz 1 bei Google – Case Study Ergart GmbH",
  description:
    "Wie Handwerksmeister Alexander Ergart mit SMAIRYS binnen 3 Monaten auf Platz 1 bei Google landete.",
  url: "https://smairys-netz-manufaktur.de/projekte/ergart",
  image: "https://smairys-netz-manufaktur.de/case-studies/ergart/firmenzentrale.webp",
  author: {
    "@type": "Person",
    name: "Robin Schmeiries",
    url: "https://smairys-netz-manufaktur.de",
  },
  publisher: {
    "@type": "Organization",
    name: "SMAIRYS Netz-Manufaktur",
    url: "https://smairys-netz-manufaktur.de",
  },
  about: {
    "@type": "LocalBusiness",
    name: "Ergart GmbH",
    url: "https://alexander-ergart.de",
  },
};

const kpis = [
  {
    icon: <TrendingUp className="w-5 h-5 text-primary" aria-hidden />,
    value: "+300 %",
    label: "organische Klicks",
    sub: "in 3 Monaten",
  },
  {
    icon: <Search className="w-5 h-5 text-primary" aria-hidden />,
    value: "Platz 1",
    label: "bei Google",
    sub: "statt Platz 64",
  },
  {
    icon: <Clock className="w-5 h-5 text-primary" aria-hidden />,
    value: "1,5+ Jahre",
    label: "laufende Partnerschaft",
    sub: "seit 2023",
  },
  {
    icon: <Check className="w-5 h-5 text-primary" aria-hidden />,
    value: "3.369 €",
    label: "erbrachte Leistungen",
    sub: "kumuliert",
  },
];

const services = [
  "Webentwicklung (Next.js)",
  "Technisches SEO",
  "Backlink-Aufbau",
  "Google Business Profil",
  "KI-Tool-Integration",
  "Laufende Betreuung",
];

export default function ErgartCaseStudy() {
  return (
    <main className="relative isolate">
      {/* Atmosphäre */}
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute left-1/2 top-0 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full blur-3xl bg-[radial-gradient(closest-side,hsl(var(--primary)/0.07),transparent_70%)]" />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb + Hero */}
      <section className="container pt-14 pb-12 sm:pt-20 sm:pb-16">
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Startseite
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-center">
          {/* Text */}
          <div className="lg:col-span-3">
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-medium text-primary mb-4">
              Case Study
            </span>

            {/* Ergart Logo */}
            <div className="mb-5">
              <Image
                src="/case-studies/ergart/logo.svg"
                alt="Ergart GmbH Logo"
                width={160}
                height={60}
                className="h-10 w-auto"
                priority
              />
            </div>

            <h1 className="text-4xl font-bold tracking-tight font-heading sm:text-5xl text-balance">
              Vom lokalen Handwerker zur ersten Adresse bei Google
            </h1>
            <p className="mt-3 text-lg text-foreground/65 font-medium">
              Ergart GmbH &middot; Handwerksmeister &middot; Saarland
            </p>

            <p className="mt-5 text-base leading-relaxed text-foreground/80 max-w-2xl">
              Alexander Ergart ist Handwerksmeister. Seine Qualität spricht für
              sich – aber sein alter Webauftritt nicht. Vor der Zusammenarbeit:
              kein Google-Ranking, keine Anfragen über die Website,
              ausschließlich Empfehlungskunden. Drei Monate nach Relaunch:
              Platz&nbsp;1 bei den wichtigsten regionalen Suchbegriffen, dreimal
              so viel organischer Traffic, ein voller Kalender.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {services.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-foreground/65"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Firmenzentrale */}
          <div className="lg:col-span-2">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/50 shadow-lg">
              <Image
                src="/case-studies/ergart/firmenzentrale.webp"
                alt="Firmenzentrale Ergart GmbH mit Firmenfahrzeugen im Saarland"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            </div>
            <p className="mt-2 text-xs text-foreground/45 text-center">
              Firmenzentrale Ergart GmbH, Saarland
            </p>
          </div>
        </div>
      </section>

      {/* KPI-Grid */}
      <section className="container pb-16" aria-label="Ergebnisse auf einen Blick">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="flex flex-col items-center p-5 text-center rounded-2xl border border-border/60 bg-card/80 shadow-sm"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-3">
                {k.icon}
              </div>
              <div className="text-2xl font-bold font-heading text-foreground leading-tight">
                {k.value}
              </div>
              <div className="mt-1 text-xs font-semibold text-foreground/75">{k.label}</div>
              {k.sub && (
                <div className="mt-0.5 text-[11px] text-foreground/45">{k.sub}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Ausgangslage + Leistungen */}
      <section className="container pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          <div className="rounded-2xl border border-border/60 bg-card/80 p-6 sm:p-8">
            <h2 className="text-xl font-bold font-heading mb-3">Ausgangssituation</h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Die Ergart GmbH war handwerklich exzellent, digital nicht
              vorhanden. Eine veraltete Baukasten-Website, keine messbare
              Online-Sichtbarkeit, kein Google-Ranking für relevante
              Suchbegriffe in der Region. Neue Kunden kamen fast
              ausschließlich über persönliche Empfehlungen.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">
              Das Ziel: online auffindbar werden, qualifizierte Anfragen
              über die Website generieren und den Terminkalender verlässlich
              füllen – ohne dauerhaften Aufwand für Alexander Ergart selbst.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/80 p-6 sm:p-8">
            <h2 className="text-xl font-bold font-heading mb-3">Was geliefert wurde</h2>
            <ul className="space-y-2.5">
              {[
                "Kompletter Neuaufbau mit Next.js – schnell, sauber, wartbar.",
                "Technisches SEO: Core Web Vitals, strukturierte Daten, kanonische URLs.",
                "Lokale Sichtbarkeit: Google Business Profil optimiert.",
                "Backlink-Aufbau: regionale und branchennahe Verlinkungen.",
                "KI-Tool-Integration zur Arbeitserleichterung.",
                "Laufende Betreuung seit Projektstart.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Visueller Beweis – Grafiken */}
      <section className="container pb-16" aria-labelledby="beweise-heading">
        <h2
          id="beweise-heading"
          className="text-2xl font-bold font-heading mb-2"
        >
          Die Ergebnisse in Zahlen
        </h2>
        <p className="text-sm text-foreground/60 mb-8 max-w-2xl">
          Beide Grafiken stammen direkt aus der Google Search Console von
          alexander-ergart.de und sind unbearbeitet.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          {/* GSC Langzeitverlauf */}
          <figure>
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm">
              <Image
                src="/case-studies/ergart/gsc-clicks.png"
                alt="Google Search Console Wochenansicht: 389 Klicks, 15.633 Impressionen, kontinuierlicher Aufwärtstrend der durchschnittlichen Position von März 2025 bis März 2026"
                width={960}
                height={400}
                className="w-full h-auto"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <figcaption className="mt-2 text-xs text-foreground/50 px-1">
              Google Search Console – Wöchentliche Performance (Mrz. 2025 – Mrz. 2026):
              389 Klicks, 15.633 Impressionen, durchschnittliche Position 23,7.
              Die orangene Linie zeigt den kontinuierlichen Positionsanstieg.
            </figcaption>
          </figure>

          {/* Klick-Diagramm kurzfristig */}
          <figure>
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm p-4">
              <Image
                src="/case-studies/ergart/clicks-graph.png"
                alt="Diagramm der Website-Klicks über einen 2-Wochen-Zeitraum: deutliche Peaks bis 45+ Klicks täglich"
                width={900}
                height={500}
                className="w-full h-auto"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <figcaption className="mt-2 text-xs text-foreground/50 px-1">
              Klickentwicklung (Kurzansicht): Deutliche organische Peaks nach
              der Relaunch-Phase – blaue Linie zeigt Klicks, orange CTR,
              türkis Impressionen.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Portrait + Zitat */}
      <section className="container pb-16" aria-labelledby="zitat-heading">
        <div className="max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-8 items-start rounded-2xl border border-border/60 bg-card/80 p-6 sm:p-8 shadow-sm">
            {/* Portrait */}
            <div className="flex flex-col items-center sm:items-start gap-3">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 overflow-hidden rounded-xl border border-border/50 shadow-sm shrink-0">
                <Image
                  src="/case-studies/ergart/portrait.png"
                  alt="Alexander Ergart, Geschäftsführer Ergart GmbH"
                  fill
                  className="object-cover object-top"
                  sizes="144px"
                />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-semibold text-foreground">Alexander Ergart</p>
                <p className="text-xs text-foreground/55">
                  Geschäftsführer, Ergart GmbH
                </p>
                <a
                  href="https://alexander-ergart.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-[11px] text-primary hover:underline"
                >
                  alexander-ergart.de
                </a>
              </div>
            </div>

            {/* Zitat */}
            <figure>
              <div
                aria-hidden
                className="text-5xl leading-none text-primary/20 font-serif mb-1 select-none"
              >
                &ldquo;
              </div>
              <blockquote>
                <p
                  id="zitat-heading"
                  className="text-base leading-relaxed text-foreground/90 italic"
                >
                  Von Platz 64 auf 1 bei Google, 300&nbsp;Prozent mehr Traffic.
                  Als Handwerksmeister hatte ich weder Zeit noch Ahnung von
                  Webdesign. Smairys hat Website, SEO und alles andere
                  umgesetzt. Nach drei Monaten ranken wir bei wichtigen
                  Suchbegriffen auf Platz&nbsp;1.
                </p>
              </blockquote>
            </figure>
          </div>
        </div>
      </section>

      {/* Partnerschaft in Zahlen */}
      <section className="container pb-16">
        <div className="max-w-4xl rounded-2xl border border-border/60 bg-card/80 p-6 sm:p-8">
          <h2 className="text-xl font-bold font-heading mb-5">Zusammenarbeit</h2>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Start", value: "2023" },
              { label: "Laufzeit", value: "1,5+ Jahre" },
              { label: "Erbrachte Leistungen", value: "3.369 €" },
              { label: "Status", value: "Aktiv" },
            ].map(({ label, value }) => (
              <div key={label} className="space-y-0.5">
                <dt className="text-xs text-foreground/50 uppercase tracking-wide">{label}</dt>
                <dd className="text-lg font-bold font-heading text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-sm leading-relaxed text-foreground/70">
            Die langfristige Zusammenarbeit mit Ergart GmbH zeigt, was
            nachhaltige digitale Betreuung bedeutet: kein Einmalprojekt,
            sondern ein verlässlicher Partner, der mit dem Unternehmen wächst.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="max-w-4xl space-y-6">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
            <h2 className="text-xl font-bold font-heading">
              Ähnliche Ergebnisse für Ihr Unternehmen?
            </h2>
            <p className="mt-2 text-sm text-foreground/75 max-w-xl">
              Im kostenlosen Erstgespräch zeige ich Ihnen, was für Ihren
              Betrieb realistisch möglich ist – ohne Verkaufsdruck, ohne
              Verpflichtung.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Erstgespräch buchen
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/leistungen"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-md border border-border/60 bg-background/70 text-foreground hover:border-foreground/30 transition-colors"
              >
                Alle Leistungen ansehen
              </Link>
            </div>
          </div>

          <BookingCard />
        </div>
      </section>
    </main>
  );
}
