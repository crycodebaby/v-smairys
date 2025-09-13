// src/components/CtaSection.tsx
"use client";

import React from "react";
import FadeIn from "@/components/FadeIn";
import SectionDivider from "@/components/SectionDivider";

export default function CtaSection() {
  return (
    <section
      id="kontakt"
      className="relative overflow-hidden scroll-mt-28 bg-primary text-primary-foreground"
    >
      {/* Divider HINTER dem Inhalt */}
      <div className="absolute inset-x-0 top-0 z-0 pointer-events-none">
        {/* Extra flach auf Mobile, mehr Luft für Text */}
        <SectionDivider className="h-12 sm:h-20 md:h-[120px] text-background" />
      </div>

      <FadeIn className="relative z-10">
        {/* Mehr Top/Bottom-Padding auf Mobile, damit nichts an die Wellen stößt */}
        <div className="container pt-24 pb-24 text-center sm:pt-28 sm:pb-32 md:pt-32 md:pb-40">
          <div className="max-w-2xl mx-auto">
            {/* Kleiner auf Mobile, engere Zeilenhöhe; balancierte Umbrüche */}
            <h2
              className="text-2xl font-bold leading-tight tracking-tight font-heading sm:text-4xl md:text-5xl"
              style={{ textWrap: "balance" }}
            >
              Bereit, Ihre Vision zu verwirklichen?
            </h2>

            <p className="mt-6 text-base leading-7 text-primary-foreground/80 sm:text-lg sm:leading-8">
              Lassen Sie uns in einem kostenfreien Gespräch prüfen, ob wir der
              richtige Partner sind – fokussiert, praxisnah und ohne
              Verkaufsdruck.
            </p>

            <div className="mt-8 sm:mt-10">
              <a
                href="#" // TODO: auf Formular/Calendly/Route setzen
                className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold transition-transform rounded-md shadow-lg bg-background text-primary hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background sm:w-auto sm:px-8 sm:py-4 sm:text-base"
              >
                Kostenfreie Potenzialanalyse anfordern
              </a>

              {/* Mini-Zeile: bewusst sehr klein + knappe Zeilenhöhe + begrenzte Breite */}
              <p className="mx-auto mt-3 max-w-xs text-[11px] leading-snug text-primary-foreground/70 sm:mt-4 sm:text-xs">
                100&nbsp;% strategisch&nbsp;&middot;&nbsp;0&nbsp;% Verkaufsdruck
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="absolute inset-x-0 bottom-0 z-0 rotate-180 pointer-events-none">
        <SectionDivider className="h-12 sm:h-20 md:h-[120px] text-background" />
      </div>
    </section>
  );
}
