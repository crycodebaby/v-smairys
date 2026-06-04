"use client";

import React, { useEffect, useId, useRef, useState } from "react";

export type ListboxOption = {
  value: string;
  label: string;
  hint?: string;
};

type GlassListboxProps = {
  options: readonly ListboxOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  placeholder?: string;
  className?: string;
};

/**
 * Liquid-Glass-Listbox (Popover) als Ersatz für native Selects.
 *
 * - Button öffnet ein Glas-Popover mit Optionen (dunkel, hoher Kontrast)
 * - Tastatur: Enter/Space/ArrowDown öffnet, Pfeile navigieren, Enter wählt,
 *   Esc schließt; Klick außerhalb schließt
 * - touchfreundliche Zeilenhöhe, aktive Option hervorgehoben
 */
export function GlassListbox({
  options,
  value,
  onChange,
  ariaLabel,
  placeholder = "Auswählen",
  className = "",
}: GlassListboxProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  useEffect(() => {
    if (open) {
      const idx = options.findIndex((o) => o.value === value);
      setActiveIndex(idx >= 0 ? idx : 0);
    }
  }, [open, options, value]);

  const select = (idx: number) => {
    const option = options[idx];
    if (option) {
      onChange(option.value);
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={"relative " + className}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={
          "group relative flex h-11 w-full select-none items-center justify-between gap-2 " +
          "rounded-xl border border-white/12 bg-white/[0.05] px-3.5 text-left text-sm " +
          "text-foreground backdrop-blur-xl transition-colors duration-200 " +
          "hover:border-white/25 hover:bg-white/[0.08] " +
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        }
      >
        <span className={selected ? "truncate text-foreground" : "truncate text-foreground/40"}>
          {selected ? selected.label : placeholder}
        </span>
        <Chevron open={open} />
      </button>

      {open && (
        <div
          role="listbox"
          id={listId}
          aria-label={ariaLabel}
          tabIndex={-1}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              setOpen(false);
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((i) => (i + 1) % options.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((i) => (i - 1 + options.length) % options.length);
            } else if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              select(activeIndex);
            }
          }}
          ref={(el) => el?.focus()}
          className={
            "animate-panel-in absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl " +
            "border border-white/12 bg-[hsl(240_18%_10%/0.92)] p-1.5 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.8)] " +
            "backdrop-blur-2xl focus:outline-none"
          }
        >
          {options.map((option, i) => {
            const isSelected = option.value === value;
            const isActive = i === activeIndex;
            return (
              <div
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => select(i)}
                className={
                  "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm " +
                  "transition-colors duration-150 " +
                  (isSelected
                    ? "bg-[hsl(var(--brand)/0.16)] text-foreground ring-1 ring-inset ring-[hsl(var(--brand)/0.35)]"
                    : isActive
                      ? "bg-white/[0.12] text-foreground"
                      : "text-foreground/80 hover:bg-white/[0.07]")
                }
              >
                <span className="min-w-0">
                  <span className="block truncate">{option.label}</span>
                  {option.hint && (
                    <span className="mt-0.5 block truncate font-mono text-[11px] text-foreground/45">
                      {option.hint}
                    </span>
                  )}
                </span>
                {isSelected && <CheckIcon />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="14"
      height="14"
      aria-hidden="true"
      className={
        "flex-none text-foreground/55 transition-transform duration-200 " +
        (open ? "rotate-180" : "rotate-0")
      }
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 8l5 5 5-5"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className="flex-none text-emerald-300">
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
