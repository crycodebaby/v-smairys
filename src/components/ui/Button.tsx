import React, { forwardRef } from 'react';
import { TrackedButton, TrackedButtonProps } from './TrackedButton';

export interface ButtonProps extends TrackedButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}, ref) => {
  
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-sm',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground rounded-sm',
    ghost: 'hover:bg-accent hover:text-accent-foreground rounded-sm',
  };

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
