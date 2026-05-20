/**
 * Schlanker, typisierter Plausible-Helper.
 *
 * Designziele:
 *  - Keine personenbezogenen Daten senden.
 *  - SSR-safe: nie crashen, wenn `window` fehlt.
 *  - Graceful no-op, wenn das Plausible-Script noch nicht geladen ist
 *    (Plausible installiert in dem Fall selbst eine Queue, wir wrappen das).
 *  - Strikte Typen für die wichtigsten MVP-Events.
 *  - Niemals Events von internen Routen (`/intern/*`, `/kundenlogin`) senden,
 *    selbst wenn ein Tracked-Button dort verwendet wird.
 *
 * Kein Cookie-Tracking, keine User-IDs, keine PII (Mails, Namen, Telefonnummern,
 * IPs etc.) als Property mitgeben. Properties sind ausschließlich Kategorien.
 */

import { isAnalyticsExcludedPath } from "./analytics-config";

// ─── Typen für window.plausible ─────────────────────────────────────────────

type PlausibleEventOptions = {
  /** Callback nach Versandversuch (Erfolg oder Fehler). */
  callback?: () => void;
  /** Plausible 2.x: markiert non-interaktive Events (keine Bounce-Verfälschung). */
  interactive?: boolean;
  /** Plausible-Goal/Revenue (optional, derzeit nicht genutzt). */
  revenue?: { currency: string; amount: number };
  /** Custom Properties – ausschließlich kategoriale Werte. */
  props?: Record<string, string | number | boolean>;
};

type PlausibleFunction = {
  (eventName: string, options?: PlausibleEventOptions): void;
  /** Plausible-internes Queue-Array, bevor das Script geladen ist. */
  q?: unknown[];
};

declare global {
  interface Window {
    plausible?: PlausibleFunction;
  }
}

// ─── Event-Taxonomie (MVP) ──────────────────────────────────────────────────

/**
 * Wo befindet sich ein CTA in der Seite?
 * Bewusst eng gehalten – pro Section/Bereich ein Slot.
 */
export type CtaLocation =
  | "hero"
  | "header"
  | "footer"
  | "services"
  | "process"
  | "trust"
  | "filter"
  | "final-cta"
  | "kontakt"
  | "booking"
  | "reporting"
  | "leistungen";

/**
 * Welcher CTA wurde geklickt?
 * Konsistente Slugs erleichtern Plausible-Auswertung.
 */
export type CtaIdentifier =
  | "hero-primary"
  | "hero-secondary"
  | "header-contact"
  | "footer-mail"
  | "footer-phone"
  | "kontakt-mail"
  | "kontakt-phone"
  | "booking-google-calendar"
  | "services-web"
  | "services-seo"
  | "services-ads"
  | "final-cta-primary"
  | (string & {}); // erlaubt projektspezifische Erweiterung ohne Type-Cast

/**
 * Kontakt-Intent-Typ.
 */
export type ContactIntentType = "phone" | "email" | "booking";

/**
 * Wichtige Section-IDs (für optionales "Section Viewed").
 */
export type SectionId =
  | "hero"
  | "results"
  | "case-study"
  | "services"
  | "faq"
  | "final-cta";

// ─── Property-Typen ─────────────────────────────────────────────────────────

export type CtaClickProps = {
  cta: CtaIdentifier;
  location: CtaLocation;
};

export type ContactIntentProps = {
  type: ContactIntentType;
  location: CtaLocation;
};

export type SectionViewedProps = {
  section: SectionId;
  campaign?: string;
};

// Erlaubte Property-Werte: Plausible akzeptiert string | number | boolean.
type PlausibleProps = Record<string, string | number | boolean>;

export type TrackEventOptions = {
  /**
   * Wenn `false`, wird das Event als non-interactive markiert (keine
   * Bounce-Rate-Verfälschung). Standard: `true`.
   */
  interactive?: boolean;
  /** Callback nach Versand. */
  callback?: () => void;
};

// ─── Core API ───────────────────────────────────────────────────────────────

