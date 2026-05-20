import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: React.ElementType;
}

export function Container({ children, className = '', as: Component = 'div', ...props }: ContainerProps) {
  // React 19 + TS-strict: dynamische `React.ElementType`-Komponenten erzeugen
  // im JSX-Body einen "children: never"-Fehler. `React.createElement` umgeht
  // diese Inferenz und ist semantisch identisch.
  return React.createElement(
    Component,
    {
      className: `w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 ${className}`,
      ...props,
    },
    children,
  );
}
