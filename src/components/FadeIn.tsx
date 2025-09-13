// src/components/FadeIn.tsx
"use client";

import { motion } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils"; // cn-Utility importieren

// Props-Typ für mehr Klarheit definieren
type FadeInProps = React.PropsWithChildren<{
  className?: string;
}>;

const FadeIn = ({ children, className }: FadeInProps) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    // className wird jetzt sicher mit cn() gemerged
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className={cn(className)} // HIER IST DAS UPGRADE
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
