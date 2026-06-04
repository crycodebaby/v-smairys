"use client";

import React, { useCallback, useState } from "react";

type CopyButtonProps = {
  /** Wert, der in die Zwischenablage kopiert werden soll. */
  value: string;
  /** Button-Text (auch als aria-label genutzt, sofern kein `ariaLabel`). */
  label: string;
  /** Wird angezeigt, solange `copied`-State aktiv ist (Default: "Kopiert"). */
  successLabel?: string;
  /** Visuelle Variante. */
  variant?: "plain" | "glass" | "tonal";
  /** Größe (Höhe + Padding + Schrift). */
  size?: "xs" | "sm" | "md";
  /** Optional: Icon links. */
  leadingIcon?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  onCopied?: () => void;
};

const SIZE = {
  xs: "h-7 px-2.5 text-[11px] gap-1.5",
  sm: "h-8 px-3 text-xs gap-2",
  md: "h-10 px-4 text-sm gap-2",
} as const;

const VARIANT = {
  plain:
    "border border-border bg-background hover:bg-muted text-foreground rounded-md",
  glass:
    "rounded-full border border-white/10 bg-white/[0.06] text-foreground/85 backdrop-blur-xl hover:border-white/20 hover:bg-white/[0.12]",
  tonal:
    "rounded-full border border-white/15 bg-white/[0.12] text-foreground backdrop-blur-xl hover:border-white/25 hover:bg-white/[0.18]",
} as const;

/**
 * Wiederverwendbarer Copy-to-Clipboard-Button.
 *
 * - SSR-safe (Clipboard nur im Handler).
 * - 2-Sek-Feedback ("Kopiert"); Fallback via versteckter Textarea.
 * - Drei optische Varianten (`plain`, `glass`, `tonal`).
 * - Subtile Microinteraction: Hover-Shift + Press-Skalierung.
 */
export function CopyButton({
  value,
  label,
  successLabel = "Kopiert",
  variant = "glass",
  size = "sm",
  leadingIcon,
  className = "",
  ariaLabel,
  onCopied,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else if (typeof document !== "undefined") {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      onCopied?.();
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("[CopyButton] Konnte nicht in Zwischenablage kopieren.", error);
    }
  }, [value, onCopied]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel ?? label}
      data-copied={copied ? "true" : undefined}
      className={
        "group relative inline-flex select-none items-center justify-center font-medium " +
        "transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 " +
        "active:scale-[0.97] disabled:opacity-50 " +
        (copied ? "animate-copy-pulse border-emerald-400/40 bg-emerald-400/[0.12] text-emerald-50 " : "") +
        `${VARIANT[variant]} ${SIZE[size]} ${className}`
      }
    >
      {leadingIcon && (
        <span className="-ml-0.5 inline-flex h-3.5 w-3.5 items-center justify-center opacity-80">
          {leadingIcon}
        </span>
      )}
      <span className="relative inline-flex items-center gap-1.5">
        {copied ? (
          <>
            <CheckIcon />
            {successLabel}
          </>
        ) : (
          label
        )}
      </span>
    </button>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="12"
      height="12"
      aria-hidden="true"
      className="text-emerald-300"
    >
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
