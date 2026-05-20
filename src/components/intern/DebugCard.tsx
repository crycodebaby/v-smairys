import { GlassCard } from "@/components/ui/glass/GlassCard";
import { isInternAuthConfigured } from "@/lib/auth/intern-session";

type EnvCheck = {
  label: string;
  present: boolean;
  hint?: string;
};

function envIsPresent(name: string): boolean {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Debug-Karte fürs interne Dashboard.
 *
 * - Zeigt **nur Anwesenheit** der relevanten ENV-Variablen, niemals deren Wert.
 * - Liefert sofortiges Feedback, ob die Production-Configuration vollständig
 *   ist, ohne Secrets in die UI durchzureichen.
 */
export function DebugCard({
  campaignsLoaded,
  campaignsCount,
}: {
  campaignsLoaded: boolean;
  campaignsCount: number;
}) {
  const checks: EnvCheck[] = [
    {
      label: "ADMIN_DASHBOARD_PIN",
      present: isInternAuthConfigured(),
      hint: "PIN für den /kundenlogin-Zugang.",
    },
    {
      label: "ADMIN_DASHBOARD_SECRET",
      present: envIsPresent("ADMIN_DASHBOARD_SECRET"),
      hint: "Optional. Wenn leer, wird das Session-Secret aus dem PIN abgeleitet.",
    },
    {
      label: "NEXT_PUBLIC_PLAUSIBLE_DOMAIN",
      present: envIsPresent("NEXT_PUBLIC_PLAUSIBLE_DOMAIN"),
      hint: "Domain, die in Plausible angelegt ist.",
    },
    {
      label: "NEXT_PUBLIC_PLAUSIBLE_SRC",
      present: envIsPresent("NEXT_PUBLIC_PLAUSIBLE_SRC"),
      hint:
        "Optional. Standard ist `script.exclusions.js` für /intern-Ausschluss.",
    },
    {
      label: "NEXT_PUBLIC_SITE_URL",
      present: envIsPresent("NEXT_PUBLIC_SITE_URL"),
      hint: "Origin für QR-Link- und UTM-URL-Konstruktion.",
    },
    {
      label: "Supabase (NEXT_PUBLIC_SUPABASE_URL)",
      present: envIsPresent("NEXT_PUBLIC_SUPABASE_URL"),
      hint: "Aktuell nicht genutzt – bleibt zur Vorhaltung dokumentiert.",
    },
  ];

  return (
    <GlassCard
      label="System"
      title="Debug & Konfiguration"
      description="Nur Anwesenheit relevanter Umgebungsvariablen – keine Werte werden angezeigt."
      emphasis="subtle"
    >
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <li className="flex items-center justify-between gap-3 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs">
          <span className="font-mono text-foreground/80">Kampagnen geladen</span>
          <StatusPill ok={campaignsLoaded} okLabel={`${campaignsCount}`} />
        </li>
        {checks.map((check) => (
          <li
            key={check.label}
            className="flex items-center justify-between gap-3 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs"
          >
            <span
              className="font-mono text-foreground/80"
              title={check.hint}
            >
              {check.label}
            </span>
            <StatusPill ok={check.present} />
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] text-foreground/55">
        Keine Secrets werden geloggt oder ausgegeben. Das System prüft nur
        per <code className="font-mono">typeof === "string"</code> und Länge {">"} 0.
      </p>
    </GlassCard>
  );
}

function StatusPill({
  ok,
  okLabel = "ja",
}: {
  ok: boolean;
  okLabel?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
        ok ? "bg-emerald-400/20 text-emerald-200" : "bg-red-400/20 text-red-200"
      }`}
    >
      {ok ? okLabel : "nein"}
    </span>
  );
}
