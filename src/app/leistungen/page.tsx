// src/app/leistungen/page.tsx
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import ServicesTOC from "@/components/leistungen/ServicesTOC";
import { ServiceSectionPlaceholder } from "@/components/leistungen/ServiceSectionPlaceholder";
import BookingCard from "@/components/contact/BookingCard";
import LeistungenFinalCta from "@/components/leistungen/LeistungenFinalCta";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { BackdropIcons } from "@/components/backdrop/BackdropIcons";
import { LEISTUNGEN_NAV_ITEMS } from "@/config/leistungen-services";

const ServiceSection = dynamic(
  () => import("@/components/leistungen/ServiceSection"),
  { loading: () => <ServiceSectionPlaceholder /> }
);

export const metadata: Metadata = {
  title: "Leistungen – SMAIRYS Netz-Manufaktur",
  description:
    "Handgearbeitete Premium-Websites, schnelle Ladezeiten, deutsches Hosting und Cybersicherheit für Zertifikate, Domain und E-Mail.",
  alternates: { canonical: "/leistungen" },
};

export default function LeistungenPage() {
  return (
    <>
      <Header />
      <div className="relative overflow-x-clip">
        {/* Hero */}
        <section className="relative isolate overflow-hidden pt-24 pb-8 sm:pt-32 sm:pb-12">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.03),transparent_18%,transparent_82%,rgba(0,0,0,0.04))]" />
            <div className="absolute left-1/2 top-[-5rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(var(--brand-glow)/0.16),transparent_70%)] blur-3xl" />
            <div className="absolute bottom-[-8rem] right-1/3 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(closest-side,hsl(var(--brand-glow)/0.10),transparent_75%)] blur-3xl" />
          </div>

          <BackdropIcons preset="tech" showFrom="sm" />

          <Container size="wide" className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="inline-flex items-center rounded-sm border border-border/60 bg-background/60 px-3 py-1 text-[11px] font-medium text-foreground/70">
                Leistungen
              </p>
              <h1 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                Was Sie mit SMAIRYS erreichen
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base text-foreground/80 sm:text-lg">
                Handgearbeitete Premium-Websites, schnelle Ladezeiten und
                deutsches Hosting mit Cybersicherheit – ohne Massenware.
              </p>
            </div>
          </Container>
        </section>

        {/* Sticky Capabilities-Bar – alle Breakpoints */}
        <ServicesTOC items={LEISTUNGEN_NAV_ITEMS} />

        {/* Mobile / Tablet: eine BookingCard in-flow (Desktop: Sticky-Sidebar) */}
        <section
          className="border-b border-white/6 pb-8 pt-6 sm:pb-10 sm:pt-8 lg:hidden"
          aria-label="Strategisches Erstgespräch"
        >
          <Container size="wide">
            <div className="mx-auto w-full max-w-md min-w-0">
              <BookingCard variant="inline" />
            </div>
          </Container>
        </section>

        {/* Hauptinhalt: Sections + Desktop-Sidebar */}
        <Container size="wide" className="relative z-10">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-x-10 lg:grid-cols-[minmax(0,1fr)_minmax(17.5rem,20rem)] xl:grid-cols-[minmax(0,1fr)_minmax(18.5rem,22rem)] xl:gap-x-12">
            {/* Service-Sections */}
            <div className="min-w-0">
              <ServiceSection
                id="service-web"
                eyebrow="Premium Webdesign"
                title="Handgearbeitete Websites statt Baukasten"
                bullets={[
                  "Individuell entwickelt – kein Template, kein Massenprodukt.",
                  "Schnelle Ladezeiten und saubere technische Basis.",
                  "Ein Auftritt, der Vertrauen schafft und Anfragen bringt.",
                ]}
                body={[
                  "Ihre Website soll wie Ihr Unternehmen wirken: hochwertig, klar und überzeugend – bis ins Detail handgefertigt.",
                ]}
                cta={{ label: "Projekt besprechen", href: "/#kontakt" }}
                variant="web"
              />

              <ServiceSection
                id="service-jpp"
                eyebrow="Geschwindigkeit & Performance"
                title="Schnell laden, überzeugen bleiben"
                bullets={[
                  "Ladezeiten und Performance klar auf den Punkt.",
                  "Priorisierte Maßnahmen – ohne Technik-Blabla.",
                  "Ideal vor einem Relaunch oder als schneller Check.",
                ]}
                body={[
                  "Eine langsame Website kostet Vertrauen und Anfragen. Wir zeigen, wo es hakt – und was sich lohnt.",
                ]}
                cta={{ label: "Performance prüfen", href: "/#kontakt" }}
                variant="jpp"
              />

              <ServiceSection
                id="service-seo"
                eyebrow="SEO & Sichtbarkeit"
                title="Gefunden werden, wenn es zählt"
                bullets={[
                  "Saubere Struktur und Inhalte, die Kunden suchen.",
                  "Lokale Sichtbarkeit für Ihre Zielgruppe.",
                  "Mehr relevante Anfragen ohne Werbebudget.",
                ]}
                body={[
                  "Gute Rankings entstehen aus Klarheit, Vertrauen und einer Website, die wirklich antwortet.",
                ]}
                cta={{ label: "Sichtbarkeit verbessern", href: "/#kontakt" }}
                variant="seo"
              />

              <ServiceSection
                id="service-hosting"
                eyebrow="Hosting & Sicherheit"
                title="Deutsches Hosting. Sicher betrieben."
                bullets={[
                  "Hosting in Deutschland – DSGVO-konform und zuverlässig.",
                  "Cybersicherheit: SSL-Zertifikate, Domain-Schutz und Updates.",
                  "E-Mail-Spam-Absicherung für Ihre geschäftliche Kommunikation.",
                ]}
                body={[
                  "Ihre Website läuft schnell, bleibt geschützt und wächst mit – ohne dass Sie sich um Technik kümmern müssen.",
                ]}
                cta={{ label: "Betreuung sichern", href: "/#kontakt" }}
                variant="hosting"
              />
            </div>

            {/* Desktop: eine Sticky Booking-Sidebar (endet mit dem Grid, kein Footer-Duplikat) */}
            <aside className="relative hidden min-w-0 lg:block">
              <div className="sticky top-[calc(4.25rem+3.75rem+0.75rem)] self-start pt-2 pb-6">
                <BookingCard variant="sidebar" />
              </div>
            </aside>
          </div>
        </Container>

        <LeistungenFinalCta />
      </div>
    </>
  );
}
