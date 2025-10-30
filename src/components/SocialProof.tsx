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
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            id="socialproof-heading"
            className="text-sm font-semibold tracking-wider uppercase text-foreground/60"
          >
            Vertrauensvoller Partner für ambitionierte Unternehmen
          </h2>

          {/* Frosted Panel: lesbar, lässt 3D durchscheinen */}
          <div
            className="
              mx-auto mt-6 rounded-2xl border border-white/10 bg-background/40
              backdrop-blur-md ring-1 ring-black/5
              shadow-[0_8px_32px_-8px_rgba(0,0,0,0.35)]
              dark:border-white/5 dark:bg-background/25 dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]
            "
          >
            {/* Hairline */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

            <div className="px-4 py-6 sm:px-6 sm:py-8">
              {/* Gleichmäßiges Raster; alle Logos fluchten */}
              <div className="grid items-center grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 sm:gap-x-8 sm:gap-y-8">
                {logos.map((logo) => (
                  <figure
                    key={logo.name}
                    className="relative flex items-center justify-center w-full h-24 sm:h-28"
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

            {/* Hairline */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
