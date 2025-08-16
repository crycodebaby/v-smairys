// src/components/TestimonialsSection.tsx
import React from "react";
import { testimonialsData } from "@/lib/testimonialsData";
import TestimonialCard from "./TestimonialCard";
import FadeIn from "./FadeIn";

const TestimonialsSection = () => {
  return (
    <section className="container py-24 sm:py-32">
      <FadeIn>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight font-heading sm:text-4xl">
            Was unsere Partner sagen
          </h2>
          <p className="mt-6 text-lg leading-8 text-foreground/80">
            Erfolgsgeschichten, die für sich sprechen. Wir verwandeln digitale
            Herausforderungen in messbares Wachstum.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 gap-8 mx-auto mt-16 max-w-none lg:grid-cols-3">
        {testimonialsData.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
