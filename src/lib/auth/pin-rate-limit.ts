/**
 * In-Memory Rate-Limit für PIN-Versuche.
 *
 * Single-User Setup → kein Redis nötig. Per IP wird die Anzahl der
 * fehlgeschlagenen Versuche innerhalb eines Zeitfensters gezählt. Bei
 * Überschreiten antwortet der Login-Endpunkt mit einer Sperrmeldung,
 * **ohne den PIN selbst zu prüfen** (verhindert Timing-Probing).
 *
 * Bei mehreren Serverless-Instanzen ist das Limit pro Instance lokal.
 * Für ein Dashboard, das eine Person nutzt, ist das ausreichend.
 */

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 Minuten
const LOCKOUT_MS = 15 * 60 * 1000; // 15 Minuten Sperre nach max. Versuchen

type RateLimitRecord = {
  failures: number;
  firstFailureAt: number;
  lockedUntil?: number;
};

const store = new Map<string, RateLimitRecord>();

export type RateLimitResult =
  | { allowed: true; remainingAttempts: number }
  | { allowed: false; retryAfterSeconds: number };

function purgeStaleRecord(record: RateLimitRecord, now: number): boolean {
  if (record.lockedUntil && record.lockedUntil > now) return false;
  if (record.lockedUntil && record.lockedUntil <= now) return true;
  if (now - record.firstFailureAt > WINDOW_MS) return true;
  return false;
}

export function checkPinRateLimit(
  key: string,
  now: number = Date.now()
): RateLimitResult {
  const record = store.get(key);
  if (!record) return { allowed: true, remainingAttempts: MAX_ATTEMPTS };

  if (record.lockedUntil && record.lockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((record.lockedUntil - now) / 1000),
    };
  }

  if (purgeStaleRecord(record, now)) {
    store.delete(key);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  return {
    allowed: true,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - record.failures),
  };
}

/**
 * Registriert einen Fehlversuch. Wenn das Limit erreicht ist, wird
 * automatisch eine Sperre gesetzt.
 */
export function registerPinFailure(
  key: string,
  now: number = Date.now()
): RateLimitResult {
  const existing = store.get(key);
  if (!existing || purgeStaleRecord(existing, now)) {
    const fresh: RateLimitRecord = { failures: 1, firstFailureAt: now };
    store.set(key, fresh);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  existing.failures += 1;
  if (existing.failures >= MAX_ATTEMPTS) {
    existing.lockedUntil = now + LOCKOUT_MS;
    store.set(key, existing);
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil(LOCKOUT_MS / 1000),
    };
  }
  store.set(key, existing);
  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS - existing.failures,
  };
}

export function resetPinRateLimit(key: string): void {
  store.delete(key);
}

export const PIN_RATE_LIMIT_CONFIG = {
  maxAttempts: MAX_ATTEMPTS,
  windowMs: WINDOW_MS,
  lockoutMs: LOCKOUT_MS,
} as const;
