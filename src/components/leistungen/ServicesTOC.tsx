// src/components/leistungen/ServicesTOC.tsx
"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

type Item = { id: string; label: string };

export default function ServicesTOC({ items }: { items: Item[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(id);
          });
        },
        { threshold: 0.4 }
      );
      io.observe(el);
      observers.push(io);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  return (
    <aside
      className="flex items-center justify-center max-w-4xl p-2 mx-auto border shadow-sm rounded-xl border-border/60 bg-background/60 backdrop-blur-xl"
      aria-label="Inhaltsverzeichnis der Leistungen"
    >
      <nav className="flex flex-wrap items-center justify-center gap-1.5">
        {items.map((it) => {
          const activeNow = active === it.id;
          return (
            <a
              key={it.id}
              href={`#${it.id}`}
              className={`group inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors ${
                activeNow
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/80 hover:text-primary hover:bg-foreground/5"
              }`}
            >
              <span>{it.label}</span>
              <ChevronRight
                size={16}
                className={`transition-transform ${
                  activeNow ? "translate-x-0.5" : "translate-x-0"
                }`}
                aria-hidden="true"
              />
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
