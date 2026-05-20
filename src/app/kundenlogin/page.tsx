import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  INTERN_SESSION_COOKIE,
  PIN_LENGTH,
  isInternAuthConfigured,
  verifySessionToken,
} from "@/lib/auth/intern-session";
import { GlassPanel } from "@/components/ui/glass/GlassPanel";
import { ToolbarBrand } from "@/components/ui/glass/Toolbar";
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

// Bewusst dynamic: liest Cookies + ENV. Soll nie statisch gecached werden.
export const dynamic = "force-dynamic";

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

  const cookieStore = await cookies();
  const existing = cookieStore.get(INTERN_SESSION_COOKIE.name)?.value;
  const verification = await verifySessionToken(existing);
  if (verification.valid) {
    redirect(next);
  }

  const configured = isInternAuthConfigured();

  return (
    <div className="chroma-stage relative min-h-[100svh] overflow-hidden bg-background text-foreground">
      {/* Zusätzlicher statischer Light-Layer hinter den animierten Blobs.
          Sorgt dafür, dass auch bei prefers-reduced-motion ein vollwertiges
          Chroma-Hintergrundbild bleibt. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -left-32 -top-32 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(closest-side,hsl(265_85%_55%/0.25),transparent_70%)] blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,hsl(330_85%_55%/0.20),transparent_70%)] blur-3xl" />
        <div className="absolute left-1/2 bottom-[-12rem] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(195_90%_55%/0.18),transparent_70%)] blur-3xl" />
      </div>

      {/* Dezente Vignette für Tiefe und Lesbarkeit der Schrift gegen den
          farbigen Chroma-Hintergrund. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(closest-side_at_50%_60%,transparent_50%,rgba(0,0,0,0.55)_100%)]"
      />

      <main className="mx-auto flex min-h-[100svh] w-full max-w-md flex-col items-stretch justify-center px-5 py-12 sm:max-w-lg sm:px-6">
        <div className="mb-6 flex flex-col items-center gap-4">
          <ToolbarBrand label="Smairys · Intern" sublabel="Geschützter Bereich" />
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Kundenlogin</h1>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-foreground/65">
              Bitte den 4-stelligen PIN eingeben. Die Sitzung gilt 7 Tage.
            </p>
          </div>
        </div>

        <GlassPanel emphasis="strong" className="px-5 py-7 sm:px-8 sm:py-10">
          {!configured ? (
            <div className="py-6 text-center">
              <p className="text-sm text-rose-200">
                Der Login ist serverseitig nicht konfiguriert.
              </p>
              <p className="mt-2 text-xs text-foreground/60">
                Bitte <code className="font-mono">ADMIN_DASHBOARD_PIN</code>{" "}
                in den Umgebungsvariablen setzen.
              </p>
            </div>
          ) : (
            <PinForm pinLength={PIN_LENGTH} next={next} />
          )}
        </GlassPanel>

        <p className="mt-6 text-center text-[11px] text-foreground/45">
          Dieser Bereich ist nicht für Endkunden gedacht. Kontaktanfragen über{" "}
          <a href="/kontakt" className="underline decoration-foreground/30 underline-offset-2 hover:text-foreground">
            /kontakt
          </a>
          .
        </p>
      </main>
    </div>
  );
}
