/**
 * Zentrale Homepage-Copy (RSC-safe, keine Client-Logik).
 * CTAs verweisen auf bestehende Booking-/Routing-Infrastruktur in den Komponenten.
 */

export const HOMEPAGE_CTA = {
  primary: "Kostenfreie Projektanalyse anfordern",
  secondaryServices: "Leistungen ansehen",
  header: "Erstgespräch buchen",
  bookingCard: "Termin im Kalender reservieren",
  services: {
    web: "Website-Potenzial prüfen",
    seo: "Lokale Marktchancen prüfen",
    ads: "Werbe-ROI bewerten",
  },
} as const;

export const HOMEPAGE_HERO = {
  kicker: "Smairys Netz-Manufaktur",
  headline: "Wir bauen keine Webseiten. Wir bauen digitale Vertriebsmaschinen.",
  subheadline:
    "Smairys Netz-Manufaktur entwickelt Premium-Websites für Unternehmen im Saarland, die nicht nur gut aussehen sollen — sondern Vertrauen aufbauen, Anfragen qualifizieren und den Vertrieb spürbar entlasten.",
} as const;

export const HOMEPAGE_QUALIFICATION = {
  kicker: "Für wen wir arbeiten",
  headline: "Wir sind nicht die richtige Wahl für jeden.",
  paragraphs: [
    "Wenn Sie nur die schnellste oder billigste Website suchen, sind wir vermutlich nicht der passende Partner.",
    "Wir arbeiten mit Unternehmen, die verstanden haben: Eine Website ist kein digitaler Platzhalter. Sie ist ein Verkaufssystem. Sie baut Vertrauen auf, reduziert Einwände und führt Interessenten strukturiert zur Anfrage.",
    "Unsere Arbeit beginnt nicht bei Farben und Animationen. Sie beginnt bei Ihrem Unternehmen, Ihren Kunden und der Frage, warum sich jemand genau für Sie entscheiden sollte.",
  ],
} as const;

export const HOMEPAGE_INDUSTRIES = {
  kicker: "Branchenfokus",
  headline: "Websites für Branchen, in denen Vertrauen verkauft.",
  intro:
    "Ob Immobilien, Handwerk oder Gastronomie: Ihre Website entscheidet oft, ob ein Interessent Vertrauen fasst, weiterklickt oder zur Konkurrenz geht.",
  items: [
    {
      id: "immobilien",
      title: "Immobilien & Verwaltung",
      body: "Ob Immobilienverwaltung, Projektentwickler oder Bauträger: Ihre Website muss Seriosität ausstrahlen, Vertrauen schaffen und Interessenten sauber vorqualifizieren.",
      result:
        "Ein digitaler Auftritt, der hochwertige Objekte, Leistungen und Ansprechpartner professionell präsentiert — und Anfragen erzeugt, bevor das erste Gespräch stattfindet.",
    },
    {
      id: "handwerk",
      title: "Handwerk & Bau",
      body: "Gute Arbeit spricht sich herum. Eine starke Website sorgt dafür, dass dieser Eindruck auch online entsteht. Für Betriebe, die nicht über den billigsten Preis verkaufen, sondern über Qualität, Verlässlichkeit und Vertrauen.",
      result:
        "Mehr qualifizierte Anfragen, weniger Preisshopper und ein Auftritt, der Ihrem tatsächlichen Qualitätsanspruch entspricht.",
    },
    {
      id: "gastronomie",
      title: "Gastronomie",
      body: "Ihre Website entscheidet oft vor dem ersten Besuch, ob ein Gast reserviert, weiterklickt oder zur Konkurrenz geht.",
      result:
        "Ein digitaler Auftritt, der Atmosphäre vermittelt, Reservierungen erleichtert und Besucher bereits beim Scrollen überzeugt.",
    },
  ],
} as const;

