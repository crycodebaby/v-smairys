// src/components/SocialProof.tsx
import ScrollingLogos from "@/components/ui/ScrollingLogos";

// Für Logos mit hell/dunkel-Varianten: zwei Einträge mit className-Sichtbarkeit.
// Für Logos ohne Variante (Szalontai): ein Eintrag, der in beiden Themes funktioniert.
const logos = [
  {
    id: "ergart",
    name: "Ergart GmbH",
    image: "/testimonials/ergart-logo.png",
    height: "h-8 md:h-10",
  },
  {
    id: "eppelstyle-light",
    name: "Eppelstyle",
    image: "/testimonials/eppelstyle-schwarz.png",
    height: "h-7 md:h-9",
    className: "dark:hidden",
  },
  {
    id: "eppelstyle-dark",
    name: "Eppelstyle",
    image: "/testimonials/eppelstyle-weiß.png",
    height: "h-7 md:h-9",
    className: "hidden dark:flex",
  },
  {
    id: "crncic-light",
    name: "Crncic Bausanierung GmbH",
    image: "/testimonials/crncic-schwarz.png",
    height: "h-7 md:h-9",
    className: "dark:hidden",
  },
  {
    id: "crncic-dark",
    name: "Crncic Bausanierung GmbH",
    image: "/testimonials/crncic-weiß.png",
    height: "h-7 md:h-9",
    className: "hidden dark:flex",
  },
  {
    id: "szalontai-light",
    name: "Sportgerätevertrieb Szalontai",
    image: "/testimonials/szalontai.png",
    height: "h-8 md:h-10",
    className: "dark:hidden",
  },
  {
    id: "szalontai-dark",
    name: "Sportgerätevertrieb Szalontai",
    image: "/testimonials/szalontai-weiß.png",
    height: "h-8 md:h-10",
    className: "hidden dark:flex",
  },
];

export default function SocialProof() {
  return (
    <section
      id="socialproof"
      className="relative isolate"
      aria-labelledby="socialproof-heading"
    >
      <div className="container text-center">
        <div className="max-w-4xl mx-auto">
          <h2
            id="socialproof-heading"
            className="text-sm font-semibold tracking-wider uppercase text-foreground/70"
          >
            Unternehmen aus Handwerk, Bau und Service in der Region
          </h2>

          <div
            className="
              mx-auto mt-6 rounded-2xl border border-border/60
              bg-background/50 dark:bg-background/30
              shadow-[0_4px_24px_-8px_rgba(0,0,0,0.18)]
              dark:border-border/30
              transition
            "
          >
            <div className="w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

            <div className="px-4 py-6 sm:px-6 sm:py-8">
              <ScrollingLogos
                logos={logos}
                speed="normal"
                direction="left"
                pauseOnHover
                subtle
                className="mx-auto"
              />
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
          </div>

          <p className="mt-5 text-sm text-foreground/70">
            <span className="font-medium text-foreground">
              Kunden seit 2023
            </span>{" "}
            · Region Saarland · Webentwicklung, SEO, Betreuung
          </p>
        </div>
      </div>
    </section>
  );
}
