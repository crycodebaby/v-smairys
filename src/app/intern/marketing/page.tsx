import type { Metadata } from "next";
import Link from "next/link";
import {
  MARKETING_CAMPAIGNS,
  buildCampaignDestination,
  buildCampaignShortLink,
  getSiteOrigin,
  validateCampaign,
  type CampaignIssue,
  type CampaignStatus,
  type MarketingCampaign,
} from "@/lib/marketing-campaigns";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import { GlassButton } from "@/components/ui/glass/GlassButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { DebugCard } from "@/components/intern/DebugCard";
import { PrintChecklist } from "@/components/intern/PrintChecklist";
import { logoutIntern } from "@/app/kundenlogin/actions";

/**
 * Interne Marketing-Übersicht.
 *
 * - Geschützt durch Middleware (`/intern/*` → PIN-Gate).
 * - `robots: noindex, nofollow, nocache`.
 * - Liest ausschließlich aus der zentralen Campaign-Registry.
 */

export const metadata: Metadata = {
  title: "Intern · Marketing-Kampagnen",
  description: "Interne Übersicht aller Marketing-/Print-Kampagnen.",
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

// Bewusst dynamic: die Debug-Karte liest Runtime-ENV. Außerdem soll diese
// Seite nie gecached werden – sie zeigt internen State.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const STATUS_STYLES: Record<CampaignStatus, string> = {
  draft: "bg-yellow-400/20 text-yellow-200 border border-yellow-400/30",
  active: "bg-emerald-400/20 text-emerald-200 border border-emerald-400/30",
  paused: "bg-orange-400/20 text-orange-200 border border-orange-400/30",
  archived: "bg-zinc-400/20 text-zinc-200 border border-zinc-400/30",
};

