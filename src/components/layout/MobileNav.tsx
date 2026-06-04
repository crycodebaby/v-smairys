"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE, getPrimaryBookingTarget } from "@/config/site";
import { TrackedLink } from "@/components/analytics/TrackedLink";

type NavItem = { href: string; label: string };

const NAV_ITEMS: readonly NavItem[] = [
  { href: "/leistungen", label: "Leistungen" },
  { href: "/leistungen/webseiten", label: "Webseiten" },
  { href: "/leistungen/seo", label: "SEO" },
  { href: "/leistungen/google-ads", label: "Google Ads" },
  { href: "/projekte", label: "Projekte" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
];

/**
 * MobileNav
 * ───────────────────────────────────────────────────────────────────────────
 * Hamburger-Drawer für Viewports < md. Auf Desktop bleibt das normale
 * Header-Menü.
 *
 * Eigenschaften:
 *  - Slide-in von rechts, weicher Backdrop (`bg-black/55 backdrop-blur`)
 *  - Body-Scroll-Lock während geöffnet
 *  - ESC schließt
 *  - Schließt automatisch bei Routen-Wechsel (`usePathname`)
 *  - Termin-, Telefon- und E-Mail-CTA prominent, jeweils als eindeutiges
 *    Business-Event tracking-fähig (keine Doppelzählung)
 *  - Brandfarbene Hairline links + Soft-Glow
 *  - `prefers-reduced-motion`: keine Slide-Animation, nur Fade (globals.css
 *    reduziert generell auf 0.01 ms)
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const booking = getPrimaryBookingTarget();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const labelId = useId();

  // Schließe Drawer bei jedem Routen-Wechsel.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // ESC + Body-Scroll-Lock.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Initial-Fokus auf Close-Button für Tastatur-User.
    closeBtnRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Menü öffnen"
        aria-expanded={open}
        aria-controls={labelId}
        className={
          "inline-flex h-10 w-10 items-center justify-center rounded-full " +
          "border border-white/12 bg-white/[0.05] text-foreground/85 backdrop-blur-xl " +
          "transition-[transform,background-color,border-color] duration-200 " +
          "hover:border-white/25 hover:bg-white/[0.10] active:scale-[0.96] " +
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-glow " +
          "md:hidden"
        }
      >
        <BurgerIcon className="h-5 w-5" />
      </button>

      {/* Drawer + Backdrop */}
      <div
        id={labelId}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={
          "fixed inset-0 z-[60] md:hidden " +
          (open ? "pointer-events-auto" : "pointer-events-none")
        }
      >
        {/* Backdrop */}
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label="Menü schließen"
          onClick={() => setOpen(false)}
          className={
            "absolute inset-0 bg-black/55 backdrop-blur-sm transition-opacity duration-300 " +
            (open ? "opacity-100" : "opacity-0")
          }
        />

        {/* Panel */}
        <aside
          className={
            "absolute right-0 top-0 flex h-[100svh] w-[min(92vw,420px)] flex-col " +
            "border-l border-white/10 bg-background/95 text-foreground shadow-[0_30px_100px_-20px_hsl(0_0%_0%/0.8)] " +
            "transition-transform duration-300 ease-out " +
            (open ? "translate-x-0" : "translate-x-full")
          }
        >
          {/* Brand-Linke-Kante */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-6 left-0 w-px bg-gradient-to-b from-transparent via-brand/45 to-transparent"
          />
          {/* Sanfter Brand-Glow oben */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 left-0 right-0 h-32"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 0%, hsl(var(--brand-glow) / 0.25), transparent 75%)",
              filter: "blur(40px)",
            }}
          />

          <header className="flex items-center justify-between px-5 pt-5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-soft">
              Navigation
            </span>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Menü schließen"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-foreground/80 transition-[background-color,border-color,transform] hover:border-white/30 hover:bg-white/[0.10] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-glow"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </header>

          <nav className="mt-4 flex-1 overflow-y-auto px-2">
            <ul className="flex flex-col">
              {NAV_ITEMS.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href + "/"));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={
                        "group flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition-colors " +
                        (active
                          ? "bg-white/[0.06] text-foreground"
                          : "text-foreground/80 hover:bg-white/[0.04] hover:text-foreground")
                      }
                    >
                      <span
                        aria-hidden="true"
                        className={
                          "inline-block h-1.5 w-1.5 rounded-full transition-colors " +
                          (active ? "bg-brand" : "bg-white/15 group-hover:bg-brand/60")
                        }
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <footer className="flex flex-col gap-3 border-t border-white/10 px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            {/* Primäre Conversion: Erstgespräch buchen (Google Calendar). */}
            <TrackedLink
              href={booking.href}
              cta="mobile-nav-booking"
              location="header"
              intent="calendar"
              {...(booking.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand text-sm font-semibold text-brand-foreground shadow-[0_10px_28px_-12px_hsl(var(--brand-glow)/0.7)] hover:bg-brand-soft"
            >
              <CalendarIcon className="h-4 w-4" />
              Erstgespräch buchen
            </TrackedLink>
            <TrackedLink
              href={SITE.phone.tel}
              cta="mobile-nav-phone"
              location="header"
              intent="phone"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/12 bg-white/[0.05] text-sm font-medium text-foreground hover:border-brand/40 hover:text-brand-soft"
            >
              <PhoneIcon className="h-4 w-4" />
              {SITE.phone.display}
            </TrackedLink>
            <TrackedLink
              href={SITE.email.mailto}
              cta="mobile-nav-mail"
              location="header"
              intent="email"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/12 bg-white/[0.05] text-sm font-medium text-foreground hover:border-brand/40 hover:text-brand-soft"
            >
              <MailIcon className="h-4 w-4" />
              Anfrage schreiben
            </TrackedLink>
          </footer>
        </aside>
      </div>
    </>
  );
}

/* ── Icons ───────────────────────────────────────────────────────────── */

function BurgerIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M6 6l12 12M6 18L18 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M7 3v3m10-3v3M3.5 9.5h17M5 6h14a1.5 1.5 0 0 1 1.5 1.5V19A1.5 1.5 0 0 1 19 20.5H5A1.5 1.5 0 0 1 3.5 19V7.5A1.5 1.5 0 0 1 5 6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M6 4h3l1.5 4-2 1.5a12 12 0 0 0 6 6L16 13.5l4 1.5v3a2 2 0 0 1-2 2A14 14 0 0 1 4 6a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M3.5 7.5h17v9a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5v-9Zm0 0L12 13l8.5-5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
