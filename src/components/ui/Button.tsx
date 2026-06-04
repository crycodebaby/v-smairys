import React, { forwardRef } from 'react';
import { TrackedButton, TrackedButtonProps } from './TrackedButton';

export interface ButtonProps extends TrackedButtonProps {
  /**
   * - `primary` – Off-White auf Dark / Schwarz auf Light, höchster Kontrast
   * - `brand` – Smairys-Amber, eleganter Akzent-CTA mit Glow
   * - `secondary` – gedämpft, alternative Aktion
   * - `outline` – Border-Variante
   * - `ghost` – kein Hintergrund, nur Hover-Tint
   * - `brand-outline` – brand-coloured outline, dezenter Akzent-CTA
   */
  variant?: 'primary' | 'brand' | 'secondary' | 'outline' | 'ghost' | 'brand-outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}, ref) => {

  const baseStyles =
    'group relative inline-flex items-center justify-center font-medium tracking-tight ' +
    'transition-[transform,background-color,border-color,box-shadow,color] duration-200 ease-out ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-glow focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
    'disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] rounded-sm';

  const variants = {
    primary:
      'bg-primary text-primary-foreground hover:bg-primary/90',
    brand:
      'bg-brand text-brand-foreground hover:bg-brand-soft ' +
      'shadow-[0_8px_24px_-12px_hsl(var(--brand-glow)/0.7)] hover:shadow-[0_12px_36px_-12px_hsl(var(--brand-glow)/0.9)]',
    secondary:
      'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline:
      'border border-input hover:bg-accent hover:text-accent-foreground',
    ghost:
      'hover:bg-accent hover:text-accent-foreground',
    'brand-outline':
      'border border-brand/40 text-foreground hover:border-brand hover:text-brand-soft hover:bg-brand/10',
  } as const;

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-12 px-8 py-3 text-base',
    lg: 'h-14 px-10 py-4 text-lg',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <TrackedButton ref={ref} className={classes} {...props} />
  );
});

Button.displayName = 'Button';
