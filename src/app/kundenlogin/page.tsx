import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  INTERN_SESSION_COOKIE,
  PIN_LENGTH,
  isInternAuthConfigured,
  verifySessionToken,
} from "@/lib/auth/intern-session";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import { PinForm } from "./PinForm";

export const metadata: Metadata = {
  title: "Kundenlogin",
  description: "Interner Login – nur für autorisierte Nutzer.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

type PageProps = {
  searchParams: Promise<{ next?: string }>;
};

function sanitizeNext(next: string | undefined): string {
  const DEFAULT = "/intern/marketing";
  if (!next) return DEFAULT;
  if (next.startsWith("//") || !next.startsWith("/intern")) return DEFAULT;
  return next;
}

export default async function KundenloginPage({ searchParams }: PageProps) {
  const { next: nextParam } = await searchParams;
  const next = sanitizeNext(nextParam);

  // Wenn bereits gültige Session existiert, direkt weiterleiten.
  const cookieStore = await cookies();
  const existing = cookieStore.get(INTERN_SESSION_COOKIE.name)?.value;
  const verification = await verifySessionToken(existing);
  if (verification.valid) {
    redirect(next);
  }

  const configured = isInternAuthConfigured();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Hintergrund-Gradient als Liquid-Glass-Bühne */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -left-32 -top-32 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(closest-side,hsl(0_0%_98%/0.10),transparent_70%)] blur-3xl" />
        <div className="absolute -right-32 bottom-[-12rem] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,hsl(0_0%_98%/0.06),transparent_70%)] blur-3xl" />
      </div>

      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 py-16">
        <div className="mb-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground/55">
            Smairys · Intern
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Kundenlogin
          </h1>
          <p className="mt-2 max-w-xs text-sm text-foreground/60">
            Bitte den 4-stelligen PIN eingeben. Bei Inaktivität wird automatisch
            ausgeloggt.
          </p>
        </div>

        <GlassCard emphasis="strong" className="w-full">
          {!configured ? (
            <div className="py-8 text-center">
              <p className="text-sm text-red-300">
                Der Login ist serverseitig nicht konfiguriert.
              </p>
              <p className="mt-2 text-xs text-foreground/60">
                Bitte <code className="font-mono">ADMIN_DASHBOARD_PIN</code> in
                den Umgebungsvariablen setzen.
              </p>
            </div>
          ) : (
            <PinForm pinLength={PIN_LENGTH} next={next} />
          )}
        </GlassCard>

        <p className="mt-6 text-center text-[11px] text-foreground/45">
          Dieser Bereich ist nicht für Endkunden gedacht. Kontaktanfragen
          bitte über <a href="/kontakt" className="underline">/kontakt</a>.
        </p>
      </main>
    </div>
  );
}
