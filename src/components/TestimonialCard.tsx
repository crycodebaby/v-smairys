// src/components/TestimonialCard.tsx
"use client"; // HIER IST DIE KORREKTUR

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Testimonial } from "@/lib/testimonialsData";
import FadeIn from "./FadeIn";
import { TrendingUp, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <FadeIn>
      <motion.div
        whileHover={{ y: -6, transition: { type: "spring", stiffness: 300 } }}
        className="flex flex-col h-full overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10"
      >
        <div className="relative w-full h-48">
          <Image
            src={testimonial.imagePath}
            alt={`Bild von ${testimonial.company}`}
            layout="fill"
            objectFit="cover"
            className="opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
        </div>

        <div className="flex flex-col flex-1 p-6">
          <div className="inline-flex items-center self-start px-3 py-1 mb-4 text-xs font-medium rounded-full gap-x-2 bg-primary/10 text-primary">
            <TrendingUp size={14} />
            <span>{testimonial.kpi}</span>
          </div>

          <blockquote className="text-foreground">
            <p className="font-heading text-lg font-semibold leading-7 before:content-['“'] after:content-['”']">
              {testimonial.quote}
            </p>
          </blockquote>

          <div className="flex items-center justify-between pt-6 mt-auto">
            <div>
              <p className="font-semibold">{testimonial.name}</p>
              <p className="text-sm text-foreground/60">
                {testimonial.company}
              </p>
            </div>

            <Link
              href={testimonial.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Website von ${testimonial.company} ansehen`}
              className="p-2 transition-colors rounded-full group hover:bg-white/10"
            >
              <ExternalLink
                size={20}
                className="transition-colors text-foreground/60 group-hover:text-primary"
              />
            </Link>
          </div>
        </div>
      </motion.div>
    </FadeIn>
  );
};

export default TestimonialCard;
