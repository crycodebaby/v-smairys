"use client";

import { useLayoutEffect, type RefObject } from "react";
import {
  SCROLL_PADDING_GAP_PX,
  SITE_LAYOUT_CSS_VARS,
} from "@/lib/layout/site-layout";

/**
 * Measures the fixed site header and writes layout CSS variables to `:root`.
 * Keeps anchor scroll targets and hero padding aligned with the real header height.
 */
export function useSiteHeaderMetrics(
  headerRef: RefObject<HTMLElement | null>,
) {
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const root = document.documentElement;

    const sync = () => {
      const height = Math.ceil(el.getBoundingClientRect().height);
      root.style.setProperty(SITE_LAYOUT_CSS_VARS.headerHeight, `${height}px`);
      root.style.setProperty(
        SITE_LAYOUT_CSS_VARS.scrollPaddingTop,
        `${height + SCROLL_PADDING_GAP_PX}px`,
      );
    };

    sync();

    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [headerRef]);
}
