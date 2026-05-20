"use client";

import React from "react";

type PinKeypadProps = {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
};

/**
 * iPad-/iPhone-artiges Ziffern-Keypad mit hochwertiger Glas-Optik.
 *
 *   1 2 3
 *   4 5 6
 *   7 8 9
 *     0  ⌫
 *
 * - Große Touchflächen (h-16 / w-full innerhalb der 3-Spalten-Grid)
 * - Tonale Glas-Tiles mit Chroma-Hover-Glow
 * - Subtiler Pressed-State (Skalierung + intensiverer Glow)
 * - Backspace-Taste eigenständig getönt
 *
 * Keyboard-Bindings macht der Aufrufer (z. B. `PinForm`), damit dieser
 * entscheidet, ob Desktop-Eingabe erlaubt ist.
 */
export function PinKeypad({
  onDigit,
  onBackspace,
  disabled = false,
}: PinKeypadProps) {
  const digits: Array<string | null> = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    null, "0", "⌫",
  ];

  return (
    <div
      className="grid w-full max-w-xs grid-cols-3 gap-3 sm:max-w-sm sm:gap-4"
      role="group"
      aria-label="PIN-Tastatur"
    >
      {digits.map((label, idx) => {
        if (label === null) {
          return <span key={idx} aria-hidden="true" />;
        }
        const isBackspace = label === "⌫";
        const handleClick = isBackspace ? onBackspace : () => onDigit(label);
        return (
          <button
            key={idx}
            type="button"
            onClick={handleClick}
            disabled={disabled}
            aria-label={isBackspace ? "Eine Stelle löschen" : `Ziffer ${label}`}
            className={
              "group relative h-16 w-full select-none overflow-hidden rounded-2xl sm:h-[4.5rem] " +
              "text-2xl font-light tabular-nums text-foreground " +
              "border border-white/12 backdrop-blur-xl " +
              "transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out " +
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/55 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 " +
              "active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40 " +
              (isBackspace
                ? "bg-white/[0.04] hover:bg-white/[0.09] text-foreground/70 hover:text-foreground"
                : "bg-white/[0.09] hover:bg-white/[0.15] hover:border-white/25") +
              " shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14),0_8px_24px_-12px_rgba(0,0,0,0.55)]"
            }
          >
            {/* Top-Highlight Hairline */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
            />
            {/* Chroma-Hover-Glow: nur sichtbar bei Hover/Press. Subtil bleibt
                wichtig, damit das Keypad ruhig wirkt und nicht "shiny". */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100"
            >
              <span className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/30 blur-2xl" />
              <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/25 blur-2xl" />
            </span>
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
