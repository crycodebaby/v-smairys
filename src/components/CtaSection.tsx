"use client";

import FadeIn from "@/components/FadeIn";
import dynamic from "next/dynamic";

// Use absolute alias so the import always resolves:
const CtaWatermark3D = dynamic(
  () => import("@/components/cta/CtaWatermark3D"),
  { ssr: false }
);

const CAL_URL = "/kontakt";

export default function CtaSection() {
  return (
    <section
      id="kontakt"
      className="relative overflow-hidden isolate scroll-mt-28"
      aria-labelledby="cta-heading"
    >
      {/* 3D watermark sits behind the glass card, above the page background */}
      <CtaWatermark3D />

      {/* Atmosphere: fully transparent, no solid bars */}
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10">
        {/* ultra subtle vertical wash */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.02),transparent_18%,transparent_82%,rgba(0,0,0,0.03))]" />
        {/* brand glows */}
        <div className="absolute -top-24 left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full blur-3xl bg-[radial-gradient(closest-side,theme(colors.primary.DEFAULT)/0.14,transparent)]" />
        <div className="absolute -bottom-24 left-1/3 h-[20rem] w-[20rem] -translate-x-1/2 rounded-full blur-3xl bg-[radial-gradient(closest-side,theme(colors.primary.DEFAULT)/0.12,transparent)]" />
        {/* fine noise to sell the glass look */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='linear' slope='0.8'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
      </div>

      <FadeIn className="relative z-10">
        <div className="container py-20 sm:py-24 md:py-28">
          {/* Liquid / frosted glass card */}
          <div
            className="mx-auto max-w-3xl rounded-2xl border border-white/10
                       bg-background/35 backdrop-blur-xl ring-1 ring-black/5
                       shadow-[0_14px_48px_-12px_rgba(0,0,0,0.55)]
                       dark:border-white/5 dark:bg-background/25 dark:shadow-[0_16px_56px_-14px_rgba(0,0,0,0.7)]"
          >
            {/* hairline top */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

            <div className="px-6 py-10 text-center sm:px-10 sm:py-12 md:px-12 md:py-14">
              <h2
                id="cta-heading"
                className="text-2xl font-bold leading-tight tracking-tight font-heading sm:text-4xl md:text-5xl"
                style={{ textWrap: "balance" }}
              >
                Bereit, Ihre Vision zu verwirklichen?
              </h2>
              <p className="max-w-2xl mx-auto mt-4 text-base leading-7 text-foreground/80 sm:mt-6 sm:text-lg sm:leading-8">
                Lassen Sie uns in einem kostenfreien Gespräch prüfen, ob wir der
                richtige Partner sind – fokussiert, praxisnah und ohne
                Verkaufsdruck.
              </p>

              <div className="flex flex-col items-center justify-center gap-3 mt-8 sm:mt-10 sm:flex-row sm:gap-4">
                <a
                  href={CAL_URL}
                  className="inline-flex items-center justify-center w-full py-3 text-sm font-semibold transition rounded-md shadow-sm bg-primary px-7 text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto sm:text-base"
                >
                  Kostenfreie Potenzialanalyse anfordern
                </a>

                <a
                  href="#prozess"
                  className="inline-flex items-center justify-center py-3 text-sm font-semibold transition border rounded-md shadow-sm border-foreground/15 bg-background/60 px-7 text-foreground backdrop-blur-md hover:border-foreground/25 sm:text-base"
                >
                  Unsere Methode ansehen
                </a>
              </div>

              <p className="mx-auto mt-4 max-w-xs text-[11px] leading-snug text-foreground/65 sm:mt-5 sm:text-xs">
                100&nbsp;% strategisch&nbsp;&middot;&nbsp;0&nbsp;% Verkaufsdruck
              </p>
            </div>

            {/* hairline bottom */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
