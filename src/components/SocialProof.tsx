// src/components/SocialProof.tsx
import React from "react";
import Image from "next/image"; // Importiere die Image-Komponente

const logos = [
  {
    name: "Transistor",
    src: "https://tailwindui.com/img/logos/158x48/transistor-logo-white.svg",
  },
  {
    name: "Reform",
    src: "https://tailwindui.com/img/logos/158x48/reform-logo-white.svg",
  },
  {
    name: "Tuple",
    src: "https://tailwindui.com/img/logos/158x48/tuple-logo-white.svg",
  },
  {
    name: "SavvyCal",
    src: "https://tailwindui.com/img/logos/158x48/savvycal-logo-white.svg",
  },
];

const SocialProof = () => {
  return (
    <section className="container">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
          Vertrauensvoller Partner für ambitionierte Unternehmen
        </p>
        <div className="mt-6 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-4">
          {logos.map((logo) => (
            <Image
              key={logo.name}
              className="h-10 w-full object-contain"
              src={logo.src}
              alt={logo.name}
              width={158}
              height={48}
              unoptimized // Gut für SVGs, die keine Komprimierung brauchen
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
