// src/components/SectionDivider.tsx
import React from "react";
import { cn } from "@/lib/utils";

// Erlaubt das Durchreichen aller Standard-SVG-Props (wie 'style', etc.)
type SectionDividerProps = React.SVGProps<SVGSVGElement>;

const SectionDivider = ({ className, ...props }: SectionDividerProps) => {
  return (
    <svg
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={cn("relative block w-full fill-current", className)}
      {...props} // HIER IST DAS UPGRADE
    >
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-17,148.6-13.49,206.82,4.51s113.72,49.67,175.45,85.19c72.58,42.45,148.8,92.33,224.49,95.38,77.52,3.12,129.4-39.12,129.4-39.12V0H0V120H321.39Z"></path>
    </svg>
  );
};

export default SectionDivider;
