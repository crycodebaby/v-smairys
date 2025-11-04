// src/lib/testimonialsData.ts
export interface Testimonial {
  name: string;
  title: string;
  company: string;
  // Logos: entweder ein einzelnes oder zwei Varianten (Light/Dark)
  logoSingle?: string;
  logoLight?: string;
  logoDark?: string;
  quote: string;
  story: string;
  url: string;
  kpi: string;
  timeframe?: string;
  services?: string[];
}

export const testimonialsData: Testimonial[] = [
  {
    name: "Alexander Ergart",
    title: "Geschäftsführer",
    company: "Ergart GmbH",
    // Nur ein blaues Logo, das in Light & Dark funktioniert
    logoSingle: "/testimonials/ergart-logo.png",
    quote: "Von Platz 64 auf 1 bei Google, 300 Prozent mehr Traffic.",
    story:
      "Als Handwerksmeister hatte ich weder Zeit noch Ahnung von Webdesign. Smairys hat Website, SEO und KI-Tools umgesetzt. Nach drei Monaten ranken wir bei wichtigen Suchbegriffen auf Platz 1.",
    url: "https://alexander-ergart.de",
    kpi: "+300% Website-Traffic",
    timeframe: "in 3 Monaten",
    services: ["Webentwicklung", "SEO", "Backlinks", "Google Business Profil"],
  },
  {
    name: "Martin Sonsuz",
    title: "Inhaber",
    company: "Eppelstyle",
    logoLight: "/testimonials/eppelstyle-schwarz.png",
    logoDark: "/testimonials/eppelstyle-weiß.png",
    quote:
      "Eine Website so stylish wie der Salon und viermal so viele Online-Termine.",
    story:
      "Modernes Design mit sauberer Technik. Dazu ein KI-Chatbot und ein Buchungstool. Neukundinnen buchen jetzt direkt online und der Kalender ist voll.",
    url: "https://eppelstyle.de",
    kpi: "4x mehr Online-Buchungen",
    services: ["Webentwicklung", "UX", "Buchungstool", "Automationen"],
  },
  {
    name: "Andreas Crncic",
    title: "Gründer und Geschäftsführer",
    company: "Crncic Bausanierung GmbH",
    logoLight: "/testimonials/crncic-schwarz.png",
    logoDark: "/testimonials/crncic-weiß.png",
    quote:
      "SEO auf hohem Niveau, Online Präsenz perfektioniert, 140 Prozent mehr Anfragen.",
    story:
      "Kompletter Neuauftritt mit technischer SEO, klarer Content-Struktur und Performance-Boost. Sichtbarkeit gestiegen, Anfragen deutlich nach oben.",
    url: "https://www.crncic-bausanierung.de/",
    kpi: "+140% Projektanfragen",
    services: ["Webentwicklung", "SEO", "Performance", "Automationen"],
  },
];
