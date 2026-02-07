'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { FadeUp } from './MotionWrappers';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
}

export function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <FadeUp>
            <nav className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                Home
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5" />
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-zinc-900 dark:text-white">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          </FadeUp>
        )}
        <FadeUp delay={0.1}>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {title}
          </h1>
        </FadeUp>
        {description && (
          <FadeUp delay={0.2}>
            <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl">
              {description}
            </p>
          </FadeUp>
        )}
      </div>
    </div>
  );
}
