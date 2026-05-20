"use client";

import React from "react";

type PinDotsProps = {
  /** Anzahl bereits eingegebener Stellen. */
  filled: number;
  /** Gesamtanzahl Stellen. */
  length: number;
  /** Optional: kurze Shake-Animation + roter Glow. */
  shake?: boolean;
  /** Optional: sanfte Erfolgs-Animation + grüner Glow. */
  success?: boolean;
};

/**
 * iOS-Lockscreen-Punkte für die PIN-Eingabe.
 *
 * - Gefüllte Slots: opak, mit weichem Inner-Glow.
 * - Leere Slots: nur dezenter Ring, leichte Innen-Tönung.
 * - Bei `shake` wird ein roter Glow um die ganze Reihe gelegt.
 * - Bei `success` wird ein grüner Glow + Skalier-Animation gelegt.
 */
export function PinDots({ filled, length, shake = false, success = false }: PinDotsProps) {
  const wrapperGlow = shake
    ? "pin-error-glow"
    : success
      ? "pin-success-glow"
      : "";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`PIN: ${filled} von ${length} Stellen eingegeben`}
      className={`relative inline-flex items-center justify-center gap-4 rounded-full px-3 py-2 transition-shadow duration-300 sm:gap-5 ${wrapperGlow} ${
        shake ? "animate-pin-shake" : ""
      } ${success ? "animate-pin-success" : ""}`}
    >
      {Array.from({ length }).map((_, i) => {
        const isFilled = i < filled;
        return (
          <span
            key={i}
            className={
              "relative inline-flex h-3.5 w-3.5 items-center justify-center transition-all duration-200 " +
              (isFilled
                ? "scale-110"
                : "scale-100")
            }
          >
            {/* Outer Ring */}
            <span
              className={
                "absolute inset-0 rounded-full border transition-colors duration-200 " +
                (isFilled
                  ? "border-white/70"
                  : "border-white/25")
              }
            />
            {/* Inner Dot */}
            <span
              className={
                "absolute inset-[3px] rounded-full transition-all duration-200 " +
                (isFilled
                  ? "bg-white shadow-[0_0_12px_2px_rgba(255,255,255,0.45)]"
                  : "bg-white/0")
              }
            />
          </span>
        );
      })}
    </div>
  );
}
