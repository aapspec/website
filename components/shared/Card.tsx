import React from 'react';

type CardVariant = 'elevated' | 'outlined' | 'glass';

interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  elevated: 'bg-white dark:bg-zinc-900 shadow-md',
  outlined: 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800',
  glass: 'bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-white/10 dark:border-white/10'
};

export function Card({
  variant = 'elevated',
  className = '',
  children,
  hover = false
}: CardProps) {
  const baseStyles = 'rounded-2xl p-6 transition-all';
  const hoverStyles = hover ? 'hover:shadow-lg hover:-translate-y-1' : '';
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`;

  return (
    <div className={combinedClassName}>
      {children}
    </div>
  );
}
