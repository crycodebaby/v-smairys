// src/components/leistungen/useInView.ts
"use client";

import { useEffect, useState } from "react";

export default function useInView<T extends Element>(
  ref: React.RefObject<T>,
  opts?: IntersectionObserverInit
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setInView(true); // Fallback: rendern
      return;
    }
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { threshold: 0.25, root: null, rootMargin: "0px", ...(opts || {}) }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, opts]);

  return inView;
}
