// src/components/legal/LegalLayout.tsx
import Link from "next/link";
import type { ReactNode } from "react";

type Crumb = { label: string; href?: string };

export default function LegalLayout({
  title,
  subtitle,
  breadcrumbs = [{ label: "Startseite", href: "/" }],
  children,
  peerLink, // Cross-Link z. B. { label: "Zum Datenschutz", href: "/datenschutz" }
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  children: ReactNode;
  peerLink?: Crumb;
}) {
  return (
    <section className="relative py-16 isolate sm:py-24">
      {/* Atmosphärischer Hintergrund */}
      <div aria-hidden className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.03),transparent_18%,transparent_82%,rgba(0,0,0,0.04))]" />
        <div className="absolute left-1/2 top-[-6rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full blur-3xl bg-[radial-gradient(closest-side,hsl(var(--primary)/0.12),transparent_70%)]" />
        <div className="absolute right-1/4 bottom-[-8rem] h-[26rem] w-[26rem] rounded-full blur-3xl bg-[radial-gradient(closest-side,hsl(var(--primary)/0.10),transparent_75%)]" />
      </div>

      <div className="container">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-sm">
          <ol className="flex flex-wrap items-center gap-1 text-foreground/70">
            {breadcrumbs.map((c, i) => (
              <li key={i} className="inline-flex items-center gap-1">
                {c.href ? (
                  <Link
                    href={c.href}
                    className="transition-colors hover:text-primary"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page">{c.label}</span>
                )}
                {i < breadcrumbs.length - 1 && (
                  <span className="select-none">/</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Headline */}
        <header className="max-w-3xl mx-auto mt-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight font-heading sm:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="max-w-2xl mx-auto mt-3 text-base text-foreground/80 sm:text-lg">
              {subtitle}
            </p>
          )}
        </header>

        {/* Content Card */}
        <div className="max-w-4xl p-6 mx-auto mt-10 border shadow-sm  rounded-2xl border-border/60 bg-card/80 backdrop-blur-xl sm:p-8">
          {children}

          {/* Cross-Link unten */}
          {peerLink && (
            <div className="pt-6 mt-10 text-sm border-t border-border/60">
              <Link
                href={peerLink.href ?? "#"}
                className="inline-flex items-center rounded-md border border-border/60 bg-background/60 px-3 py-1.5 text-foreground/80 hover:text-primary hover:bg-foreground/5 transition-colors"
              >
                {peerLink.label}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
