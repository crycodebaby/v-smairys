// src/components/leistungen/ActSection.tsx
"use client";

import { useEffect, useMemo, useRef } from "react";

/** Öffentlicher Event-Name + Typen für Listener in anderen Files */
export const ACT_EVENT = "smairys-act" as const;
export type ActId = "act-1" | "act-2" | "act-3";
type Align = "left" | "right" | "center";

type Props = {
  id: ActId;
  eyebrow: string;
  title: string;
  copy: string;
  align?: Align;
};

export default function ActSection({
  id,
  eyebrow,
  title,
  copy,
  align = "left",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  // Klassen deterministisch & ohne String-Bugs
  const alignCls = useMemo(() => {
    switch (align) {
      case "center":
        return "text-center items-center";
      case "right":
        return "text-right items-end md:ml-auto";
      default:
        return "text-left items-start";
    }
  }, [align]);

  useEffect(() => {
    const el = ref.current;

    // Progressive Enhancement: wenn kein IO, einmalig signalisieren
    if (!el || typeof window === "undefined") return;
    const IOAvailable = "IntersectionObserver" in window;

    const dispatchAct = (actId: ActId) => {
      // streng typisiertes CustomEvent
      const ev: CustomEvent<{ id: ActId }> = new CustomEvent(ACT_EVENT, {
        detail: { id: actId },
      });
      window.dispatchEvent(ev);
    };

    if (!IOAvailable) {
      dispatchAct(id);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e && e.isIntersecting && e.intersectionRatio >= 0.6) {
          dispatchAct(id);
        }
      },
      {
        root: null,
        threshold: [0.6],
        // leichtes negatives bottom margin, damit Act etwas früher wechselt
        rootMargin: "0px 0px -10% 0px",
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [id]);

  return (
    <section
      id={id}
      ref={ref}
      data-act-id={id}
      aria-labelledby={`${id}-title`}
      className="container relative py-16 sm:py-24 lg:py-28"
    >
      <div className={`max-w-xl flex flex-col gap-3 ${alignCls}`}>
        <span className="inline-flex rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[11px] font-medium text-foreground/70">
          {eyebrow}
        </span>
        <h2
          id={`${id}-title`}
          className="text-3xl font-bold tracking-tight font-heading sm:text-4xl"
        >
          {title}
        </h2>
        <p className="text-base text-foreground/80 sm:text-lg">{copy}</p>
      </div>
    </section>
  );
}