function StatusBadge({ status }: { status: CampaignStatus | undefined }) {
  const label = status ?? "—";
  const className = status
    ? STATUS_STYLES[status]
    : "bg-red-400/20 text-red-200 border border-red-400/30";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${className}`}
    >
      {label}
    </span>
  );
}

function IssueBadge({ issue }: { issue: CampaignIssue }) {
  const isError = issue.severity === "error";
  return (
    <li
      className={`rounded-md border px-3 py-2 text-xs leading-snug ${
        isError
          ? "border-red-400/40 bg-red-400/10 text-red-100"
          : "border-amber-400/40 bg-amber-400/10 text-amber-100"
      }`}
    >
      <span className="font-semibold uppercase tracking-wider">
        {isError ? "Fehler" : "Warnung"}
      </span>
      <span className="ml-2 font-mono text-[11px] opacity-70">
        {issue.field}
      </span>
      <div className="mt-1">{issue.message}</div>
    </li>
  );
}

function Field({
  label,
  value,
  mono = false,
  missing = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  missing?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[10px] font-semibold uppercase tracking-widest text-foreground/55">
        {label}
      </dt>
      <dd
        className={`break-all text-sm ${mono ? "font-mono" : ""} ${
          missing ? "text-red-300" : "text-foreground/90"
        }`}
      >
        {missing ? "— FEHLT —" : value}
      </dd>
    </div>
  );
}

type CampaignViewModel = {
  campaign: MarketingCampaign;
  shortLink: string;
  destinationUrl: string;
  issues: CampaignIssue[];
  plausibleUrl: string;
  qrSvgUrl: string;
};

function CampaignSection({ vm }: { vm: CampaignViewModel }) {
  const { campaign, shortLink, destinationUrl, issues, plausibleUrl, qrSvgUrl } = vm;
  const hasErrors = issues.some((i) => i.severity === "error");
  const hasWarnings = issues.some((i) => i.severity === "warning");

  return (
    <GlassCard
      emphasis={hasErrors ? "strong" : "default"}
      className={
        hasErrors
          ? "ring-1 ring-red-400/40"
          : hasWarnings
            ? "ring-1 ring-amber-400/30"
            : ""
      }
      label="Kampagne"
      title={campaign.externalTitle || "(Kein externer Titel)"}
      description={campaign.internalName || "(Kein interner Name)"}
      actions={<StatusBadge status={campaign.status} />}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Linke Spalte: Felder + Action-Buttons + Checklist */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-2">
            <CopyButton
              variant="glass"
              value={shortLink}
              label="QR-Link kopieren"
            />
            <CopyButton
              variant="glass"
              value={destinationUrl}
              label="UTM-Ziel-URL kopieren"
            />
            <CopyButton
              variant="glass"
              value={campaign.utm_campaign}
              label="Plausible-Kampagne kopieren"
            />
            <a
              href={qrSvgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={
                "inline-flex select-none items-center justify-center rounded-full " +
                "border border-white/40 bg-white/55 px-3 py-1.5 text-xs font-medium " +
                "text-foreground/90 backdrop-blur-xl transition-colors " +
                "hover:bg-white/75 dark:border-white/10 dark:bg-white/[0.06] " +
                "dark:hover:bg-white/[0.10]"
              }
            >
              QR-SVG öffnen
            </a>
            <a
              href={plausibleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={
                "inline-flex select-none items-center justify-center rounded-full " +
                "border border-white/40 bg-white/55 px-3 py-1.5 text-xs font-medium " +
                "text-foreground/90 backdrop-blur-xl transition-colors " +
                "hover:bg-white/75 dark:border-white/10 dark:bg-white/[0.06] " +
                "dark:hover:bg-white/[0.10]"
              }
              title={`Filter in Plausible: utm_campaign = ${campaign.utm_campaign}`}
            >
              In Plausible öffnen
            </a>
          </div>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Slug" value={campaign.slug} mono missing={!campaign.slug} />
            <Field
              label="Startdatum"
              value={campaign.startDate ?? "—"}
              mono
            />
            <Field
              label="QR-Link (Druck)"
              value={
                <a
                  href={shortLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-foreground/40 underline-offset-2 hover:text-foreground"
                >
                  {shortLink}
                </a>
              }
              mono
            />
            <Field
              label="Ziel-URL (nach Redirect)"
              value={
                <a
                  href={destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-foreground/40 underline-offset-2 hover:text-foreground"
                >
                  {destinationUrl}
                </a>
              }
              mono
            />
            <Field
              label="UTM Source"
              value={campaign.utm_source}
              mono
              missing={!campaign.utm_source}
            />
            <Field
              label="UTM Medium"
              value={campaign.utm_medium}
              mono
              missing={!campaign.utm_medium}
            />
            <Field
              label="UTM Campaign"
              value={campaign.utm_campaign}
              mono
              missing={!campaign.utm_campaign}
            />
            <Field
              label="UTM Content"
              value={campaign.utm_content}
              mono
              missing={!campaign.utm_content}
            />
          </dl>

          {campaign.notes && (
            <div className="rounded-md border border-white/15 bg-white/5 p-3 text-xs leading-relaxed text-foreground/75">
              <span className="font-semibold uppercase tracking-wider">
                Notiz:
              </span>{" "}
              {campaign.notes}
            </div>
          )}

          {issues.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/55">
                Hinweise
              </h3>
              <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {issues.map((issue, i) => (
                  <IssueBadge key={`${issue.field}-${i}`} issue={issue} />
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-xl border border-white/15 bg-white/5 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/55">
              Vor Druck testen
            </h3>
            <p className="mt-1 text-xs text-foreground/65">
              Diese Liste wird lokal im Browser gespeichert (pro Kampagne).
            </p>
            <div className="mt-4">
              <PrintChecklist campaignSlug={campaign.slug} />
            </div>
          </section>
        </div>

        {/* Rechte Spalte: großer QR-Code */}
        <aside className="flex flex-col gap-3">
          <div className="rounded-xl border border-white/20 bg-white p-3 shadow-inner">
            {/* Wir nutzen das SVG via <img> – simpel, druckbar via "Bild speichern". */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrSvgUrl}
              alt={`QR-Code für Kampagne ${campaign.internalName}`}
              className="block aspect-square w-full"
              width={320}
              height={320}
            />
          </div>
          <p className="text-center font-mono text-[11px] text-foreground/65">
            Codiert: <br />
            <span className="break-all">{shortLink}</span>
          </p>
        </aside>
      </div>
    </GlassCard>
  );
}

export default async function InternMarketingPage() {
  const origin = getSiteOrigin();

  const plausibleHost =
    process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST || "https://plausible.io";
  const plausibleDomain =
    process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "smairys.de";

  const campaigns: CampaignViewModel[] = MARKETING_CAMPAIGNS.map((campaign) => ({
    campaign,
    shortLink: buildCampaignShortLink(campaign, origin),
    destinationUrl: buildCampaignDestination(campaign, origin),
    issues: validateCampaign(campaign),
    qrSvgUrl: `/intern/marketing/${campaign.slug}/qr.svg`,
    plausibleUrl: `${plausibleHost.replace(/\/$/, "")}/${plausibleDomain}?period=30d&filters=${encodeURIComponent(
      `((event:goal==Visit /);(visit:utm_campaign==${campaign.utm_campaign}))`
    )}`,
  }));

  const totalErrors = campaigns.reduce(
    (sum, c) => sum + c.issues.filter((i) => i.severity === "error").length,
    0
  );
  const totalWarnings = campaigns.reduce(
    (sum, c) => sum + c.issues.filter((i) => i.severity === "warning").length,
    0
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-background pb-20 text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -left-32 top-[-12rem] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(closest-side,hsl(0_0%_98%/0.08),transparent_70%)] blur-3xl" />
        <div className="absolute -right-24 bottom-[-12rem] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,hsl(0_0%_98%/0.05),transparent_70%)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pt-16">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="rounded-sm bg-foreground px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-background">
                Intern
              </span>
              <span className="text-xs text-foreground/55">noindex · nofollow · nocache</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Marketing-Kampagnen
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-foreground/70">
              Zentrale Übersicht aller in{" "}
              <code className="font-mono text-foreground/85">
                src/lib/marketing-campaigns.ts
              </code>{" "}
              registrierten Print- und Online-Kampagnen.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-xs">
              <Pill>{`${campaigns.length} Kampagnen`}</Pill>
              <Pill tone={totalErrors ? "error" : "neutral"}>
                {`${totalErrors} Fehler`}
              </Pill>
              <Pill tone={totalWarnings ? "warning" : "neutral"}>
                {`${totalWarnings} Warnungen`}
              </Pill>
            </div>
          </div>

          <form action={logoutIntern}>
            <GlassButton type="submit" size="sm">
              Abmelden
            </GlassButton>
          </form>
        </header>

        <div className="flex flex-col gap-6">
          {campaigns.map((vm) => (
            <CampaignSection key={vm.campaign.slug} vm={vm} />
          ))}
        </div>

        <div className="mt-10">
          <DebugCard
            campaignsLoaded={campaigns.length > 0}
            campaignsCount={campaigns.length}
          />
        </div>

        <footer className="mt-12 border-t border-white/10 pt-6 text-xs text-foreground/55">
          Auswertung in Plausible: Top Sources → Filter{" "}
          <code className="font-mono">utm_campaign</code> nach Kampagnen-Slug
          setzen. Goals (z. B.{" "}
          <code className="font-mono">form_submit_success</code>) zeigen die
          Conversion-Rate je Quelle.{" "}
          <Link href="/" className="underline">
            Zurück zur Startseite
          </Link>
        </footer>
      </div>
    </div>
  );
}

function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "warning" | "error";
}) {
  const toneStyle = {
    neutral: "border-white/20 bg-white/5 text-foreground/80",
    warning: "border-amber-400/30 bg-amber-400/10 text-amber-100",
    error: "border-red-400/30 bg-red-400/10 text-red-100",
  }[tone];
  return (
    <div className={`rounded-full border px-3 py-1 ${toneStyle}`}>{children}</div>
  );
}
