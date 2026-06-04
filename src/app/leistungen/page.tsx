// src/app/leistungen/page.tsx
import type { Metadata } from "next";
import ServicesTOC from "@/components/leistungen/ServicesTOC";
import ServiceSection from "@/components/leistungen/ServiceSection";
import BookingCard from "@/components/contact/BookingCard";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { BackdropIcons } from "@/components/backdrop/BackdropIcons";

export const metadata: Metadata = {
  title: "Leistungen – SMAIRYS Netz-Manufaktur",
  description:
    "Website-Programmierung, JPP-Check, SEO und Hosting. Handgefertigt für Marken, die wachsen wollen.",
  alternates: { canonical: "/leistungen" },
};

export default function LeistungenPage() {
  return (
    <>
      <Header />
      <main className="relative">
        {/* Hero */}
        <section className="relative isolate overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-20">
          {/* dezente Marken-Glows */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.03),transparent_18%,transparent_82%,rgba(0,0,0,0.04))]" />
            <div className="absolute left-1/2 top-[-5rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(var(--brand-glow)/0.16),transparent_70%)] blur-3xl" />
            <div className="absolute bottom-[-8rem] right-1/3 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(closest-side,hsl(var(--brand-glow)/0.10),transparent_75%)] blur-3xl" />
          </div>

          {/* Tiefenschärfe: Programmier-Icons */}
          <BackdropIcons preset="tech" showFrom="sm" />

          <Container size="wide" className="relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="inline-flex items-center rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[11px] font-medium text-foreground/70">
                Leistungen
              </p>
              <h1 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                Was Sie mit SMAIRYS erreichen
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base text-foreground/80 sm:text-lg">
                Keine Massenware. Handgeschriebene Websites mit klarer Struktur,
                hoher Geschwindigkeit und verlässlicher Betreuung. Für Marken, die
                wachsen wollen.
              </p>
            </div>

            {/* Desktop: sticky Inhaltsverzeichnis */}
            <div className="mt-10 hidden lg:block">
              <ServicesTOC
                items={[
                  { id: "service-web", label: "Website & Markendesign" },
                  { id: "service-jpp", label: "JPP-Check (Performance)" },
                  { id: "service-seo", label: "SEO & Sichtbarkeit" },
                  { id: "service-hosting", label: "Hosting & Instandhaltung" },
                ]}
              />
            </div>
          </Container>
        </section>

        {/* Google-Kalender Buchungs-CTA */}
        <section className="-mt-2 mb-10 sm:mb-14">
          <Container size="wide">
            <div className="mx-auto max-w-5xl">
              <BookingCard />
            </div>
          </Container>
        </section>

      {/* Sections */}
      <ServiceSection
        id="service-web"
        eyebrow="🥇 Website-Programmierung & Markendesign"
        title="Ihre Marke verdient mehr als einen Baukasten"
        bullets={[
          "Next.js-Basis und handgeschriebener Code. Schnell, langlebig, vertrauensbildend.",
          "Unverwechselbares Design und klare Informationsarchitektur.",
          "Ein Auftritt, der in Sekunden Vertrauen weckt.",
        ]}
        body={[
          "Jede Firma hat eine Geschichte. Viele Websites erzählen sie nicht.",
          "Ich entwickle digitale Auftritte, die Werte sichtbar machen. Klar, eigenständig und hochwertig bis ins Detail.",
          "Das Ergebnis fühlt sich an wie ein Maßanzug, der sitzt.",
        ]}
        cta={{ label: "Projekt besprechen", href: "/#kontakt" }}
        variant="web"
      />

      <ServiceSection
        id="service-jpp"
        eyebrow="🚀 JPP-Check (JavaScript Potential & Performance)"
        title="Leistung sichtbar machen und freisetzen"
        bullets={[
          "Klare Zahlen zu Ladezeit, Struktur und Reichweite.",
          "Priorisierte Maßnahmen mit Wirkung statt langer Listen.",
          "Fokus auf Wachstum: Sichtbarkeit, Conversion, Umsatz.",
        ]}
        body={[
          "Viele Websites laufen, aber nicht auf Drehzahl.",
          "Der JPP-Bericht zeigt, welches Potenzial in Ihrer Seite steckt und was Sie gewinnen, wenn sie technisch sauber arbeitet.",
        ]}
        note="Ideal als Startpunkt oder Audit vor einem Relaunch."
        cta={{ label: "JPP-Check anfragen", href: "/#kontakt" }}
        variant="jpp"
      />

      <ServiceSection
        id="service-seo"
        eyebrow="🔍 SEO & Sichtbarkeit"
        title="Gesehen werden. Gefunden werden. Gewählt werden."
        bullets={[
          "Technisch sauber: Core Web Vitals, Struktur, Markup.",
          "Texte, die wirklich beantworten und führen.",
          "Mehr Anfragen und Relevanz ohne Werbebudget.",
        ]}
        body={[
          "Sichtbarkeit entsteht durch Struktur, Klarheit und Vertrauen.",
          "SEO bedeutet: Ihre Marke wird zur Antwort auf die Fragen Ihrer Zielgruppe.",
        ]}
        cta={{ label: "Sichtbarkeit verbessern", href: "/#kontakt" }}
        variant="seo"
      />

      <ServiceSection
        id="service-hosting"
        eyebrow="⚙️ Hosting & Instandhaltung"
        title="Ihre Website läuft – sicher und schnell"
        bullets={[
          "DSGVO-konformes Hosting mit Zertifikaten und Updates.",
          "Wachstum ohne Stillstand: Inhalte, Seiten, Funktionen.",
          "Monitoring und Pflege, damit Technik kein Thema ist.",
        ]}
        body={[
          "Wenn Ihr Geschäft läuft, sollte Ihre Website kein Risiko sein.",
          "SMAIRYS sorgt dafür, dass Ihre digitale Basis mitwächst.",
        ]}
        cta={{ label: "Betreuung sichern", href: "/#kontakt" }}
        variant="hosting"
      />

        {/* Abschluss-CTA mit klarer Wahl */}
        <section className="py-12 sm:py-20 lg:py-24">
          <Container size="wide">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
              <BookingCard />

              <div className="rounded-2xl border border-border/60 bg-background/50 p-6 text-center shadow-sm backdrop-blur-xl sm:p-8">
                <h2 className="font-heading text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
                  Ihre Marke verdient mehr als eine Website
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-foreground/80 sm:text-base">
                  SMAIRYS ist Ihr Partner für digitale Substanz. Mit Feingefühl,
                  Präzision und dem Anspruch, dass jede Zeile Code eine Aufgabe hat.
                </p>

                <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/#kontakt"
                    className="inline-flex items-center justify-center rounded-md bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-[0_10px_28px_-12px_hsl(var(--brand-glow)/0.7)] transition hover:bg-brand-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-glow"
                  >
                    Erstgespräch anfragen
                  </Link>
                  <Link
                    href="/projekte"
                    className="inline-flex items-center justify-center rounded-md border border-border/60 bg-background/70 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-foreground/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-glow"
                  >
                    Ergebnisse ansehen
                  </Link>
                </div>

                <p className="mx-auto mt-3 max-w-xs text-[11px] leading-snug text-foreground/65">
                  100&nbsp;% strategisch · 0&nbsp;% Verkaufsdruck
                </p>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
