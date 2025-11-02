import SocialProof from "@/components/SocialProof";
import BentoGridSection from "@/components/BentoGridSection";
import CtaSection from "@/components/CtaSection";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import { ArrowDown } from "lucide-react";
import BackgroundGrid from "@/components/ui/BackgroundGrid";
import ClientHeroIntro from "@/components/ui/ClientHeroIntro";
import ContrastScrim from "@/components/ui/ContrastScrim";

export default function Home() {
  return (
    <>
      {/* 1) Hero */}
      <section
        id="hero"
        className="relative min-h-[90vh] overflow-hidden py-24 sm:py-32"
      >
        {/* dezentes Grid hinter dem Content */}
        <div className="absolute inset-0 pointer-events-none -z-20">
          <BackgroundGrid />
        </div>

        {/* Client-gesteuertes Intro (3D-Canvas ist global fixed; hier nur der Content) */}
        <ClientHeroIntro>
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto space-y-4">
              <ContrastScrim insetClassName="px-3 py-2" strength={0.6} blur={7}>
                <h1 className="text-4xl font-bold tracking-tight font-heading sm:text-6xl">
                  <span className="text-primary">Verdoppelte Anfragen</span>{" "}
                  durch strategisches SEO.
                  <span className="block mt-2 text-2xl text-foreground/80 sm:mt-4 sm:text-4xl">
                    Unsere Manufaktur-Methode für ambitionierte KMU.
                  </span>
                </h1>
              </ContrastScrim>

              <ContrastScrim
                insetClassName="px-3 py-2"
                strength={0.55}
                blur={7}
              >
                <p className="text-lg leading-8 text-foreground/90">
                  Wir sind keine klassische Agentur. Wir sind Ihr strategischer
                  Partner, der handgefertigte Technologie mit bewährten
                  Wachstumsstrategien verbindet.
                </p>
              </ContrastScrim>

              <div className="flex flex-col items-center justify-center gap-4 mt-6 sm:flex-row">
                {/* Buttons ohne Scrim (meist vollflächig genug) */}…
              </div>
            </div>
          </div>
        </ClientHeroIntro>
      </section>

      {/* Abstand zwischen Hero/3D und SocialProof (atmet je Viewport) */}
      <div className="mt-12 sm:mt-16 lg:mt-24" />

      {/* 1.5) Social Proof – eigene Sektion */}
      <section id="socialproof" className="relative">
        <SocialProof />
      </section>

      {/* 2) Restliche Sektionen – IDs für Section-Acts */}
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
    </>
  );
}
