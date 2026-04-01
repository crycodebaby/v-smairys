// app/page.tsx
import type { Metadata } from "next";
import SocialProof from "@/components/SocialProof";
import SignalEngineSection from "@/components/SignalEngineSection";
import CtaSection from "@/components/CtaSection";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import ResultsSection from "@/components/ResultsSection";
import CaseStudyPreview from "@/components/CaseStudyPreview";
import BackgroundGrid from "@/components/ui/BackgroundGrid";
import ClientHeroIntro from "@/components/ui/ClientHeroIntro";
import ContrastScrim from "@/components/ui/ContrastScrim";

export const metadata: Metadata = {
  title: "SMAIRYS Netz-Manufaktur – Websites für Handwerker & Betriebe",
  description:
    "Handgefertigte Websites mit technischem SEO für Handwerker, Bauunternehmen und regionale Betriebe im Saarland. Messbar mehr Anfragen – persönlich begleitet.",
  alternates: { canonical: "https://smairys-netz-manufaktur.de" },
  openGraph: {
    title: "SMAIRYS Netz-Manufaktur – Websites für Handwerker & Betriebe",
    description:
      "Handgefertigte Websites mit technischem SEO. +300 % Traffic, +140 % Anfragen – echte Ergebnisse aus der Region.",
    url: "https://smairys-netz-manufaktur.de",
    type: "website",
    siteName: "SMAIRYS Netz-Manufaktur",
  },
  twitter: {
    card: "summary_large_image",
    title: "SMAIRYS Netz-Manufaktur",
    description:
      "Websites für Handwerker & Betriebe – handgefertigt, schnell, messbar.",
  },
};

// JSON-LD: LocalBusiness
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "SMAIRYS Netz-Manufaktur",
  description:
    "Handgefertigte Websites, technisches SEO und digitale Betreuung für Handwerker und Betriebe.",
  url: "https://smairys-netz-manufaktur.de",
  telephone: "+4916055392220",
  email: "robin@smairys.de",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Zur Steinrausche 22",
    addressLocality: "Eppelborn",
    postalCode: "66571",
    addressCountry: "DE",
  },
  founder: {
    "@type": "Person",
    name: "Robin Schmeiries",
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Saarland",
  },
  priceRange: "€€",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* --------------------------------------------------
          HERO
      -------------------------------------------------- */}
      <section
        id="hero"
        className="relative min-h-[90vh] py-24 sm:py-32"
      >
        <div className="absolute inset-0 pointer-events-none -z-20">
          <BackgroundGrid />
        </div>

        <ClientHeroIntro>
          <div className="container mx-auto text-center relative z-10">
            <div className="max-w-3xl mx-auto space-y-6">
              <ContrastScrim insetClassName="px-3 py-2" strength={0.6} blur={8}>
                <h1 className="text-4xl font-bold tracking-tight font-heading sm:text-6xl">
                  <span className="text-primary">Mehr Anfragen.</span> Mehr
                  Sichtbarkeit. Mehr Vertrauen.
                  <span className="block mt-2 text-2xl text-foreground/80 sm:mt-4 sm:text-4xl">
                    Mit einer <strong>SMAIRYS</strong> Website, die Ergebnisse
                    liefert – nicht nur gut aussieht.
                  </span>
                </h1>
              </ContrastScrim>

              <ContrastScrim insetClassName="px-3 py-2" strength={0.55} blur={7}>
                <p className="text-lg leading-8 text-foreground/90">
                  Handgefertigte Websites für Handwerker, Bauunternehmen und
                  regionale Betriebe. Technisches SEO, das wirkt. Persönlich
                  begleitet von Anfang bis nach dem Launch.
                </p>
              </ContrastScrim>

              <div className="flex flex-col items-center justify-center gap-4 mt-6 sm:flex-row">
                <a
                  href="/kontakt"
                  className="btn-premium"
                  aria-label="Kostenloses Erstgespräch buchen"
                >
                  Erstgespräch buchen
                </a>
                <a
                  href="#ergebnisse"
                  className="btn-ghost"
                  aria-label="Ergebnisse ansehen"
                >
                  Ergebnisse ansehen
                </a>
              </div>

              {/* Social Proof Mini-Zeile */}
              <p className="text-sm text-foreground/60 mt-2">
                Ergart GmbH · Eppelstyle · Crncic Bausanierung &nbsp;·&nbsp;
                <span className="text-foreground/80 font-medium">und weitere</span>
              </p>
            </div>
          </div>
        </ClientHeroIntro>
      </section>

      {/* --------------------------------------------------
          SOCIAL PROOF
      -------------------------------------------------- */}
      <div className="mt-12 sm:mt-16 lg:mt-24" />
      <SocialProof />

      {/* --------------------------------------------------
          ERGEBNISSE / KPIs
      -------------------------------------------------- */}
      <ResultsSection />

      {/* --------------------------------------------------
          CASE STUDY PREVIEW
      -------------------------------------------------- */}
      <CaseStudyPreview />

      {/* --------------------------------------------------
          SIGNAL ENGINE
      -------------------------------------------------- */}
      <SignalEngineSection />

      {/* --------------------------------------------------
          PROZESS
      -------------------------------------------------- */}
      <section id="process" className="relative">
        <ProcessSection />
      </section>

      {/* --------------------------------------------------
          REFERENZEN
      -------------------------------------------------- */}
      <section id="testimonials" className="relative">
        <TestimonialsSection />
      </section>

      {/* --------------------------------------------------
          FAQ
      -------------------------------------------------- */}
      <section id="faq" className="relative">
        <FaqSection />
      </section>

      {/* --------------------------------------------------
          CTA
      -------------------------------------------------- */}
      <section id="cta" className="relative">
        <CtaSection />
      </section>
    </>
  );
}
