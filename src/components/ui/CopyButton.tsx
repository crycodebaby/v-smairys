"use client";

import { useCallback, useState } from "react";

type CopyButtonProps = {
  /** Wert, der in die Zwischenablage kopiert werden soll. */
  value: string;
  /** Button-Text (auch als aria-label genutzt). */
  label: string;
  /** Wird angezeigt, solange `copied`-State aktiv ist (Default: "Kopiert!"). */
  successLabel?: string;
  /** Visuelle Variante. `glass` für Liquid-Glass-Kontext, `plain` als Default. */
  variant?: "plain" | "glass";
  className?: string;
  /** Wird nach erfolgreichem Copy aufgerufen (optional). */
  onCopied?: () => void;
};

/**
 * Wiederverwendbarer Copy-to-Clipboard-Button.
 *
 * - SSR-safe (Clipboard-API nur im Handler aufgerufen)
 * - 2-Sekunden-Feedback ("Kopiert!"), danach Reset
 * - Fallback bei fehlender Clipboard-API: textarea-Trick
 * - Zwei optische Varianten: `plain` (Standard) und `glass`
 *   (passend zu GlassButton/PinKeypad).
 */
export function CopyButton({
  value,
  label,
  successLabel = "Kopiert!",
  variant = "plain",
  className = "",
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

  const variantStyles =
    variant === "glass"
      ? "bg-white/55 dark:bg-white/[0.06] hover:bg-white/75 dark:hover:bg-white/[0.10] " +
        "border border-white/40 dark:border-white/10 backdrop-blur-xl text-foreground/90 " +
        "rounded-full"
      : "border border-border bg-background hover:bg-muted text-foreground rounded-sm";

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      className={
        "inline-flex select-none items-center justify-center px-3 py-1.5 text-xs " +
        "font-medium transition-colors disabled:opacity-50 " +
        `${variantStyles} ${className}`
      }
    >
      {copied ? successLabel : label}
    </button>
  );
}
