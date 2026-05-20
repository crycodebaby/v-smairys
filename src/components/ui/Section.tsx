import React from 'react';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  isHero?: boolean;
}

export function Section({ children, className = '', isHero = false, ...props }: SectionProps) {
  return (
    <section 
      className={`w-full ${isHero ? 'py-section-y-hero' : 'py-section-y'} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
