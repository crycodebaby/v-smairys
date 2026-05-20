"use client";

import React from "react";

type PinKeypadProps = {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
};

/**
 * iPad-/iPhone-artiges Ziffern-Keypad.
 *
 *   1 2 3
 *   4 5 6
 *   7 8 9
 *     0  ⌫
 *
 * - Große Touchflächen (mind. 64px hoch).
 * - Liquid-Glass-Optik je Taste.
 * - Tastatur-Eingabe wird **nicht** hier gebunden – das macht der Aufrufer,
 *   damit dieser entscheidet, ob Desktop-Eingabe erlaubt ist.
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
      className="grid grid-cols-3 gap-3 sm:gap-4"
      role="group"
      aria-label="PIN-Tastatur"
    >
      {digits.map((label, idx) => {
        if (label === null) {
          return <span key={idx} aria-hidden="true" />;
        }
        const isBackspace = label === "⌫";
        const handleClick = isBackspace
          ? onBackspace
          : () => onDigit(label);
        return (
          <button
            key={idx}
            type="button"
            onClick={handleClick}
            disabled={disabled}
            aria-label={isBackspace ? "Eine Stelle löschen" : `Ziffer ${label}`}
            className={
              "h-16 w-full select-none rounded-2xl text-2xl font-light " +
              "bg-white/55 dark:bg-white/[0.06] " +
              "border border-white/40 dark:border-white/10 " +
              "backdrop-blur-xl shadow-sm " +
              "transition-all duration-150 " +
              "hover:bg-white/75 dark:hover:bg-white/[0.10] " +
              "active:scale-[0.96] active:bg-white/85 dark:active:bg-white/[0.14] " +
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 " +
              "disabled:cursor-not-allowed disabled:opacity-40"
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
