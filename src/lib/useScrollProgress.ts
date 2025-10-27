"use client";

import { useEffect, useRef, useState } from "react";

export function useScrollProgress(): number {
  const [progress, setProgress] = useState<number>(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const onFrame = () => {
      const h = document.documentElement;
      const max = Math.max(1, h.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      setProgress(p);
      raf.current = null;
    };
    const onScroll = () => {
      if (raf.current == null) raf.current = requestAnimationFrame(onFrame);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return progress;
}
