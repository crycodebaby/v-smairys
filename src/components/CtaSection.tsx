"use client";

import FadeIn from "@/components/FadeIn";

const CAL_URL = "/kontakt";

export default function CtaSection() {
  return (
    <section
      id="kontakt"
      className="relative overflow-hidden isolate scroll-mt-28"
      aria-labelledby="cta-heading"
    >
      {/* 🌇 Atmosphärischer Hintergrund */}
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10">
        {/* sanfter vertikaler Verlauf */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/90 to-background/95" />

        {/* 🔥 Warm Glow unten – Emotion */}
        <div
          className="absolute bottom-0 left-1/2 h-[40rem] w-[60rem] -translate-x-1/2 rounded-[100%] blur-[140px]
          bg-[radial-gradient(closest-side,hsl(var(--primary))/0.12,transparent)] dark:bg-[radial-gradient(closest-side,hsl(var(--primary))/0.18,transparent)]"
        />

        {/* 💨 Cooler Nebel oben – Kontrast */}
        <div
          className="absolute top-0 left-1/2 h-[22rem] w-[50rem] -translate-x-1/2 rounded-[100%] blur-[100px]
          bg-[radial-gradient(closest-side,hsl(var(--brand-blue))/0.12,transparent)] dark:bg-[radial-gradient(closest-side,hsl(var(--brand-blue))/0.2,transparent)]"
        />

        {/* 🕳️ Dynamische Vignette simuliert Tiefe */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_65%,rgba(0,0,0,0.12)_100%)] mix-blend-multiply dark:mix-blend-screen transition-all duration-700" />

        {/* ✨ Partikelstaub für subtile Bewegung */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay animate-[pulse_10s_ease-in-out_infinite]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='linear' slope='0.8'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
      </div>

      {/* 💎 Inhalt */}
      <FadeIn className="relative z-10">
        <div className="container py-28 sm:py-32 md:py-36">
          <div
            className="mx-auto max-w-3xl rounded-2xl border border-white/10
                       bg-background/45 backdrop-blur-2xl ring-1 ring-black/5
                       shadow-[0_14px_48px_-12px_rgba(0,0,0,0.45)]
                       dark:border-white/10 dark:bg-background/25
                       dark:shadow-[0_18px_64px_-14px_rgba(0,0,0,0.65)]"
          >
            <div className="px-6 py-12 text-center sm:px-10 sm:py-14 md:px-14">
              <h2
                id="cta-heading"
                className="text-3xl font-bold tracking-tight font-heading sm:text-4xl md:text-5xl"
              >
                Bereit, das nächste Kapitel deiner Marke zu schreiben?
              </h2>

              <p className="max-w-2xl mx-auto mt-4 text-base leading-7 text-foreground/85 sm:mt-6 sm:text-lg">
                Ich entwickle Websites, die sich wie deine Marke anfühlen:
                persönlich, präzise und mit Substanz. Lass uns herausfinden, was
                deine Vision verdient.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row">
                <a
                  href={CAL_URL}
                  className="inline-flex items-center justify-center w-full sm:w-auto px-7 py-3 text-sm sm:text-base font-semibold rounded-md shadow-sm bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:scale-[1.02]"
                >
                  Jetzt Gespräch vereinbaren
                </a>
                <a
                  href="#prozess"
                  className="inline-flex items-center justify-center px-7 py-3 text-sm sm:text-base font-semibold rounded-md border border-border/70 bg-background/60 text-foreground shadow-sm hover:border-foreground/25 transition-all duration-300 hover:scale-[1.01]"
                >
                  Mehr über meine Arbeitsweise
                </a>
              </div>

              <p className="mx-auto mt-5 max-w-xs text-[11px] leading-snug text-foreground/60 sm:text-xs">
                Direkt mit Robin Schmeiries · kein Vertrieb, keine Agentur
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ✨ Licht-Schnitt, der das „Logo-Versinken“ betont */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-48 transition-all duration-700 pointer-events-none bg-gradient-to-t from-background via-background/60 to-transparent dark:from-background/80 dark:via-background/40"
      />
    </section>
  );
}
