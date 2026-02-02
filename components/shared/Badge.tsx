import React from 'react';

type BadgeVariant = 'info' | 'success' | 'warning' | 'neutral';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  neutral: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm'
};

export function Badge({
  variant = 'neutral',
  size = 'md',
  children,
  className = ''
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full font-medium';
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <span className={combinedClassName}>
      {children}
    </span>
  );
}
