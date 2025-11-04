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
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
        className="flex flex-col h-full overflow-hidden transition-all border shadow-sm rounded-2xl border-border/60 bg-card/90 ring-1 ring-black/0 hover:shadow-lg hover:ring-border/70"
      >
        {/* Logo-Area */}
        <div className="relative flex items-center justify-center w-full border-b bg-muted/30 border-border/50">
          <div className="relative w-full max-w-[200px] aspect-[3/1] m-8">
            {logoSingle ? (
              <Image
                src={logoSingle}
                alt={`${company} Logo`}
                fill
                className="object-contain"
                sizes="(max-width:768px) 60vw, (max-width:1200px) 30vw, 200px"
                priority={false}
              />
            ) : (
              <>
                {logoLight && (
                  <Image
                    src={logoLight}
                    alt={`${company} Logo hell`}
                    fill
                    className="object-contain dark:hidden"
                    sizes="(max-width:768px) 60vw, (max-width:1200px) 30vw, 200px"
                  />
                )}
                {logoDark && (
                  <Image
                    src={logoDark}
                    alt={`${company} Logo dunkel`}
                    fill
                    className="hidden object-contain dark:block"
                    sizes="(max-width:768px) 60vw, (max-width:1200px) 30vw, 200px"
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Text-Content */}
        <div className="flex flex-col flex-1 p-6">
          {/* KPI Badge */}
          {kpi && (
            <div className="inline-flex items-center self-start px-3 py-1 mb-4 text-xs font-medium rounded-full gap-x-2 bg-primary/10 text-primary">
              <TrendingUp size={14} aria-hidden="true" />
              <span>{kpi}</span>
              {timeframe && (
                <span className="text-foreground/60">· {timeframe}</span>
              )}
            </div>
          )}

          {/* Quote */}
          <blockquote className="text-foreground">
            <p className="font-heading text-lg font-semibold leading-7 before:content-['“'] after:content-['”']">
              {quote}
            </p>
          </blockquote>

          {/* Kunde */}
          <div className="flex items-center justify-between mt-5">
            <div>
              <p className="font-semibold">{name}</p>
              {title && <p className="text-sm text-foreground/60">{title}</p>}
            </div>

            {url && (
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
            )}
          </div>

          {/* Kurz-Story */}
          {story && (
            <p className="mt-5 text-sm leading-6 text-foreground/70 line-clamp-4">
              {story}
            </p>
          )}

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
