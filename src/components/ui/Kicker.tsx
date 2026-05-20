import React from 'react';

export function Kicker({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`flex items-center gap-4 mb-6 ${className}`}>
      <div className="h-[1px] w-8 bg-foreground" />
      <span className="text-sm uppercase tracking-widest font-medium text-foreground">
        {children}
      </span>
    </div>
  );
}
