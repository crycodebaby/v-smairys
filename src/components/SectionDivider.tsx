// src/components/SectionDivider.tsx
import React from "react";

interface SectionDividerProps {
  className?: string;
}

const SectionDivider = ({ className }: SectionDividerProps) => {
  return (
    <div
      className={`absolute left-0 w-full overflow-hidden leading-[0] ${className}`}
    >
      <svg
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block h-[150px] w-full"
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-17,148.6-13.49,206.82,4.51s113.72,49.67,175.45,85.19c72.58,42.45,148.8,92.33,224.49,95.38,77.52,3.12,129.4-39.12,129.4-39.12V0H0V120H321.39Z"
          className="fill-current"
        ></path>
      </svg>
    </div>
  );
};

export default SectionDivider;
