"use client";

import React, { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  /** Delay in ms vor dem Einblenden – nützlich für Stagger-Layouts. */
  delay?: number;
  /** Wann gilt das Element als sichtbar (IntersectionObserver-Threshold). */
  threshold?: number;
  /** Optional: nur einmal animieren (Default true). */
  once?: boolean;
  /** Eigener Tag-Name (default `div`). */
  as?: "div" | "section" | "li" | "article" | "header" | "aside" | "figure";
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Subtile Scroll-Reveal-Animation.
 *
 * - Verwendet `IntersectionObserver` (kein zusätzliches Paket nötig).
 * - Default: einmaliges Einblenden, mit weichem Y-Versatz von 14 px.
 * - Respektiert `prefers-reduced-motion` – wenn aktiv, wird sofort sichtbar
 *   gerendert ohne Transition (`globals.css` reduziert generell alle
 *   Animationsdauern, aber wir setzen `is-visible` initial trotzdem).
 * - SSR-safe: Initial-Markup setzt `.reveal-init`, beim Mount wird der
 *   Observer registriert.
 */
export function Reveal({
  children,
  delay = 0,
  threshold = 0.18,
  once = true,
  as = "div",
  className = "",
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const node = ref.current;
    if (!node) return;

    // Respektiere reduced-motion: sofort sichtbar.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  const combinedClassName = `reveal-init ${visible ? "is-visible" : ""} ${className}`.trim();
  const combinedStyle: React.CSSProperties = {
    transitionDelay: delay ? `${delay}ms` : undefined,
    ...style,
  };

  return React.createElement(
    as,
    {
      ref,
      className: combinedClassName,
      style: combinedStyle,
    },
    children
  );
}
