// src/components/FaqSection.tsx
import React from "react";
import { faqData } from "@/lib/faqData";
import FadeIn from "./FadeIn";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Importiert aus dem neuen "ui"-Ordner

const FaqSection = () => {
  return (
    <section className="container py-24 sm:py-32">
      <FadeIn>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight font-heading sm:text-4xl">
            Klarheit für Entscheider
          </h2>
          <p className="mt-6 text-lg leading-8 text-foreground/80">
            Eine erfolgreiche Zusammenarbeit basiert auf Transparenz und
            gemeinsamen Werten. Hier finden Sie Antworten, die uns helfen,
            herauszufinden, ob wir zueinander passen.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="max-w-3xl mx-auto mt-16">
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg text-left font-heading hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-foreground/80">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </FadeIn>
    </section>
  );
};

export default FaqSection;
