/**
 * Attribution-Modul – First-Touch & Last-Touch.
 *
 * Zweck:
 *  - Marketing-Quellen (UTM-Parameter, Referrer, Landing-Page) sicher zu
 *    Leads zuordnen, damit Print-/QR-/Ad-Kampagnen seriös ausgewertet werden.
 *
 * Designentscheidungen:
 *  - First-Touch landet in `localStorage` und wird NIE überschrieben.
 *    → erlaubt cross-session Attribution, auch wenn der Lead Wochen später
 *      ohne UTM zurückkommt.
 *  - Last-Touch landet in `sessionStorage` und wird in jeder Session
 *    erneuert, sobald neue UTM-Werte reinkommen.
 *  - Es werden **ausschließlich UTM-/Marketing-Daten** gespeichert.
 *    Keine PII (E-Mail, Name, Telefon, IP, User-Agent) im Storage.
 *  - SSR-safe: alle Funktionen prüfen `typeof window === "undefined"`.
 *  - Storage-Versionierung über Keys (`*_v2`), damit alte Strukturen
 *    nicht versehentlich gemerged werden.
 *
 * Datenschutz-Hinweis (s. Datenschutzseite, Abschnitt 3):
 *  - localStorage gilt rechtlich als „ähnlich Cookie", ist aber für
 *    aggregierte Marketing-Auswertung ohne Personenbezug zulässig.
 *  - Werte werden ausschließlich technisch zur Lead-Quellenzuordnung
 *    verwendet, nicht für Profiling.
 */

const FIRST_TOUCH_KEY = "smairys_first_touch_v2";
const LAST_TOUCH_KEY = "smairys_last_touch_v2";

/** Maximale Länge eines Attribution-Feldes (Schutz vor Junk-/Angriffsdaten). */
const MAX_FIELD_LENGTH = 256;

/**
 * Vollständig erfasste Attribution für einen Touchpoint.
 * Alle Felder sind optional – ein Touchpoint ohne UTM (= organisch/direkt)
 * wird trotzdem mit Landing-Page + Referrer protokolliert.
 */
export type AttributionTouch = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  /** Erster vom User aufgerufener Pfad (ohne Query/Hash). */
  landing_page?: string;
  /** `document.referrer` zum Zeitpunkt des Touches (kann leer sein). */
  referrer?: string;
  /** ISO-Timestamp UTC. */
  first_seen_at?: string;
  /** ISO-Timestamp UTC – wird bei Last-Touch fortgeschrieben. */
  last_seen_at?: string;
};

/**
 * Aggregierte Attribution beim Lead-Submit:
 *  - first.*  → erste je gesehene Quelle (persistent)
 *  - last.*   → letzte gesehene Quelle in dieser Session
 */
export type LeadAttribution = {
  first: AttributionTouch;
  last: AttributionTouch;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function sanitizeField(value: string | null | undefined): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  // Hartes Längen-Cap – verhindert "1MB Junk in localStorage"-Szenarien.
  return trimmed.slice(0, MAX_FIELD_LENGTH);
}

