// src/app/leistungen/page.tsx
import type { Metadata } from "next";
import ServicesTOC from "@/components/leistungen/ServicesTOC";
import ServiceSection from "@/components/leistungen/ServiceSection";
import BookingCard from "@/components/contact/BookingCard";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Leistungen – SMAIRYS Netz-Manufaktur",
  description:
    "Website-Programmierung, JPP-Check, SEO und Hosting. Handgefertigt für Marken, die wachsen wollen.",
  alternates: { canonical: "/leistungen" },
};

export default function LeistungenPage() {
  return (
    <main className="relative">
      {/* Hero */}
      <section className="container relative py-16 isolate sm:py-24">
        {/* dezente Marken-Glows */}
        <div aria-hidden className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.03),transparent_18%,transparent_82%,rgba(0,0,0,0.04))]" />
          <div className="absolute left-1/2 top-[-5rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full blur-3xl bg-[radial-gradient(closest-side,hsl(var(--primary)/0.12),transparent_70%)]" />
          <div className="absolute right-1/3 bottom-[-8rem] h-[26rem] w-[26rem] rounded-full blur-3xl bg-[radial-gradient(closest-side,hsl(var(--primary)/0.10),transparent_75%)]" />
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <p className="inline-flex items-center rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[11px] font-medium text-foreground/70">
            Leistungen
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight font-heading sm:text-5xl">
            Was Sie mit SMAIRYS erreichen
          </h1>
          <p className="max-w-2xl mx-auto mt-4 text-base text-foreground/80 sm:text-lg">
            Keine Massenware. Handgeschriebene Websites mit klarer Struktur,
            hoher Geschwindigkeit und verlässlicher Betreuung. Für Marken, die
            wachsen wollen.
          </p>
        </div>

        {/* Desktop: sticky Inhaltsverzeichnis */}
        <div className="hidden mt-10 lg:block">
          <ServicesTOC
            items={[
              { id: "service-web", label: "Website & Markendesign" },
              { id: "service-jpp", label: "JPP-Check (Performance)" },
              { id: "service-seo", label: "SEO & Sichtbarkeit" },
              { id: "service-hosting", label: "Hosting & Instandhaltung" },
            ]}
          />
        </div>
      </section>

      {/* Google-Kalender Buchungs-CTA */}
      <section className="container mb-10 -mt-2 sm:mb-14">
        <div className="max-w-5xl mx-auto">
          <BookingCard />
        </div>
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
      <section className="container py-16 sm:py-24">
        <div className="grid max-w-5xl grid-cols-1 gap-8 mx-auto md:grid-cols-2">
          {/* Sofort buchen */}
          <BookingCard />

          {/* Gespräch klassisch starten */}
          <div className="p-8 text-center border shadow-sm rounded-2xl border-border/60 bg-background/50 backdrop-blur-xl">
            <h2 className="text-2xl font-bold tracking-tight font-heading sm:text-3xl">
              Ihre Marke verdient mehr als eine Website
            </h2>
            <p className="max-w-xl mx-auto mt-3 text-foreground/80">
              SMAIRYS ist Ihr Partner für digitale Substanz. Mit Feingefühl,
              Präzision und dem Anspruch, dass jede Zeile Code eine Aufgabe hat.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 mt-6 sm:flex-row">
              <Link
                href="/#kontakt"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/40"
              >
                Erstgespräch anfragen
              </Link>
              <Link
                href="/#testimonials"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition border rounded-md border-border/60 bg-background/70 text-foreground hover:border-foreground/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/40"
              >
                Ergebnisse ansehen
              </Link>
            </div>

            <p className="mx-auto mt-3 max-w-xs text-[11px] leading-snug text-foreground/65">
              100&nbsp;% strategisch · 0&nbsp;% Verkaufsdruck
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
