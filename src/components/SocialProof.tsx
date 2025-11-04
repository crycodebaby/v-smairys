// src/components/SocialProof.tsx
import Image from "next/image";

const logos = [
  { name: "Partner 1", src: "/socialproof/socialproof1.png" },
  { name: "Partner 2", src: "/socialproof/socialproof2.png" },
  { name: "Partner 3", src: "/socialproof/socialproof3.png" },
  { name: "Partner 4", src: "/socialproof/socialproof4.png" },
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
          {/* Überschrift */}
          <h2
            id="socialproof-heading"
            className="text-sm font-semibold tracking-wider uppercase text-foreground/70"
          >
            Vertrauenspartner führender Unternehmen
          </h2>

          {/* Frosted Panel */}
          <div
            className="
              mx-auto mt-6 rounded-2xl border border-border/60 bg-background/60
              backdrop-blur-md shadow-[0_10px_40px_-12px_rgba(0,0,0,0.35)]
              dark:bg-background/35 dark:border-border/40
              transition
            "
          >
            {/* Hairline oben */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

            <div className="px-4 py-6 sm:px-6 sm:py-8">
              <div className="grid items-center grid-cols-2 logo-mono gap-x-6 gap-y-6 sm:grid-cols-4 sm:gap-x-8 sm:gap-y-8">
                {logos.map((logo) => (
                  <figure
                    key={logo.name}
                    className="relative flex items-center justify-center w-full h-20 sm:h-24 md:h-28"
                    aria-label={logo.name}
                  >
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 220px"
                      className="object-contain p-1.5 sm:p-2 [image-rendering:-webkit-optimize-contrast]"
                      priority={false}
                    />
                  </figure>
                ))}
              </div>
            </div>

            {/* Hairline unten */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
          </div>

          {/* Unterzeile */}
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
