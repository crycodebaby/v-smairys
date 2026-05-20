"use client";

import React from "react";

type PinDotsProps = {
  /** Anzahl bereits eingegebener Stellen. */
  filled: number;
  /** Gesamtanzahl Stellen. */
  length: number;
  /** Optional: Fehler-Shake-Animation auslösen. */
  shake?: boolean;
};

/**
 * Klassische iOS-Lockscreen-Punkte für eine PIN-Eingabe.
 *
 * - Genau `length` Slots.
 * - `filled` aktive Slots; Rest leer.
 * - Bei `shake=true` wird kurzzeitig die `animate-pin-shake` Klasse gesetzt,
 *   die in globals.css als Keyframe definiert ist (siehe StyleSheet).
 */
export function PinDots({ filled, length, shake = false }: PinDotsProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`PIN: ${filled} von ${length} Stellen eingegeben`}
      className={`flex items-center justify-center gap-4 ${
        shake ? "animate-pin-shake" : ""
      }`}
    >
      {Array.from({ length }).map((_, i) => {
        const isFilled = i < filled;
        return (
          <span
            key={i}
            className={`h-4 w-4 rounded-full border transition-all duration-150 ${
              isFilled
                ? "border-foreground bg-foreground"
                : "border-foreground/40 bg-transparent"
            }`}
          />
        );
      })}
    </div>
  );
}