function readStorage(
  storage: Storage,
  key: string
): AttributionTouch | undefined {
  try {
    const raw = storage.getItem(key);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") {
      return parsed as AttributionTouch;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function writeStorage(
  storage: Storage,
  key: string,
  data: AttributionTouch
): void {
  try {
    storage.setItem(key, JSON.stringify(data));
  } catch {
    // Quota Exceeded / Private Mode → bewusst silent. Attribution ist
    // best-effort, keine Pflicht-Datenstruktur.
  }
}

function hasAnyUtm(touch: AttributionTouch): boolean {
  return Boolean(
    touch.utm_source ||
      touch.utm_medium ||
      touch.utm_campaign ||
      touch.utm_content ||
      touch.utm_term
  );
}

function readCurrentTouchFromUrl(): AttributionTouch {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const nowIso = new Date().toISOString();

  return {
    utm_source: sanitizeField(params.get("utm_source")),
    utm_medium: sanitizeField(params.get("utm_medium")),
    utm_campaign: sanitizeField(params.get("utm_campaign")),
    utm_content: sanitizeField(params.get("utm_content")),
    utm_term: sanitizeField(params.get("utm_term")),
    landing_page: sanitizeField(url.pathname),
    referrer: sanitizeField(document.referrer),
    first_seen_at: nowIso,
    last_seen_at: nowIso,
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Erfasst First-Touch & Last-Touch auf Basis der aktuellen URL.
 *
 * - First-Touch wird nur einmal gesetzt (localStorage).
 * - Last-Touch wird in dieser Session jedes Mal aktualisiert, sobald neue
 *   UTM-Parameter reinkommen. Direktbesuche ohne UTM überschreiben einen
 *   bestehenden UTM-Last-Touch nicht.
 * - Idempotent + safe, kann mehrfach pro Pageview aufgerufen werden.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  const current = readCurrentTouchFromUrl();

  // First-Touch: dauerhaft, nur initial setzen.
  try {
    const existingFirst = readStorage(window.localStorage, FIRST_TOUCH_KEY);
    if (!existingFirst) {
      writeStorage(window.localStorage, FIRST_TOUCH_KEY, current);
    }
  } catch {
    // localStorage komplett deaktiviert -> ignorieren.
  }

  // Last-Touch: pro Session, aber nur überschreiben, wenn current UTMs hat
  // ODER es bisher gar keinen Last-Touch gibt.
  try {
    const existingLast = readStorage(window.sessionStorage, LAST_TOUCH_KEY);
    const shouldWriteLast = !existingLast || hasAnyUtm(current);
    if (shouldWriteLast) {
      const lastTouch: AttributionTouch = existingLast
        ? {
            ...existingLast,
            ...current,
            // first_seen_at bleibt aus dem ältesten Eintrag, wenn vorhanden
            first_seen_at: existingLast.first_seen_at ?? current.first_seen_at,
            last_seen_at: current.last_seen_at,
          }
        : current;
      writeStorage(window.sessionStorage, LAST_TOUCH_KEY, lastTouch);
    }
  } catch {
    // sessionStorage nicht verfügbar -> ignorieren.
  }
}

/** Liefert First-Touch (oder leeres Objekt, wenn nie gesetzt). */
export function getFirstTouchAttribution(): AttributionTouch {
  if (typeof window === "undefined") return {};
  try {
    return readStorage(window.localStorage, FIRST_TOUCH_KEY) ?? {};
  } catch {
    return {};
  }
}

/** Liefert Last-Touch dieser Session (oder leeres Objekt). */
export function getLastTouchAttribution(): AttributionTouch {
  if (typeof window === "undefined") return {};
  try {
    return readStorage(window.sessionStorage, LAST_TOUCH_KEY) ?? {};
  } catch {
    return {};
  }
}

/**
 * Aggregierte Attribution für die Übergabe an die Lead-API.
 * Wird im Form-Submit eingebettet.
 */
export function getLeadAttribution(): LeadAttribution {
  return {
    first: getFirstTouchAttribution(),
    last: getLastTouchAttribution(),
  };
}

/**
 * Legacy-Kompatibilität: Älterer Code (`src/lib/tracking/events.ts`) ruft
 * `getAttributionData()` und `captureFirstTouchAttribution()` auf.
 * Wir behalten beide Namen, damit nichts bricht.
 */
export function captureFirstTouchAttribution(): void {
  captureAttribution();
}

/**
 * Liefert die für Plausible/GTM nutzbaren UTM-Felder.
 * Priorität: Last-Touch (aktuelle Session) > First-Touch.
 */
export type AttributionData = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
};

export function getAttributionData(): AttributionData {
  if (typeof window === "undefined") return {};

  const last = getLastTouchAttribution();
  const first = getFirstTouchAttribution();

  // Last-Touch hat Vorrang, fällt aber auf First-Touch zurück, wenn leer.
  const merged: AttributionData = {
    utm_source: last.utm_source ?? first.utm_source,
    utm_medium: last.utm_medium ?? first.utm_medium,
    utm_campaign: last.utm_campaign ?? first.utm_campaign,
    utm_content: last.utm_content ?? first.utm_content,
    utm_term: last.utm_term ?? first.utm_term,
    referrer: last.referrer ?? first.referrer,
  };

  // Nicht definierte Felder rausfiltern.
  return Object.fromEntries(
    Object.entries(merged).filter(([, v]) => typeof v === "string" && v !== "")
  ) as AttributionData;
}

/** Storage-Keys offen exportieren – nützlich für Debug-Tools/Tests. */
export const ATTRIBUTION_STORAGE_KEYS = {
  firstTouch: FIRST_TOUCH_KEY,
  lastTouch: LAST_TOUCH_KEY,
} as const;

/** @deprecated Storage-Schlüssel des alten Moduls. Nur für Migrations-Code referenziert. */
export const ATTRIBUTION_KEY = "smairys_attribution";