export const HOMEPAGE_METHOD = {
  kicker: "Die Methode",
  headline: "Drei Disziplinen. Ein messbares Ziel.",
  intro:
    "Eine hochwertige Website entsteht nicht durch schöne Oberflächen allein. Sie braucht Strategie, technische Präzision und eine klare Führung zur Anfrage.",
  blocks: [
    {
      id: "strategie",
      title: "Strategie & Positionierung",
      body: "Bevor wir gestalten, klären wir, was Ihre Website leisten muss: Wen soll sie überzeugen? Welche Anfragen sind wertvoll? Welche Einwände müssen ausgeräumt werden?",
    },
    {
      id: "design",
      title: "Design & Entwicklung",
      body: "Ihre Kunden entscheiden in Sekunden. Eine langsame, unklare oder veraltete Website kostet jeden Tag Vertrauen und Anfragen. Wir entwickeln hochwertige Websites, die schnell laden, professionell wirken und Besucher gezielt zur Kontaktaufnahme führen.",
    },
    {
      id: "sichtbarkeit",
      title: "Sichtbarkeit & Anfrageführung",
      body: "Eine starke Website ist die Grundlage. Darauf aufbauend schaffen wir die Struktur für lokale Sichtbarkeit, suchstarke Inhalte und messbare Kampagnen — damit kaufbereite Interessenten nicht nur klicken, sondern anfragen.",
    },
  ],
} as const;

export const HOMEPAGE_TRUST = {
  kicker: "Die Manufaktur",
  headline: "Radikale Transparenz. Echtes Handwerk.",
  paragraphs: [
    "Ich bin Robin Schmeiries, Gründer der Smairys Netz-Manufaktur. Mein Anspruch ist einfach: Websites zu bauen, die nicht wie Vorlagen wirken, sondern wie ein echter Bestandteil Ihres Vertriebs.",
    "Wir arbeiten nicht mit Fließband-Designs. Jedes Projekt wird strategisch aufgebaut, technisch sauber umgesetzt und darauf ausgerichtet, messbare Ergebnisse zu ermöglichen.",
    "Wir versprechen keine Wunder. Wir liefern Systematik.",
  ],
  stats: [
    { value: "6+", label: "Jahre exzellente Umsetzung" },
    { value: "100 %", label: "inhabergeführt" },
    { value: "", label: "Fokus auf messbare Anfragen" },
  ],
} as const;

export const HOMEPAGE_PROCESS = {
  kicker: "Der Prozess",
  headline: "Der Weg zu Ihrer digitalen Vertriebsmaschine.",
  steps: [
    {
      num: "01",
      title: "Analyse",
      desc: "Wir prüfen Ihren aktuellen Auftritt, Ihre Zielgruppe und die Stellen, an denen heute Vertrauen, Sichtbarkeit oder Anfragen verloren gehen.",
    },
    {
      num: "02",
      title: "Architektur",
      desc: "Wir entwickeln die Struktur Ihrer Website: Inhalte, Nutzerführung, Seitenlogik und Conversion-Punkte.",
    },
    {
      num: "03",
      title: "Umsetzung",
      desc: "Design und Technik werden zu einem schnellen, hochwertigen und verkaufsorientierten Webauftritt verbunden.",
    },
    {
      num: "04",
      title: "Optimierung",
      desc: "Nach dem Launch messen wir, wie Besucher reagieren, wo Anfragen entstehen und wie Ihr System weiter verbessert werden kann.",
    },
  ],
} as const;

export const HOMEPAGE_BOOKING = {
  kicker: "Strategisches Erstgespräch",
  headline: "Strategisches Erstgespräch",
  copy: [
    "20 Minuten Fokus auf Ihr Unternehmen. Sie schildern Ihre aktuelle Situation, wir prüfen Ziele, Machbarkeit und den sinnvollsten nächsten Schritt.",
    "Kein Verkaufsdruck. Keine Standardpräsentation. Wir arbeiten nur zusammen, wenn es fachlich und menschlich wirklich passt.",
  ],
  meta: [
    "Kostenfreie, ehrliche Einschätzung",
    "Online via Google Meet",
    "20–25 Minuten",
  ],
} as const;

