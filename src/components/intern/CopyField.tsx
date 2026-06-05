"use client";

import React, { useCallback, useRef, useState } from "react";

type CopyFieldProps = {
  /** Sichtbares Label (klein, darüber). */
  label: string;
  /** Voller Wert, der kopiert wird (auch wenn die Anzeige truncatet). */
  value: string;
  /** Monospace-Darstellung (für Slugs/URLs/UTMs). */
  mono?: boolean;
  /** Anzeige bricht um statt zu truncaten (für lange URLs). */
  wrap?: boolean;
  className?: string;
};

/**
 * Klickbares Copy-on-Click-Feld (ersetzt separate Copy-Buttons).
 *
 * - Klick/Tap oder Enter/Space kopiert den vollständigen Wert.
 * - Nach dem Kopieren erscheint kurz „Kopiert".
 * - Als `<button>` umgesetzt → von Haus aus fokussierbar & tastaturbedienbar.
 * - SSR-safe: Clipboard-Zugriff nur im Handler, Fallback via Textarea.
 */
export function CopyField({
  label,
  value,
  mono = false,
  wrap = false,
  className = "",
}: CopyFieldProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  const handleCopy = useCallback(async () => {
    if (!value) return;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else if (typeof document !== "undefined") {
        const ta = document.createElement("textarea");
        ta.value = value;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error("[CopyField] Kopieren fehlgeschlagen.", error);
    }
  }, [value]);

  const empty = !value;

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={empty}
      data-copied={copied ? "true" : undefined}
      aria-label={`${label} kopieren`}
      title={empty ? undefined : "Zum Kopieren tippen"}
      className={
        "group relative flex w-full flex-col gap-1 rounded-xl border px-3 py-2.5 text-left " +
        "transition-[background-color,border-color,box-shadow] duration-200 " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand-glow)/0.55)] " +
        (copied
          ? "animate-copy-pulse border-emerald-400/40 bg-emerald-400/[0.1] "
          : "border-white/10 bg-white/[0.035] hover:border-[hsl(var(--brand)/0.4)] hover:bg-white/[0.06] active:scale-[0.995] cursor-pointer ") +
        (empty ? "cursor-not-allowed opacity-60 " : "") +
        className
      }
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
          {label}
        </span>
        <span
          className={
            "inline-flex items-center gap-1 text-[10px] font-medium transition-opacity " +
            (copied
              ? "text-emerald-300"
              : "text-foreground/40 opacity-0 group-hover:opacity-100")
          }
        >
          {copied ? (
            <>
              <CheckIcon /> Kopiert
            </>
          ) : (
            <>
              <CopyIcon /> Kopieren
            </>
          )}
        </span>
      </span>
      <span
        className={
          "text-foreground/85 " +
          (mono ? "font-mono text-xs " : "text-sm ") +
          (wrap ? "break-all leading-snug" : "truncate")
        }
      >
        {empty ? "—" : value}
      </span>
    </button>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        d="M5.5 5.5V3.5h7v7h-2M3.5 5.5h7v7h-7z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.5 8.5l3 3 6-6.5"
      />
    </svg>
  );
}
