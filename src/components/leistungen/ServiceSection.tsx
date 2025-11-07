// src/components/leistungen/ServiceSection.tsx
"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import ServiceFigure3D from "@/components/leistungen/ServiceFigure3D";

type Variant = "web" | "jpp" | "seo" | "hosting";

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  bullets?: string[];
  body?: string[];
  note?: string;
  cta?: { label: string; href: string };
  variant: Variant;
};

export default function ServiceSection({
  id,
  eyebrow,
  title,
  bullets = [],
  body = [],
  note,
  cta,
  variant,
}: Props) {
  return (
    <section id={id} className="relative py-12 sm:py-16">
      <div className="container">
        <div className="grid grid-cols-1 gap-6 p-6 border shadow-sm  rounded-2xl border-border/60 bg-card/80 sm:p-8 md:grid-cols-2 md:gap-8">
          {/* 3D oben auf Mobile, rechts auf Desktop */}
          <div className="order-1 md:order-2">
            <ServiceFigure3D variant={variant} />
          </div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="order-2 md:order-1"
          >
            <div className="flex flex-col gap-3">
              <span className="inline-flex w-fit items-center rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[11px] font-medium text-foreground/70">
                {eyebrow}
              </span>
              <h2 className="text-2xl font-bold tracking-tight font-heading sm:text-3xl">
                {title}
              </h2>

              {bullets.length > 0 && (
                <ul className="grid grid-cols-1 gap-2 mt-3 text-sm text-foreground/85 sm:grid-cols-2">
                  {bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {body.length > 0 && (
                <div className="mt-4 space-y-3 text-base leading-7 text-foreground/80">
                  {body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}

              {note && (
                <p className="mt-3 text-sm text-foreground/60">{note}</p>
              )}

              {cta && (
                <div className="mt-6">
                  <a
                    href={cta.href}
                    className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold transition rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {cta.label}
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
