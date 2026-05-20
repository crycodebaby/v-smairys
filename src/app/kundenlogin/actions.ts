"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  INTERN_SESSION_COOKIE,
  createSessionToken,
  isInternAuthConfigured,
  verifyPin,
} from "@/lib/auth/intern-session";
import {
  checkPinRateLimit,
  registerPinFailure,
  resetPinRateLimit,
} from "@/lib/auth/pin-rate-limit";

const SAFE_NEXT_DEFAULT = "/intern/marketing";

export type LoginActionResult =
  | { ok: true }
  | {
      ok: false;
      reason:
        | "missing"
        | "invalid"
        | "not-configured"
        | "rate-limited"
        | "unknown";
      retryAfterSeconds?: number;
    };

function sanitizeNext(next: string | null | undefined): string {
  if (!next || typeof next !== "string") return SAFE_NEXT_DEFAULT;
  // Schutz vor Open-Redirect: nur lokale Pfade auf /intern/* erlauben.
  if (!next.startsWith("/intern")) return SAFE_NEXT_DEFAULT;
  // Verbiete protocol-relative URLs („//evil.com").
  if (next.startsWith("//")) return SAFE_NEXT_DEFAULT;
  return next;
}

async function clientKey(): Promise<string> {
  // Wir nutzen ausschließlich Header-Hinweise – kein PII-Logging.
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  const realIp = h.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

/**
 * Server Action für die PIN-Verifikation.
 *
 * - Liest `pin` und `next` aus dem FormData.
 * - Prüft Rate-Limit BEVOR der PIN überhaupt verglichen wird.
 * - Bei Erfolg: setzt httpOnly-Cookie und redirected zur Ziel-Route.
 * - Bei Misserfolg: Rückgabe-Objekt mit Grund (kein Throw, kein Redirect).
 *
 * `redirect()` darf nur OUTSIDE eines try/catch aufgerufen werden, weil
 * Next.js dafür intern eine spezielle Exception nutzt.
 */
export async function loginWithPin(
  _prev: LoginActionResult | null,
  formData: FormData
): Promise<LoginActionResult> {
  const pinRaw = formData.get("pin");
  const nextRaw = formData.get("next");
  const next = sanitizeNext(typeof nextRaw === "string" ? nextRaw : null);

  if (!isInternAuthConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  if (typeof pinRaw !== "string" || pinRaw.trim() === "") {
    return { ok: false, reason: "missing" };
  }
  // Server-seitige Längenbegrenzung – Schutz gegen Garbage-Payloads.
  if (pinRaw.length > 64) {
    return { ok: false, reason: "invalid" };
  }

  const key = await clientKey();
  const rate = checkPinRateLimit(key);
  if (!rate.allowed) {
    return {
      ok: false,
      reason: "rate-limited",
      retryAfterSeconds: rate.retryAfterSeconds,
    };
  }

  const result = verifyPin(pinRaw);
  if (!result.ok) {
    if (result.reason === "not-configured") {
      return { ok: false, reason: "not-configured" };
    }
    const after = registerPinFailure(key);
    if (!after.allowed) {
      return {
        ok: false,
        reason: "rate-limited",
        retryAfterSeconds: after.retryAfterSeconds,
      };
    }
    return { ok: false, reason: "invalid" };
  }

  // Erfolg: Rate-Limit zurücksetzen + Cookie setzen.
  resetPinRateLimit(key);

  const token = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set({
    name: INTERN_SESSION_COOKIE.name,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: INTERN_SESSION_COOKIE.maxAgeSeconds,
  });

  // `redirect()` aus next/navigation wirft intern – muss außerhalb von try/catch
  // stehen. Wir landen hier nur im Erfolgsfall.
  redirect(next);
}

/** Logout: Cookie löschen und zur Startseite redirecten. */
export async function logoutIntern(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(INTERN_SESSION_COOKIE.name);
  redirect("/");
}
