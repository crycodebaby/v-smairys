// src/components/Features.tsx
import { Rocket, Gem, BarChart3, Palette } from "lucide-react"; // Palette Icon importieren
import React from "react";

// Ersetze das alte "features"-Array hiermit:
const features = [
  {
    name: "Premium Web-Entwicklung",
    description:
      "Handgefertigte, performante Websites, die Ihre Marke perfekt repräsentieren und auf modernstem Tech-Stack basieren.",
    icon: <Gem size={24} className="text-primary" />,
  },
  {
    name: "Nachhaltiges SEO",
    description:
      "Wir bringen Sie bei Google nach vorne. Durchdachte Strategien für organisches Wachstum, das bleibt.",
    icon: <BarChart3 size={24} className="text-primary" />,
  },
  {
    name: "Markenidentität & Design",
    description:
      "Stärken Sie Ihr Image mit einem professionellen Auftritt – von der E-Mail-Domain bis zum automatisierten Rechnungsdesign.",
    icon: <Palette size={24} className="text-primary" />, // Neues Icon
  },
];

const Features = () => {
  return (
    <section className="container py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight font-heading sm:text-4xl">
          Ihre Vision, unsere Expertise.
        </h2>
        <p className="mt-6 text-lg leading-8 text-foreground/80">
          Wir sind mehr als nur eine Web-Agentur. Wir sind Ihr strategischer
          Partner für die digitale Zukunft Ihres Unternehmens.
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-none">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                {feature.icon}
                {feature.name}
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-foreground/80">
                <p className="flex-auto">{feature.description}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Features;
