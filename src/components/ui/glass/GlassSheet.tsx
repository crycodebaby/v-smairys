"use client";

import React, { useEffect, useRef } from "react";

type GlassSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** Sticky-Footer (z. B. Speichern/Abbrechen). */
  footer?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * iPadOS-/Liquid-Glass-inspiriertes Sheet/Dialog.
 *
 * - Mobile: slide-up Bottom-Sheet; ab `sm`: zentrierter Dialog
 * - Backdrop-Blur, Esc schließt, Klick auf Backdrop schließt
 * - Body-Scroll-Lock, Fokus landet im Dialog, role="dialog" aria-modal
 * - Sticky Header + Footer, scrollbarer Inhalt
 */
export function GlassSheet({
  open,
  onClose,
  title,
  description,
  footer,
  children,
}: GlassSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="animate-backdrop-in absolute inset-0 bg-black/55 backdrop-blur-md"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={
          "animate-sheet-in relative flex max-h-[92svh] w-full max-w-2xl flex-col overflow-hidden " +
          "rounded-t-3xl border border-white/12 sm:rounded-3xl " +
          "bg-[hsl(240_18%_9%/0.94)] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.85)] backdrop-blur-2xl " +
          "focus:outline-none"
        }
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,hsl(28_80%_45%/0.20),transparent_70%)] blur-2xl"
        />

        <header className="relative flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-7 sm:py-5">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-foreground/60">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Schließen"
            className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-foreground/70 transition-colors hover:border-white/20 hover:bg-white/[0.1] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45"
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                d="M4 4l8 8M12 4l-8 8"
              />
            </svg>
          </button>
        </header>

        <div className="relative flex-1 overflow-y-auto px-5 py-5 sm:px-7">{children}</div>

        {footer && (
          <footer className="relative flex items-center justify-end gap-3 border-t border-white/10 bg-white/[0.02] px-5 py-4 sm:px-7">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
