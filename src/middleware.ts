import { NextResponse, type NextRequest } from "next/server";
import {
  INTERN_SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/auth/intern-session";

/**
 * Middleware-Schutz für alle internen Routen.
 *
 * - Greift NUR auf `/intern/*`. Öffentliche Seiten bleiben unberührt.
 * - Token-Verifikation läuft auf der Edge-Runtime über Web Crypto.
 * - Bei fehlendem/ungültigem Token erfolgt 307-Redirect nach `/kundenlogin?next=<original>`.
 * - Keine Loggings mit Secrets/Cookie-Inhalten.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Wir matchen nur /intern/*. Der `config.matcher` unten begrenzt das
  // schon, aber wir lassen den Guard hier explizit zur Sicherheit.
  if (!pathname.startsWith("/intern")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(INTERN_SESSION_COOKIE.name)?.value;
  const verification = await verifySessionToken(token);

  if (verification.valid) {
    const response = NextResponse.next();
    // Verhindert, dass interne Seiten von Browsern/CDNs gecached werden.
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/kundenlogin";
  loginUrl.search = "";
  // `next` darf nur intern relative Pfade enthalten – Schutz gegen Open Redirect.
  const safeNext = pathname.startsWith("/intern") ? pathname + search : "/intern/marketing";
  loginUrl.searchParams.set("next", safeNext);

  return NextResponse.redirect(loginUrl, { status: 307 });
}

export const config = {
  matcher: ["/intern/:path*"],
};
