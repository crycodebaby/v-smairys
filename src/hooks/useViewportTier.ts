"use client";

import { useEffect, useState } from "react";

export type ViewportTier = "mobile" | "tablet" | "desktop";

export function useViewportTier(): ViewportTier {
  const [tier, setTier] = useState<ViewportTier>("desktop"); // SSR-fallback

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 768) return "mobile" as const; // < md
      if (w < 1024) return "tablet" as const; // md–lg
      return "desktop" as const; // ≥ lg
    };
    setTier(calc());

    const onResize = () => setTier(calc());
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return tier;
}
