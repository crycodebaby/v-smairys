// src/lib/testimonialsData.ts
export interface Testimonial {
  name: string;
  title: string;
  company: string;
  // logoPath: string; // Ersetzen wir durch ein prominenteres Bild
  imagePath: string; // Ein zentrales, großes Bild für jede Karte
  quote: string;
  story: string;
  url: string; // Die URL zum Live-Projekt
  kpi: string; // Der wichtigste Key Performance Indicator
}

export const testimonialsData: Testimonial[] = [
  {
    name: "Alexander Ergart",
    title: "Geschäftsführer",
    company: "Ergart GmbH",
    imagePath: "/testimonials/ergart-logo.png",
    quote: "Von Platz 64 auf 1 bei Google, und 300 % mehr Traffic!",
    story:
      "Als Handwerksmeister hatte ich weder Zeit noch Ahnung von Webdesign. Die Netz-Manufaktur hat nicht nur unsere Website neu gebaut, sondern auch KI-Tools integriert. Nach nur 3 Monaten sind wir bei Top-Suchbegriffen auf Platz 1 gesprungen.",
    url: "https://alexander-ergart.de",
    kpi: "+300% mehr Website-Traffic",
  },
  {
    name: "Martin Sonsuz",
    title: "Inhaber",
    company: "Eppelstyle",
    imagePath: "/testimonials/eppelstyle-logo.png", // Placeholder, ideal wäre ein Bild vom Salon oder der Website
    quote:
      "Endlich eine Website, die so stylish ist wie mein Salon, mit KI-Buchungstool für viermal so viele Termine.",
    story:
      "Mein altes Design war veraltet. Die Netz-Manufaktur hat mir ein modernes, responsives Design und smarte Features wie einen KI-Chatbot und ein automatisches Buchungstool eingerichtet. Neue Kundinnen buchen jetzt direkt online.",
    url: "https://eppelstyle.de",
    kpi: "4x mehr Online-Buchungen",
  },
  {
    name: "Andreas Crncic",
    title: "Gründer & Geschäftsführer",
    company: "Crncic Bausanierung GmbH",
    imagePath: "/testimonials/crncic-logo.png", // Placeholder, ideal wäre ein Bild vom Team oder einem Projekt
    quote:
      "Eine Vision für meinen professionellen Auftritt SEO-Pro-Level, smarte Automationen und 140 % mehr Anfragen!",
    story:
      "Als Chef einer gewachsenen Bauunternehmung hatte ich nie Zeit für meine Außendarstellung. Die Netz-Manufaktur hat meine Website von Grund auf neu gestaltet: SEO bis Platz 1 und Performance-Boost. Meine Anfragen sind explodiert.",
    url: "https://bauunternehmen.saarland",
    kpi: "+300% mehr Projektanfragen",
  },
];
