// src/components/SocialProof.tsx
import ScrollingLogos from "@/components/ui/ScrollingLogos";

const logos = [
  {
    id: "p1",
    name: "Partner 1",
    image: "/socialproof/socialproof1.png",
    height: "h-7 md:h-9",
  },
  {
    id: "p2",
    name: "Partner 2",
    image: "/socialproof/socialproof2.png",
    height: "h-7 md:h-9",
  },
  {
    id: "p3",
    name: "Partner 3",
    image: "/socialproof/socialproof3.png",
    height: "h-7 md:h-9",
  },
  {
    id: "p4",
    name: "Partner 4",
    image: "/socialproof/socialproof4.png",
    height: "h-7 md:h-9",
  },
  // → empfehlenswert sind 8–12 unterschiedliche Logos
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
            Vertrauenspartner führender Unternehmen
          </h2>

          <div
            className="
              mx-auto mt-6 rounded-2xl border border-border/60 bg-background/60
              backdrop-blur-md shadow-[0_10px_40px_-12px_rgba(0,0,0,0.35)]
              dark:bg-background/35 dark:border-border/40
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
              +112% durchschnittliches Anfragewachstum
            </span>{" "}
            in den ersten 90&nbsp;Tagen nach Relaunch.
          </p>
        </div>
      </div>
    </section>
  );
}
