import React from 'react';

type SectionBackground = 'default' | 'muted' | 'dark';
type SectionPadding = 'sm' | 'md' | 'lg' | 'xl';

interface SectionProps {
  id?: string;
  background?: SectionBackground;
  padding?: SectionPadding;
  container?: boolean;
  className?: string;
  children: React.ReactNode;
}

const backgroundStyles: Record<SectionBackground, string> = {
  default: 'bg-white dark:bg-black',
  muted: 'bg-zinc-50 dark:bg-zinc-950',
  dark: 'bg-zinc-900 dark:bg-zinc-950'
};

const paddingStyles: Record<SectionPadding, string> = {
  sm: 'py-12',
  md: 'py-16 md:py-24',
  lg: 'py-20 md:py-32',
  xl: 'py-24 md:py-40'
};

export function Section({
  id,
  background = 'default',
  padding = 'lg',
  container = true,
  className = '',
  children
}: SectionProps) {
  const baseStyles = 'w-full';
  const containerStyles = container ? 'px-6 md:px-8 max-w-7xl mx-auto' : '';
  const combinedClassName = `${baseStyles} ${backgroundStyles[background]} ${paddingStyles[padding]} ${className}`;

  return (
    <section id={id} className={combinedClassName}>
      <div className={containerStyles}>
        {children}
      </div>
    </section>
  );
}
