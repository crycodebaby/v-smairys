import React from "react";
import { testimonialsData } from "@/lib/testimonialsData";
import TestimonialCard from "./TestimonialCard";
import FadeIn from "./FadeIn";
import BlurCircle from "./ui/BlurCircle";

const TestimonialsJsonLd = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Smairys Netz-Manufaktur",
    url: "https://smairys.de",
    review: testimonialsData.map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.name },
      itemReviewed: { "@type": "Organization", name: t.company },
      reviewBody: t.story,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="relative py-24 overflow-hidden isolate sm:py-32"
    >
      {/* subtile Lichtquelle */}
      <BlurCircle className="-top-24 -right-40 opacity-70" />

      <div className="container">
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight font-heading sm:text-4xl">
              Ergebnisse, nicht Versprechen
            </h2>
            <p className="mt-5 text-lg leading-8 text-foreground/80">
              Echte Resultate. Echte Menschen.
              <br className="hidden sm:block" />
              Genau so baut Smairys Websites – sichtbar, schnell, wirksam.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-10 mx-auto mt-16 max-w-none sm:gap-8 lg:grid-cols-3">
          {testimonialsData.map((testimonial, i) => (
            <TestimonialCard
              key={testimonial.company + i}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>

      <TestimonialsJsonLd />
    </section>
  );
}
