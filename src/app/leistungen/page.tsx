// src/app/leistungen/page.tsx
import ServicesTOC from "@/components/leistungen/ServicesTOC";
import ServiceSection from "@/components/leistungen/ServiceSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leistungen; SMAIRYS Netz-Manufaktur",
  description:
    "Premium Website-Programmierung, JPP-Check, SEO & Hosting; handgefertigt für Marken, die wachsen.",
  alternates: { canonical: "/leistungen" },
};

export default function LeistungenPage() {
  return (
    <main className="relative">
      {/* Hero */}
      <section className="container relative py-16 isolate sm:py-24">
        {/* atmosphärischer Hintergrund; dezente Marken-Glows */}
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
            Kein Baukasten. Keine Massenware. Sondern handgeschriebene Websites,
            messbare Performance und verlässliche Betreuung; gebaut für Marken,
            die wachsen wollen.
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

      {/* Sections */}
      <ServiceSection
        id="service-web"
        eyebrow="🥇 Website-Programmierung & Markendesign"
        title="Weil Ihre Marke mehr verdient als ein Baukasten."
        bullets={[
          "Next.js-Basis, handgeschriebener Code – schnell, langlebig, vertrauensbildend.",
          "Unverwechselbares Design, klare Struktur, Qualität in jedem Pixel.",
          "Erster Eindruck, der trägt: Haltung, Präzision, Klasse statt greller Effekte.",
        ]}
        body={[
          "Jede Firma hat eine Geschichte. Die meisten Websites erzählen sie nur nicht.",
          "Ich entwickle digitale Auftritte, die Ihre Werte sichtbar machen – mit klarer Struktur, unverwechselbarem Design und dem Gefühl von Qualität in jedem Pixel.",
          "Smairys erschafft Websites, die wirken – wie ein Maßanzug, der sitzt.",
        ]}
        cta={{ label: "Projekt besprechen", href: "/#kontakt" }}
        variant="web"
      />

      <ServiceSection
        id="service-jpp"
        eyebrow="🚀 JPP-Check (JavaScript Potential & Performance)"
        title="Erkennen, wo Leistung verloren geht – und wie Sie sie freisetzen."
        bullets={[
          "Konkrete Zahlen: Ladezeiten, Strukturen, Reichweite – sauber gemessen.",
          "Priorisierte To-dos mit Impact-Schätzung statt endloser Listen.",
          "Fokus auf Wachstum: Sichtbarkeit, Conversion, Umsatz.",
        ]}
        body={[
          "Viele Websites sind wie Motoren ohne Feintuning – sie laufen, aber nicht auf Drehzahl.",
          "Der JPP-Bericht zeigt schwarz auf weiß, welches Potenzial in Ihrer Seite steckt – und was Sie gewinnen, wenn sie so arbeitet, wie sie sollte.",
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
          "Technische Perfektion (Core Web Vitals, Struktur, Markup).",
          "Klarer Content, der wirklich beantwortet – nicht nur rankt.",
          "Mehr Anfragen, mehr Relevanz – ohne Werbebudget.",
        ]}
        body={[
          "Sichtbarkeit ist kein Zufall: Sie entsteht durch Struktur, Klarheit und Vertrauen.",
          "SEO heißt: Ihre Marke wird zur Antwort auf die Fragen Ihrer Zielgruppe.",
        ]}
        cta={{ label: "Sichtbarkeit verbessern", href: "/#kontakt" }}
        variant="seo"
      />

      <ServiceSection
        id="service-hosting"
        eyebrow="⚙️ Hosting & Instandhaltung"
        title="Ihre Website läuft. Immer. Sicher. Schnell."
        bullets={[
          "DSGVO-konformes Hosting, Zertifikate, Updates – zuverlässig eingerichtet.",
          "Wachstum ohne Stillstand: neue Inhalte, Seiten, Funktionen.",
          "Monitoring & Pflege, damit Technik kein Thema ist.",
        ]}
        body={[
          "Wenn Ihr Geschäft läuft, sollte Ihre Website keines sein.",
          "Smairys sorgt dafür, dass Sie nie an einer digitalen Wachstumsgrenze stehen.",
        ]}
        cta={{ label: "Betreuung sichern", href: "/#kontakt" }}
        variant="hosting"
      />

      {/* Abschluss-CTA */}
      <section className="container py-16 sm:py-24">
        <div className="max-w-3xl p-8 mx-auto text-center border shadow-sm rounded-2xl border-border/60 bg-background/50 backdrop-blur-xl">
          <h2 className="text-2xl font-bold tracking-tight font-heading sm:text-3xl">
            Ihre Marke verdient mehr als eine Website.
          </h2>
          <p className="max-w-2xl mx-auto mt-3 text-foreground/80">
            Smairys ist Ihr Partner für digitale Substanz; mit Feingefühl,
            Präzision und dem Anspruch, dass jede Zeile Code etwas bedeutet.
          </p>
          Kostenfreies Erstgespräch
        </div>
      </section>
    </main>
  );
}
