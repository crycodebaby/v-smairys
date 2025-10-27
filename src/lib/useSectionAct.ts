"use client";

import { useEffect, useState } from "react";

export type SectionAct =
  | "hero"
  | "bento"
  | "cta"
  | "process"
  | "testimonials"
  | "faq"
  | "footer"
  | "none";

export function useSectionAct(): SectionAct {
  const [act, setAct] = useState<SectionAct>("hero");

  useEffect(() => {
    const sections = [
      "hero",
      "bento",
      "cta",
      "process",
      "testimonials",
      "faq",
      "footer",
    ].map((id) => document.getElementById(id));

    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis && vis.target.id) {
          setAct(vis.target.id as SectionAct);
        }
      },
      { threshold: 0.3 }
    );

    sections.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return act;
}
