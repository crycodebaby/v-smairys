import React from "react";
import { cn } from "@/lib/utils";

export type SectionVariant =
  | "default"
  /** Full-viewport hero: one screen, header-aware, no double section padding. */
  | "hero"
  /** Page intro below fixed header (case studies, legal, sub-heroes). */
  | "page-header"
  /** Tighter vertical rhythm for dense blocks. */
  | "compact"
  /** No vertical padding preset – caller controls spacing. */
  | "flush";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  /**
   * @deprecated Prefer `variant="hero"`.
   */
  isHero?: boolean;
  variant?: SectionVariant;
}

const VARIANT_CLASSES: Record<SectionVariant, string> = {
  default: "py-section-y min-w-0",
  hero: [
    "section-hero flex min-h-[100dvh] min-w-0 flex-col justify-center overflow-x-clip",
    "pt-[var(--scroll-padding-top,5.5rem)] pb-8 sm:pb-10",
    "[@media(max-height:700px)]:min-h-0 [@media(max-height:700px)]:pb-6",
  ].join(" "),
  "page-header": [
    "min-w-0 overflow-x-clip",
    "pt-[var(--scroll-padding-top,5.5rem)] pb-10 sm:pb-12",
  ].join(" "),
  compact: "py-12 min-w-0 sm:py-16",
  flush: "min-w-0",
};

export function Section({
  children,
  className = "",
  isHero = false,
  variant,
  ...props
}: SectionProps) {
  const resolvedVariant: SectionVariant =
    variant ?? (isHero ? "hero" : "default");

  return (
    <section
      className={cn("w-full", VARIANT_CLASSES[resolvedVariant], className)}
      {...props}
    >
      {children}
    </section>
  );
}
