/**
 * Zentrale Unternehmens- und Site-Konfiguration für die öffentliche Website.
 *
 * Wer hier Daten ändert, ändert sie automatisch in:
 *  - Footer
 *  - Kontaktseite & Kontaktformular-Sektionen
 *  - Impressum
 *  - Datenschutz (Verantwortlicher)
 *  - Tracking-Helper (mailto/tel-Links)
 *
 * Wichtig:
 *  - Telefonnummer wird in zwei Formen geführt: `display` (für Menschen) und
 *    `tel` (für `href="tel:"`, ohne Leerzeichen, mit Ländervorwahl).
 *  - E-Mail wird identisch in `display` und `mailto` geführt.
 *  - `address.lines` ist die postalisch sinnvolle Reihenfolge zum direkten
 *    Rendern (z. B. im Footer / Impressum).
 *  - Diese Datei darf **niemals Secrets enthalten**. Sie wird in den
 *    Client-Bundle gelinkt.
 */

export type SiteContact = {
  /** Wie das Unternehmen geschrieben wird (Firmenname + Slogan). */
  legalName: string;
  shortName: string;
  tagline: string;

  /** Geschäftsführer / Verantwortliche Person. */
  owner: {
    name: string;
    role: string;
  };

  email: {
    /** Anzeigeform (für Mailto + Klartext). */
    display: string;
    /** Vollständiger `mailto:` Wert ohne Subject/Body. */
    mailto: string;
  };

  phone: {
    /** Menschen-lesbar (mit Leerzeichen). */
    display: string;
    /** RFC-3966 / `tel:` Format mit Ländervorwahl, ohne Leerzeichen. */
    tel: string;
  };

  /** Postalische Adresse in Renderzeilen. */
  address: {
    street: string;
    postalCode: string;
    city: string;
    region: string;
    country: string;
    lines: readonly string[];
  };

  social: {
    /** GitHub, LinkedIn etc. – derzeit optional, da nicht öffentlich kommuniziert. */
    github?: string;
    linkedin?: string;
  };

  /**
   * Terminbuchung (primäre Conversion).
   *  - `calendarUrl`: öffentlicher Google-Calendar-Termin-Link (Erstgespräch).
   *  - `enabled`: ob ein echter Buchungslink konfiguriert ist. Wenn `false`,
   *    fallen CTAs auf den Kontaktformular-Anker (`/#kontakt`) zurück.
   */
  booking: {
    calendarUrl: string;
    enabled: boolean;
  };

  /** Stabile DOM-`id` der Kontakt-Sektion (ohne `#`/Pfad). */
  contactSectionId: string;

  /** Anker-Ziel der Kontakt-Sektion auf der Startseite (Form-Fallback-CTA). */
  contactAnchor: string;

  /** Site-Origin (Fallback, falls ENV nicht gesetzt). */
  origin: string;
};

const street = "Zur Steinrausche 22";
const postalCode = "66571";
const city = "Eppelborn";
const region = "Saarland";
const country = "Deutschland";

export const SITE: SiteContact = {
  legalName: "Smairys Netz-Manufaktur",
  shortName: "Smairys",
  tagline: "Premium Webentwicklung, SEO & Ads für den Mittelstand",

  owner: {
    name: "Robin Schmeiries",
    role: "Inhaber",
  },

  email: {
    display: "robin@smairys.de",
    mailto: "mailto:robin@smairys.de",
  },

  phone: {
    display: "+49 160 300 551 8",
    tel: "tel:+4916030055180",
  },

  address: {
    street,
    postalCode,
    city,
    region,
    country,
    lines: [
      "Smairys Netz-Manufaktur",
      "Robin Schmeiries",
      street,
      `${postalCode} ${city}`,
      `${region}, ${country}`,
    ],
  },

  social: {
    // bewusst leer – ergänzen, sobald öffentliche Profile freigegeben sind
  },

  booking: {
    // Kanonischer Google-Calendar-Termin-Link (Erstgespräch).
    // Falls dieser ungültig wird: `enabled: false` setzen → CTAs nutzen
    // automatisch den Kontaktformular-Anker.
    calendarUrl: "https://calendar.app.google/PAdzgiQrN6h5RmqY8",
    enabled: true,
  },

  contactSectionId: "kontakt",
  contactAnchor: "/#kontakt",

  origin: process.env.NEXT_PUBLIC_SITE_URL || "https://smairys.de",
} as const;

/**
 * Liefert das kanonische Ziel für den primären „Erstgespräch buchen"-CTA.
 *  - Wenn ein Buchungslink konfiguriert ist → Google-Calendar-URL (extern).
 *  - Sonst → Kontaktformular-Anker (intern), damit der CTA nie ins Leere führt.
 */
export function getPrimaryBookingTarget(): { href: string; external: boolean } {
  if (SITE.booking.enabled && SITE.booking.calendarUrl) {
    return { href: SITE.booking.calendarUrl, external: true };
  }
  return { href: SITE.contactAnchor, external: false };
}

/**
 * Hilfs-Helper: Liefert die Adresse als Single-Line-String,
 * z. B. für strukturierte Daten oder `<address>`.
 */
export function getAddressInline(): string {
  return `${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}, ${SITE.address.country}`;
}