/**
 * Generischer Event-Sender. Bevorzugt die spezialisierten Helper unten nutzen.
 *
 * - SSR-safe (no-op auf Server).
 * - No-op, wenn `window.plausible` fehlt (z. B. Adblocker, Script geblockt).
 *   In dem Fall queued der Plausible-Snippet das Event allerdings selbst,
 *   sodass es nachträglich gefeuert wird, sobald das Script lädt.
 */
export function trackEvent(
  name: string,
  props?: PlausibleProps,
  options?: TrackEventOptions
): void {
  if (typeof window === "undefined") return;

  // Interne Routen niemals tracken – auch dann nicht, wenn jemand einen
  // Tracked-Button im Dashboard verwendet. Plausibles `data-exclude` ist
  // die Hauptlinie, das hier ist der zweite Sicherheits-Layer.
  if (isAnalyticsExcludedPath(window.location.pathname)) {
    return;
  }

  const plausibleFn = window.plausible;
  if (typeof plausibleFn !== "function") {
    // Kein Plausible verfügbar (geblockt oder noch nicht initialisiert).
    // Bewusst kein Auto-Stub mehr – der Plausible-Snippet hat seinen eigenen.
    return;
  }

  const eventOptions: PlausibleEventOptions = {};
  if (props && Object.keys(props).length > 0) eventOptions.props = props;
  if (options?.interactive === false) eventOptions.interactive = false;
  if (options?.callback) eventOptions.callback = options.callback;

  try {
    plausibleFn(name, eventOptions);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[analytics] trackEvent failed", { name, props, error });
    }
  }
}

// ─── Spezialisierte Helper ──────────────────────────────────────────────────

/** Standard-CTA-Klick. */
export function trackCtaClick(
  props: CtaClickProps,
  options?: TrackEventOptions
): void {
  trackEvent("CTA Click", props, options);
}

/** Kontaktabsicht (mailto / tel / Booking). */
export function trackContactIntent(
  props: ContactIntentProps,
  options?: TrackEventOptions
): void {
  trackEvent("Contact Intent", props, options);
}

/**
 * Section Viewed (non-interactive).
 *
 * Empfohlene Verwendung über IntersectionObserver:
 *  - nur clientseitig
 *  - nur einmal pro Section + Session
 *  - erst feuern wenn >= 50 % sichtbar und ~1000 ms sichtbar geblieben
 */
export function trackSectionViewed(
  props: SectionViewedProps,
  options?: TrackEventOptions
): void {
  trackEvent("Section Viewed", props, {
    interactive: false,
    ...options,
  });
}

/**
 * Hilfs-Helper für mailto/tel Links:
 * Feuert Event und navigiert anschließend zuverlässig weiter.
 *
 * - Falls Plausible nicht verfügbar oder das Callback nicht in ~250 ms feuert,
 *   wird hart navigiert (kein "hängender" Klick).
 * - Verhindert Default-Navigation nur dann, wenn ein Callback realistisch
 *   zustande kommen kann (nicht bei modifier-Keys / mittlerer Maustaste).
 */
export function trackAndNavigate(
  event: React.MouseEvent<HTMLAnchorElement>,
  eventName: string,
  props?: PlausibleProps
): void {
  if (typeof window === "undefined") return;

  // Wenn der User Strg/Shift/Meta hält oder Mittelklick: Browser-Default
  // (neuer Tab etc.) NICHT überschreiben.
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    trackEvent(eventName, props);
    return;
  }

  // Plausible nicht verfügbar -> einfach feuern (no-op) und Browser navigieren lassen.
  if (typeof window.plausible !== "function") {
    trackEvent(eventName, props);
    return;
  }

  const href = event.currentTarget.getAttribute("href");
  if (!href) {
    trackEvent(eventName, props);
    return;
  }

  event.preventDefault();

  let navigated = false;
  const navigate = () => {
    if (navigated) return;
    navigated = true;
    window.location.href = href;
  };

  // Hard-Timeout: wenn Plausible nicht innerhalb von 250 ms callback'd,
  // navigieren wir trotzdem. Verhindert "hängende" mailto/tel Klicks.
  const fallback = window.setTimeout(navigate, 250);

  trackEvent(eventName, props, {
    callback: () => {
      window.clearTimeout(fallback);
      navigate();
    },
  });
}
