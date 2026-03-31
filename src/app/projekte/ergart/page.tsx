// src/app/projekte/ergart/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, TrendingUp, Search, Star, ArrowLeft } from "lucide-react";
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Study: Ergart GmbH – +300 % Traffic in 3 Monaten",
    description: "Wie technisches SEO und ein neuer Webauftritt den Terminkalender füllten.",
  },
};

// JSON-LD: Case Study / Article
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Von Platz 64 auf Platz 1 bei Google – Case Study Ergart GmbH",
  description:
    "Wie Handwerksmeister Alexander Ergart mit SMAIRYS binnen 3 Monaten auf Platz 1 bei Google landete.",
  url: "https://smairys-netz-manufaktur.de/projekte/ergart",
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
  { icon: <TrendingUp className="w-6 h-6 text-primary" />, value: "+300 %", label: "Website-Traffic" },
  { icon: <Search className="w-6 h-6 text-primary" />, value: "Platz 1", label: "bei Google (Kernbegriffe)" },
  { icon: <Star className="w-6 h-6 text-primary" />, value: "3 Monate", label: "bis zu den Ergebnissen" },
  { icon: <Check className="w-6 h-6 text-primary" />, value: "Voll", label: "Terminkalender" },
];

const services = ["Webentwicklung (Next.js)", "Technisches SEO", "Backlink-Aufbau", "Google Business Profil"];

export default function ErgartCaseStudy() {
  return (
    <main className="relative isolate">
      {/* Atmosphäre */}
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute left-1/2 top-0 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full blur-3xl bg-[radial-gradient(closest-side,hsl(var(--primary)/0.09),transparent_70%)]" />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <section className="container py-16 sm:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 text-sm text-foreground/60 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </Link>

        <div className="max-w-4xl">
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-medium text-primary mb-4">
            Case Study
          </span>

          <h1 className="text-4xl font-bold tracking-tight font-heading sm:text-5xl">
            Von Platz 64 auf Platz 1 bei Google
          </h1>
          <p className="mt-3 text-xl text-foreground/70">
            Ergart GmbH · Handwerksmeister · Saarland
          </p>

          <p className="mt-6 text-lg leading-relaxed text-foreground/85 max-w-3xl">
            Alexander Ergart ist Handwerksmeister. Seine Qualität spricht für
            sich – aber sein altes Web-Auftritt nicht. Innerhalb von drei Monaten
            nach Relaunch: Platz 1 bei den wichtigsten Google-Suchanfragen, dreimal
            so viel organischer Traffic und ein voller Terminkalender.
          </p>
        </div>
      </section>

      {/* KPIs */}
      <section className="container pb-12" aria-label="Ergebnisse">
        <div className="grid grid-cols-2 gap-4 max-w-3xl md:grid-cols-4">
          {kpis.map((k, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-5 text-center rounded-2xl border border-border/60 bg-card/80 shadow-sm"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                {k.icon}
              </div>
              <div className="text-2xl font-bold font-heading text-foreground">{k.value}</div>
              <div className="mt-1 text-xs text-foreground/60">{k.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Logo */}
      <section className="container pb-16">
        <div className="relative w-48 h-20">
          <Image
            src="/testimonials/ergart-logo.png"
            alt="Ergart GmbH Logo"
            fill
            className="object-contain"
            sizes="192px"
          />
        </div>
      </section>

      {/* Story */}
      <section className="container pb-16 max-w-3xl">
        <article className="space-y-8 text-base leading-relaxed text-foreground/85">
          <div>
            <h2 className="text-2xl font-bold font-heading mb-3">Die Ausgangslage</h2>
            <p>
              Vor dem Relaunch war die Website von Alexander Ergart eine typische
              Baukasten-Lösung: langsam, unübersichtlich, kaum für Suchmaschinen
              optimiert. Bei Google tauchte das Unternehmen auf Seite 7 auf – dort,
              wo kaum jemand hinschaut. Neue Kunden kamen fast ausschließlich über
              Empfehlungen.
            </p>
            <p className="mt-4">
              Das Ziel war klar: online sichtbar werden, mehr Anfragen über die
              Website generieren und den Terminkalender verlässlich füllen.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-heading mb-3">Was wir gemacht haben</h2>
            <ul className="space-y-3">
              {[
                "Kompletter Neuaufbau mit Next.js – schnell, sauber, wartbar.",
                "Technisches SEO: Core Web Vitals, strukturierte Daten, kanonische URLs.",
                "Lokale Sichtbarkeit: Google Business Profil optimiert und mit der Website verknüpft.",
                "Backlink-Aufbau: relevante regionale und branchennahe Verlinkungen.",
                "Content-Architektur: Seiten, die Fragen der Zielgruppe wirklich beantworten.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-0.5 shrink-0 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-heading mb-3">Das Ergebnis</h2>
            <p>
              Drei Monate nach Launch: Platz 1 bei den wichtigsten regionalen
              Suchbegriffen, über 300 % mehr organischer Traffic und – am
              wichtigsten – ein voller Kalender. Neue Kunden buchen jetzt direkt
              über die Website, ohne dass Alexander aktiv Akquise betreiben muss.
            </p>
            <p className="mt-4">
              Heute betreue ich die Website laufend, sorge für technische
              Aktualität und begleite das weitere Wachstum.
            </p>
          </div>

          {/* Zitat */}
          <figure className="relative p-6 rounded-2xl border border-border/60 bg-card/80 shadow-sm my-8">
            <div
              aria-hidden
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent"
            />
            <blockquote className="relative z-10">
              <p className="text-lg font-medium text-foreground/90 italic leading-relaxed">
                &ldquo;Von Platz 64 auf 1 bei Google, 300 Prozent mehr Traffic.
                Als Handwerksmeister hatte ich weder Zeit noch Ahnung von Webdesign.
                Smairys hat Website, SEO und alles andere umgesetzt. Nach drei Monaten
                ranken wir bei wichtigen Suchbegriffen auf Platz 1.&rdquo;
              </p>
              <figcaption className="mt-4 text-sm text-foreground/60">
                <span className="font-semibold text-foreground">Alexander Ergart</span>
                &nbsp;&middot;&nbsp;Geschäftsführer, Ergart GmbH
              </figcaption>
            </blockquote>
          </figure>

          {/* Services */}
          <div>
            <h2 className="text-2xl font-bold font-heading mb-3">Eingesetzte Leistungen</h2>
            <div className="flex flex-wrap gap-2">
              {services.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full border border-border/60 bg-background/60 px-3 py-1 text-sm text-foreground/70"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Website-Link */}
          <p className="text-sm text-foreground/60">
            Website:{" "}
            <a
              href="https://alexander-ergart.de"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              alexander-ergart.de
            </a>
          </p>
        </article>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="max-w-3xl space-y-6">
          <div className="p-6 rounded-2xl border border-border/60 bg-card/80 shadow-sm">
            <h2 className="text-xl font-bold font-heading">
              Ähnliche Ergebnisse für Ihr Unternehmen?
            </h2>
            <p className="mt-2 text-sm text-foreground/75">
              Im Erstgespräch zeige ich Ihnen, was für Ihren Betrieb realistisch
              möglich ist – kostenlos und ohne Verkaufsdruck.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Erstgespräch buchen
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
