// src/app/page.tsx
import Features from "@/components/Features";
import SocialProof from "@/components/SocialProof";
import SectionDivider from "@/components/SectionDivider";
import FadeIn from "@/components/FadeIn";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection"; // NEU importiert

export default function Home() {
  return (
    <>
      <section className="container pt-24 pb-12 sm:pt-32 sm:pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-base font-semibold leading-7 text-primary">
            Smairys Netz-Manufaktur
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight font-heading sm:text-6xl">
            Wir schmieden Ihre digitale Präsenz. Handgefertigt & Performant.
          </h1>
          <p className="mt-6 text-lg leading-8 text-foreground/80">
            Premium-Websites und gezieltes SEO, die nicht nur beeindrucken,
            sondern nachhaltig Kundenanfragen und Umsatz generieren.
          </p>
          <div className="flex items-center justify-center mt-10 gap-x-6">
            <a
              href="#"
              className="px-4 py-3 text-sm font-semibold rounded-md shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Kostenloses Erstgespräch anfordern
            </a>
            <a href="#" className="text-sm font-semibold leading-6">
              Mehr erfahren <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <FadeIn>
        <SocialProof />
      </FadeIn>
      <FadeIn>
        <Features />
      </FadeIn>

      <section className="relative py-24 bg-primary sm:py-32 text-primary-foreground">
        <SectionDivider className="top-0 -mt-px text-background" />
        <FadeIn className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold tracking-tight font-heading sm:text-5xl">
              Wir sind Ihr strategischer Partner für die digitale Zukunft Ihres
              Unternehmens.
            </h2>
          </div>
        </FadeIn>
        <SectionDivider className="bottom-0 -mb-px rotate-180 text-background" />
      </section>

      <ProcessSection />
      <TestimonialsSection />

      {/* NEUE "FAQ" Sektion */}
      <FaqSection />
    </>
  );
}
