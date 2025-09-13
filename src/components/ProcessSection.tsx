// src/components/ProcessSection.tsx
import React from "react";
import { ClipboardList, Code, Rocket, TrendingUp } from "lucide-react";
import FadeIn from "./FadeIn";

const processSteps = [
  {
    step: "01",
    title: "Strategie & Konzeption",
    description:
      "Jedes herausragende Projekt beginnt mit einem wasserdichten Plan. Wir analysieren Ihre Ziele, Zielgruppen und den Wettbewerb, um eine maßgeschneiderte digitale Roadmap zu entwickeln.",
    icon: <ClipboardList className="w-12 h-12 text-primary" />,
  },
  {
    step: "02",
    title: "Design & Entwicklung",
    description:
      "Hier wird Ihre Vision zur Realität. Mit pixelgenauem Design und handgefertigtem Code schmieden wir eine Website, die nicht nur beeindruckt, sondern auch auf technischer Exzellenz basiert.",
    icon: <Code className="w-12 h-12 text-primary" />,
  },
  {
    step: "03",
    title: "Launch & SEO-Optimierung",
    description:
      "Der Startschuss für Ihren Erfolg. Wir sorgen für einen reibungslosen Livegang, führen finale Performance-Checks durch und optimieren Ihre Seite für eine Top-Platzierung bei Google.",
    icon: <Rocket className="w-12 h-12 text-primary" />,
  },
  {
    step: "04",
    title: "Wachstum & Betreuung",
    description:
      "Unsere Partnerschaft endet nicht mit dem Launch. Wir stehen Ihnen mit fortlaufendem Support, Wartung und strategischer Beratung zur Seite, um Ihr digitales Wachstum nachhaltig zu sichern.",
    icon: <TrendingUp className="w-12 h-12 text-primary" />,
  },
];

const ProcessSection = () => {
  return (
    <section id="prozess" className="container py-24 scroll-mt-28 sm:py-32">
      <FadeIn>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight font-heading sm:text-4xl">
            Ein Prozess, geschmiedet für Perfektion
          </h2>
          <p className="mt-6 text-lg leading-8 text-foreground/80">
            Wir überlassen nichts dem Zufall. Unser bewährter 4-Stufen-Prozess
            garantiert herausragende Ergebnisse und maximale Transparenz für
            unsere Partner.
          </p>
        </div>
      </FadeIn>

      <div className="relative max-w-3xl mx-auto mt-16">
        {/* Dekorative vertikale Linie */}
        <div
          aria-hidden="true"
          className="absolute w-px h-full left-8 top-8 bg-primary/20"
        />

        <ul className="space-y-12">
          {processSteps.map((item, index) => (
            <FadeIn key={index}>
              <li className="flex items-start gap-x-6">
                <div className="relative flex items-center justify-center flex-none w-16 h-16 rounded-full bg-background ring-2 ring-primary">
                  {item.icon}
                </div>
                <div className="pt-2">
                  <p className="text-xl font-semibold font-heading">
                    {item.title}
                  </p>
                  <p className="mt-2 text-base text-foreground/80">
                    {item.description}
                  </p>
                </div>
              </li>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ProcessSection;
