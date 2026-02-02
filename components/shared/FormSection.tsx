/**
 * FormSection component - Wrapper for form sections with title
 */

import React from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  collapsible?: boolean;
}

export function FormSection({
  title,
  description,
  children,
  collapsible = false
}: FormSectionProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className="mb-8">
      <div className="mb-4">
        {collapsible ? (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {title}
            </h3>
            <svg
              className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        ) : (
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            {description}
          </p>
        )}
      </div>

      {(!collapsible || isOpen) && (
        <div className="space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}