export const HOMEPAGE_PRICING = {
  kicker: "Transparente Investition",
  headline: "Drei Wege zu einer Website, die für Ihr Unternehmen arbeitet.",
  intro:
    "Keine Baukasten-Lösung. Keine Vorlage von der Stange. Sie erhalten eine individuell entwickelte Website, die Strategie, Design und Technik verbindet — passend zu Ihrem Unternehmen, Ihrem Markt und Ihrem Vertriebsziel.",
  note:
    "Alle Preise verstehen sich als Orientierung. Der konkrete Umfang wird im strategischen Erstgespräch geprüft — transparent, ehrlich und ohne Verkaufsdruck.",
  packages: [
    {
      id: "digitales-fundament",
      name: "Digitales Fundament",
      price: "1.299 €",
      positioning:
        "Für lokale Betriebe, die eine hochprofessionelle Präsenz ohne Kompromisse bei Technik, Geschwindigkeit und sauberer Umsetzung suchen.",
      includes: [
        "Next.js High-Speed Architektur",
        "Gehostet auf Vercel für sehr schnelle Ladezeiten",
        "Kompakte Seitenstruktur mit bis zu 3 strategisch aufgebauten Zielseiten",
        "Textliche und visuelle Basis-Gestaltung",
        "Einbindung vorhandener Logos, Bilder und Markenmaterialien",
        "Kontakt- oder Anfrageführung",
        "Domain-Einrichtung, SSL und technisches Basis-Setup",
        "DSGVO-bewusste technische Grundlage",
      ],
      bestFor:
        "Ideal für Unternehmen, die endlich professionell auftreten und online ernst genommen werden wollen.",
      cta: "Einstieg prüfen",
      ctaId: "pricing-digitales-fundament",
      recommended: false,
    },
    {
      id: "performance-system",
      name: "Performance-System",
      badge: "Meistgewählt",
      price: "2.850 €",
      positioning:
        "Für Unternehmen, die ihre Website nicht nur als digitale Präsenz sehen, sondern als aktiven Vertriebs- und Vertrauenskanal.",
      includes: [
        "Alles aus dem Digitalen Fundament",
        "Erweiterte Website-Architektur mit bis zu 8 konversionsstarken Unterseiten",
        "Verkaufspsychologisches Copywriting",
        "Strukturierte Nutzerführung zur Anfrage",
        "Lokale SEO-Grundlage für relevante Suchbegriffe in Ihrer Region",
        "Trust-Elemente, Referenzen und klare Angebotsdarstellung",
        "Integration von Kontakt-, Anfrage- oder Reservierungsstrecken",
        "Consent-gesteuertes Analytics-Fundament zur Messung wichtiger Nutzeraktionen",
        "Launch-Begleitung",
      ],
      bestFor:
        "Die beste Wahl für Unternehmen, die planbar hochwertiger auftreten, qualifizierte Anfragen gewinnen und ihren digitalen Auftritt als Vertriebssystem nutzen wollen.",
      cta: "Projektanalyse anfordern",
      ctaId: "pricing-performance-system",
      recommended: true,
    },
    {
      id: "branchen-autoritaet",
      name: "Branchen-Autorität",
      price: "5.600 €",
      positioning:
        "Das umfangreiche Komplettsystem für Unternehmen mit höherem Anspruch, stärkerem Wettbewerb oder mehreren Zielgruppen, Leistungen und Standorten.",
      includes: [
        "Alles aus dem Performance-System",
        "Erweiterte Seitenarchitektur für mehrere Zielgruppen, Leistungen oder Standorte",
        "Aufbau zusätzlicher Landingpages, Leistungsseiten oder Pillar-Strukturen nach Bedarf",
        "Premium Brand-Identity Feinschliff für ein exklusiveres digitales Erscheinungsbild",
        "Tiefere lokale und überregionale SEO-Struktur",
        "Case-Study- und Referenz-Integration",
        "Erweiterte Lead-Qualifizierung oder Anfrageführung",
        "Vorbereitung für Kampagnen, Google Ads oder laufende Betreuung",
        "CRM- oder Automatisierungs-Anbindung, sofern technisch sinnvoll",
        "Priority Support und strategische Auswertung der ersten 30 Tage nach Launch",
      ],
      bestFor:
        "Für Unternehmen, die ihren digitalen Auftritt als ernsthaften Wachstums- und Autoritätskanal aufbauen wollen.",
      cta: "Manufaktur-Projekt besprechen",
      ctaId: "pricing-branchen-autoritaet",
      recommended: false,
    },
  ],
} as const;

export const HOMEPAGE_FINAL_CTA = {
  kicker: "Nächster Schritt",
  headline: "Bereit für eine Website, die Ihrem Unternehmen gerecht wird?",
  description:
    "Lassen Sie uns herausfinden, wie viel Potenzial aktuell in Ihrem digitalen Auftritt liegt. In der kostenfreien Projektanalyse prüfen wir, wo Sie stehen, was möglich ist und welcher nächste Schritt wirtschaftlich sinnvoll wäre.",
} as const;

export const HOMEPAGE_METADATA = {
  title: "Premium-Websites für Unternehmen im Saarland",
  description:
    "Smairys entwickelt hochwertige Websites für Immobilien, Handwerk und Gastronomie im Saarland — mit Fokus auf Vertrauen, qualifizierte Anfragen und messbare Ergebnisse.",
} as const;
