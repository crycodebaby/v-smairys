// src/components/leistungen/ServicesTOC.tsx
"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type RefObject,
} from "react";
import {
  Gauge,
  LayoutTemplate,
  Search,
  Server,
  type LucideIcon,
} from "lucide-react";
import type {
  LeistungenNavIcon,
  LeistungenNavItem,
} from "@/config/leistungen-services";

const NAV_ICONS: Record<LeistungenNavIcon, LucideIcon> = {
  layout: LayoutTemplate,
  gauge: Gauge,
  search: Search,
  server: Server,
};

/** Wie lange der Scroll-Spy nach einem Klick pausiert (ms). */
const CLICK_LOCK_MS = 900;

type ServicesTOCProps = {
  items: LeistungenNavItem[];
};

/**
 * Misst Header + Sticky-Rail und schreibt `--leistungen-scroll-offset` auf
 * `:root`. Sections nutzen dieselbe Variable als `scroll-margin-top`, damit
 * natives `scrollIntoView` und Hash-Links exakt unter der Leiste landen.
 */
function useScrollOffset(railRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const root = document.documentElement;

    const sync = () => {
      const header = document.querySelector("header");
      const headerH = header?.getBoundingClientRect().height ?? 68;
      const railH = rail.getBoundingClientRect().height;
      const offset = Math.ceil(headerH + railH + 10);
      root.style.setProperty("--leistungen-scroll-offset", `${offset}px`);
      root.style.scrollPaddingTop = `${offset}px`;
    };

    sync();

    const ro = new ResizeObserver(sync);
    ro.observe(rail);
    const header = document.querySelector("header");
    if (header) ro.observe(header);

    window.addEventListener("resize", sync, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
      root.style.removeProperty("--leistungen-scroll-offset");
      root.style.scrollPaddingTop = "";
    };
  }, [railRef]);
}

/** Scrollt einen Tab nur innerhalb der horizontalen Nav – nie die Seite. */
function centerTabInNav(nav: HTMLElement, link: HTMLElement) {
  const targetLeft =
    link.offsetLeft + link.offsetWidth / 2 - nav.clientWidth / 2;
  nav.scrollTo({
    left: Math.max(0, targetLeft),
    behavior: "smooth",
  });
}

export default function ServicesTOC({ items }: ServicesTOCProps) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");
  const railRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const clickLockUntil = useRef(0);
  const prefersReducedMotion = useRef(false);

  useScrollOffset(railRef);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  /* ── Scroll-Spy: welche Section liegt unter der Offset-Linie? ───────── */
  useEffect(() => {
    const sectionIds = items.map((i) => i.id);

    const resolveActive = () => {
      if (Date.now() < clickLockUntil.current) return;

      const offsetVar = getComputedStyle(document.documentElement)
        .getPropertyValue("--leistungen-scroll-offset")
        .trim();
      const offset = offsetVar ? parseFloat(offsetVar) : 128;
      const probe = offset + 24;

      let current = sectionIds[0] ?? "";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= probe) {
          current = id;
        }
      }

      setActive((prev) => (prev === current ? prev : current));
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        resolveActive();
        ticking = false;
      });
    };

    resolveActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resolveActive, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resolveActive);
    };
  }, [items]);

  /* ── Hash beim Laden / Browser Back-Forward ─────────────────────────── */
  useEffect(() => {
    const scrollToHash = (hash: string, instant = false) => {
      const id = hash.replace(/^#/, "");
      if (!id || !items.some((i) => i.id === id)) return;

      const target = document.getElementById(id);
      if (!target) return;

      clickLockUntil.current = Date.now() + CLICK_LOCK_MS;
      setActive(id);

      target.scrollIntoView({
        behavior: instant || prefersReducedMotion.current ? "auto" : "smooth",
        block: "start",
      });
    };

    if (window.location.hash) {
      requestAnimationFrame(() => scrollToHash(window.location.hash, true));
    }

    const onHashChange = () => scrollToHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [items]);

  /* ── Aktiven Tab horizontal zentrieren (nur Nav-Container!) ─────────── */
  useEffect(() => {
    const nav = navRef.current;
    const link = linkRefs.current.get(active);
    if (!nav || !link) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const overflows =
      linkRect.left < navRect.left + 6 ||
      linkRect.right > navRect.right - 6;

    if (overflows) {
      centerTabInNav(nav, link);
    }
  }, [active]);

  const handleNavClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();

      const target = document.getElementById(id);
      if (!target) return;

      clickLockUntil.current = Date.now() + CLICK_LOCK_MS;
      setActive(id);

      target.scrollIntoView({
        behavior: prefersReducedMotion.current ? "auto" : "smooth",
        block: "start",
      });

      window.history.replaceState(null, "", `#${id}`);
    },
    []
  );

  return (
    <div
      ref={railRef}
      className="sticky top-[4.25rem] z-40 w-full border-b border-white/8 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/78"
      role="presentation"
    >
      <div className="mx-auto w-full max-w-[1440px] px-[clamp(1rem,4.8vw,6rem)]">
        <nav
          ref={navRef}
          className="leistungen-toc-scroll flex items-center gap-1 overflow-x-auto py-2 sm:gap-1.5 sm:py-2.5 md:justify-center md:overflow-visible"
          aria-label="Leistungsbereiche"
        >
          {items.map((item) => {
            const isActive = active === item.id;
            const Icon = NAV_ICONS[item.icon];

            return (
              <a
                key={item.id}
                ref={(el) => {
                  if (el) linkRefs.current.set(item.id, el);
                  else linkRefs.current.delete(item.id);
                }}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                aria-current={isActive ? "location" : undefined}
                className={[
                  "group relative flex h-10 shrink-0 items-center gap-2 rounded-sm border px-3",
                  "text-[12px] font-medium tracking-wide sm:h-11 sm:px-3.5 sm:text-[13px]",
                  "transition-[border-color,background-color,color] duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-glow focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  "md:flex-1 md:justify-center md:px-4",
                  isActive
                    ? "border-brand/50 bg-brand/[0.14] text-foreground"
                    : "border-white/10 bg-white/[0.03] text-foreground/65 hover:border-white/18 hover:bg-white/[0.06] hover:text-foreground",
                ].join(" ")}
              >
                <Icon
                  className={[
                    "h-3.5 w-3.5 shrink-0",
                    isActive ? "text-brand" : "text-foreground/40 group-hover:text-foreground/60",
                  ].join(" ")}
                  strokeWidth={1.6}
                  aria-hidden="true"
                />

                <span className="whitespace-nowrap md:hidden">{item.shortLabel}</span>
                <span className="hidden whitespace-nowrap md:inline">{item.label}</span>

                {/* Aktiv-Linie – absolute, ändert die Höhe nicht */}
                <span
                  aria-hidden="true"
                  className={[
                    "pointer-events-none absolute inset-x-3 -bottom-px h-px rounded-full bg-brand transition-opacity duration-200",
                    isActive ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                />
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
