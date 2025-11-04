// app/page.tsx
import SocialProof from "@/components/SocialProof";
import BentoGridSection from "@/components/BentoGridSection";
import CtaSection from "@/components/CtaSection";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import BackgroundGrid from "@/components/ui/BackgroundGrid";
import ClientHeroIntro from "@/components/ui/ClientHeroIntro";
import ContrastScrim from "@/components/ui/ContrastScrim";

export default function Home() {
  return (
    <>
      {/* --------------------------------------------------
         HERO
      -------------------------------------------------- */}
      <section
        id="hero"
        className="relative min-h-[90vh] overflow-hidden py-24 sm:py-32"
      >
        {/* ruhiges Raster hinter dem Content */}
        <div className="absolute inset-0 pointer-events-none -z-20">
          <BackgroundGrid />
        </div>

        {/* 3D-Canvas bleibt global; hier nur Text-Content */}
        <ClientHeroIntro>
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Headline */}
              <ContrastScrim insetClassName="px-3 py-2" strength={0.6} blur={8}>
                <h1 className="text-4xl font-bold tracking-tight font-heading sm:text-6xl">
                  <span className="text-primary">Mehr Kunden.</span> Mehr
                  Aufträge. Mehr Vertrauen.
                  <span className="block mt-2 text-2xl text-foreground/80 sm:mt-4 sm:text-4xl">
                    Mit einer <strong>SMAIRYS</strong> Website, die verkauft;
                    nicht nur gefällt.
                  </span>
                </h1>
              </ContrastScrim>

              {/* Kurzbeschreibung */}
              <ContrastScrim
                insetClassName="px-3 py-2"
                strength={0.55}
                blur={7}
              >
                <p className="text-lg leading-8 text-foreground/90">
                  Wir verbinden klares Design mit präziser Technik. Jede Seite
                  entsteht aus Strategie: Sichtbarkeit, Geschwindigkeit,
                  Conversion für Unternehmen, die wachsen wollen.
                </p>
              </ContrastScrim>

              {/* Calls to Action */}
              <div className="flex flex-col items-center justify-center gap-4 mt-6 sm:flex-row">
                <a
                  href="#process"
                  className="btn-premium"
                  aria-label="Projektanfrage starten"
                >
                  Projekt anfragen
                </a>
                <a
                  href="#bento"
                  className="btn-ghost"
                  aria-label="Unsere Arbeitsweise ansehen"
                >
                  Unsere Arbeitsweise
                </a>
              </div>
            </div>
          </div>
        </ClientHeroIntro>
      </section>

      {/* Abstand zwischen Hero und Social Proof */}
      <div className="mt-12 sm:mt-16 lg:mt-24" />

      {/* --------------------------------------------------
         SOCIAL PROOF
      -------------------------------------------------- */}
      <section id="socialproof" className="relative">
        <SocialProof />
      </section>

      {/* --------------------------------------------------
         WEITERE SEKTIONEN
      -------------------------------------------------- */}
      <section id="bento" className="relative">
        <BentoGridSection />
      </section>

      <section id="process" className="relative">
        <ProcessSection />
      </section>

      <section id="testimonials" className="relative">
        <TestimonialsSection />
      </section>

      <section id="faq" className="relative">
        <FaqSection />
      </section>

      <section id="cta" className="relative">
        <CtaSection />
      </section>
    </>
  );
}
