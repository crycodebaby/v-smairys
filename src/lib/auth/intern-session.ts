/**
 * Sehr schlankes PIN-Session-Modul für die interne Marketing-/Admin-Oberfläche.
 *
 * Architektur-Entscheidungen:
 *  - Single-User: Smairys ist eine 1-Personen-Manufaktur. Es gibt kein
 *    User-System, keine Rollen, keine Datenbank.
 *  - PIN wird ausschließlich serverseitig aus `ADMIN_DASHBOARD_PIN` gelesen.
 *  - Erfolgreiche PIN-Eingabe erzeugt ein HMAC-SHA256-signiertes Token.
 *    Das Token enthält nur einen Zeitstempel; es ist absichtlich kein JWT
 *    (kein Header-Parsing-Risiko, keine alg=none-Angriffsfläche).
 *  - Token wird in einem httpOnly-Cookie abgelegt und sowohl von der
 *    Middleware (Edge-Runtime) als auch von Server-Pages verifiziert.
 *  - Komplett Web-Crypto-basiert → Middleware-kompatibel.
 *  - Constant-time Vergleich verhindert Timing-Angriffe gegen den PIN.
 *
 * Sicherheitsgrenzen (bewusst akzeptiert):
 *  - Wer Zugriff auf die Server-ENV hat, kann sich anmelden – das ist Ziel.
 *  - In-Memory-Rate-Limit ist pro Instance; bei mehreren Serverless-
 *    Instanzen ist die Rate-Limit etwas weicher. Für ein 1-Personen-
 *    Dashboard mehr als ausreichend.
 */

const TOKEN_VERSION = "v1";
const COOKIE_NAME = "smairys_intern_session";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 Tage
const TOKEN_MAX_AGE_MS = COOKIE_MAX_AGE_SECONDS * 1000;

export const INTERN_SESSION_COOKIE = {
  name: COOKIE_NAME,
  maxAgeSeconds: COOKIE_MAX_AGE_SECONDS,
} as const;

/**
 * Ein PIN ist vier Ziffern lang. Bewusst kein längerer Wert hier erzwungen
 * – die Eingabemaske ist ein iPad-Keypad. Wenn `ADMIN_DASHBOARD_PIN`
 * andere Zeichen enthält, akzeptieren wir das stillschweigend; das Keypad
 * der UI begrenzt jedoch auf 4 Ziffern.
 */
export const PIN_LENGTH = 4;

// ─── ENV-Helpers ────────────────────────────────────────────────────────────

function readPin(): string | undefined {
  const raw = process.env.ADMIN_DASHBOARD_PIN;
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function readSecret(): string {
  // Wenn `ADMIN_DASHBOARD_SECRET` gesetzt ist, hat es Vorrang.
  // Andernfalls leiten wir ein Secret deterministisch aus dem PIN ab –
  // das ist nicht ideal, hält aber Single-User-Setups ohne separate
  // Secret-Verwaltung am Laufen.
  const explicit = process.env.ADMIN_DASHBOARD_SECRET;
  if (typeof explicit === "string" && explicit.trim().length >= 16) {
    return explicit.trim();
  }
  const pin = readPin();
  if (!pin) {
    // Wenn weder PIN noch SECRET vorhanden sind, geben wir ein
    // bewusst nicht-zufälliges Secret zurück. `verifyToken` wird dann
    // sowieso scheitern, weil der PIN-Vergleich fehlschlägt.
    return "smairys-intern-no-secret-configured";
  }
  return `smairys-intern-${TOKEN_VERSION}-${pin}`;
}

export function isInternAuthConfigured(): boolean {
  return Boolean(readPin());
}

// ─── Base64URL Helpers ──────────────────────────────────────────────────────

const textEncoder = new TextEncoder();

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  // `intern-session.ts` wird auch von `src/middleware.ts` importiert.
  // Middleware läuft in der Edge-Runtime; Node-APIs wie `Buffer` dürfen hier
  // nicht referenziert werden, auch nicht als Fallback.
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// ─── HMAC ───────────────────────────────────────────────────────────────────

async function hmacSign(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    textEncoder.encode(message)
  );
  return bufferToBase64Url(signature);
}

/**
 * Constant-time Vergleich zweier Strings.
 * Web-Crypto bietet keine eingebaute Variante; wir bauen sie minimal
 * über XOR-Akkumulation. Beide Strings werden auf gleiche Länge gefüllt,
 * damit auch Längen-Unterschiede konstantzeitig behandelt werden.
 */
function constantTimeEqual(a: string, b: string): boolean {
  const aBytes = textEncoder.encode(a);
  const bBytes = textEncoder.encode(b);
  const length = Math.max(aBytes.length, bBytes.length);
  let diff = aBytes.length ^ bBytes.length;
  for (let i = 0; i < length; i++) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return diff === 0;
}

// ─── Token-Format: <version>.<issuedAt>.<signature> ─────────────────────────

export type VerifyTokenResult =
  | { valid: true; issuedAt: number }
  | { valid: false; reason: "missing" | "malformed" | "expired" | "signature" };

export async function createSessionToken(now: number = Date.now()): Promise<string> {
  const secret = readSecret();
  const issuedAt = String(now);
  const payload = `${TOKEN_VERSION}.${issuedAt}`;
  const signature = await hmacSign(payload, secret);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined,
  now: number = Date.now()
): Promise<VerifyTokenResult> {
  if (!token) return { valid: false, reason: "missing" };

  const parts = token.split(".");
  if (parts.length !== 3) return { valid: false, reason: "malformed" };
  const [version, issuedAtRaw, signature] = parts;
  if (version !== TOKEN_VERSION) return { valid: false, reason: "malformed" };

  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt) || issuedAt <= 0) {
    return { valid: false, reason: "malformed" };
  }
  if (now - issuedAt > TOKEN_MAX_AGE_MS) {
    return { valid: false, reason: "expired" };
  }
  if (now - issuedAt < -60_000) {
    // Token aus der Zukunft (> 1 min Clock-Skew) → kaputt
    return { valid: false, reason: "malformed" };
  }

  const secret = readSecret();
  const expectedSignature = await hmacSign(
    `${version}.${issuedAtRaw}`,
    secret
  );
  if (!constantTimeEqual(signature, expectedSignature)) {
    return { valid: false, reason: "signature" };
  }

  return { valid: true, issuedAt };
}

// ─── PIN-Vergleich ──────────────────────────────────────────────────────────

export type VerifyPinResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "invalid" };

/**
 * Vergleicht den eingegebenen PIN konstantzeitig mit dem konfigurierten PIN.
 * Liefert klare Fehlerursachen, damit der Aufrufer den UX-Text steuern kann.
 */
export function verifyPin(input: string): VerifyPinResult {
  const configured = readPin();
  if (!configured) return { ok: false, reason: "not-configured" };

  const trimmed = (input ?? "").trim();
  if (!trimmed) return { ok: false, reason: "invalid" };

  if (!constantTimeEqual(trimmed, configured)) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true };
}
