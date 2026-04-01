"use client";

import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export default function CtaSection() {
  return (
    <section
      id="kontakt"
      className="relative scroll-mt-28"
      aria-labelledby="cta-heading"
    >
      {/* Atmosphärischer Hintergrund */}
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10">
        {/* Warm Glow – nur als Farb-Hauch, kein opaker Gradient */}
        <div className="absolute bottom-0 left-1/2 h-[40rem] w-[60rem] -translate-x-1/2 rounded-[100%] blur-[140px] bg-[radial-gradient(closest-side,hsl(var(--primary)/0.10),transparent)] dark:bg-[radial-gradient(closest-side,hsl(var(--primary)/0.15),transparent)]" />

        {/* Kühler Nebel oben */}
        <div className="absolute top-0 left-1/2 h-[22rem] w-[50rem] -translate-x-1/2 rounded-[100%] blur-[100px] bg-[radial-gradient(closest-side,hsl(var(--brand-blue)/0.08),transparent)] dark:bg-[radial-gradient(closest-side,hsl(var(--brand-blue)/0.14),transparent)]" />
      </div>

      {/* Inhalt */}
      <FadeIn className="relative z-10">
        <div className="container py-28 sm:py-32 md:py-36">
          <div
            className="mx-auto max-w-3xl rounded-2xl border border-border/40
                       bg-background/55 ring-1 ring-black/5
                       shadow-[0_8px_32px_-10px_rgba(0,0,0,0.30)]
                       dark:border-white/8 dark:bg-background/35
                       dark:shadow-[0_12px_48px_-12px_rgba(0,0,0,0.55)]"
          >
            <div className="px-6 py-12 text-center sm:px-10 sm:py-14 md:px-14">
              <h2
                id="cta-heading"
                className="text-3xl font-bold tracking-tight font-heading sm:text-4xl md:text-5xl"
              >
                Bereit für eine Website, die Ihrem Unternehmen wirklich nutzt?
              </h2>

              <p className="max-w-2xl mx-auto mt-4 text-base leading-7 text-foreground/85 sm:mt-6 sm:text-lg">
                Ich entwickle Websites, die Ergebnisse liefern: strukturiert,
                schnell und mit messbarem Effekt. 30 Minuten Erstgespräch –
                kein Pitch, kein Verkaufsdruck.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-7 py-3 text-sm sm:text-base font-semibold rounded-md shadow-sm bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02]"
                >
                  Jetzt Gespräch vereinbaren
                </Link>
              </div>

              <p className="mx-auto mt-5 max-w-xs text-[11px] leading-snug text-foreground/60 sm:text-xs">
                Direkt mit Robin Schmeiries · persönlich, kein Vertrieb
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Licht-Schnitt – transparent, kein opaker background-fill */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-t from-transparent via-transparent to-transparent"
      />
    </section>
  );
}
