// src/components/TestimonialCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, ExternalLink } from "lucide-react";
import FadeIn from "./FadeIn";
import type { Testimonial } from "@/lib/testimonialsData";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  const {
    company,
    name,
    title,
    logoSingle,
    logoLight,
    logoDark,
    quote,
    story,
    url,
    kpi,
    timeframe,
    services,
  } = testimonial;

  return (
    <FadeIn>
      <motion.article
        whileHover={{ y: -6, transition: { type: "spring", stiffness: 300 } }}
        className="flex flex-col h-full overflow-hidden shadow-sm rounded-2xl bg-card ring-1 ring-border/60"
      >
        {/* Logo-Bereich */}
        <div className="relative flex items-center justify-center w-full h-40 bg-muted/30">
          <div className="relative w-64 h-28">
            {logoSingle ? (
              <Image
                src={logoSingle}
                alt={`${company} Logo`}
                fill
                className="object-contain"
                sizes="160px"
                priority={false}
              />
            ) : (
              <>
                {logoLight && (
                  <Image
                    src={logoLight}
                    alt={`${company} Logo hell`}
                    fill
                    className="block object-contain dark:hidden"
                    sizes="160px"
                  />
                )}
                {logoDark && (
                  <Image
                    src={logoDark}
                    alt={`${company} Logo dunkel`}
                    fill
                    className="hidden object-contain dark:block"
                    sizes="160px"
                  />
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 p-6">
          {/* KPI Badge */}
          <div className="inline-flex items-center self-start px-3 py-1 mb-4 text-xs font-medium rounded-full gap-x-2 bg-primary/10 text-primary">
            <TrendingUp size={14} aria-hidden="true" />
            <span>{kpi}</span>
            {timeframe ? (
              <span className="text-foreground/60">· {timeframe}</span>
            ) : null}
          </div>

          {/* Quote */}
          <blockquote className="text-foreground">
            <p className="font-heading text-lg font-semibold leading-7 before:content-['“'] after:content-['”']">
              {quote}
            </p>
          </blockquote>

          {/* Kunde + Name + Link */}
          <div className="flex items-center justify-between mt-5">
            <div>
              <p className="font-semibold">{name}</p>
              <p className="text-sm text-foreground/60">{title}</p>
            </div>

            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live Projekt von ${company} öffnen`}
              className="p-2 transition-colors rounded-full hover:bg-foreground/5"
            >
              <ExternalLink
                size={20}
                className="transition-colors text-foreground/60 hover:text-primary"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* Kurz-Story */}
          <p className="mt-5 text-sm leading-6 text-foreground/70 line-clamp-4">
            {story}
          </p>

          {/* Services */}
          {services?.length ? (
            <ul className="flex flex-wrap gap-2 mt-5">
              {services.map((s) => (
                <li
                  key={s}
                  className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {s}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </motion.article>
    </FadeIn>
  );
};

export default TestimonialCard;
