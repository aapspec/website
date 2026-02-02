/**
 * FormField component - Input field with label and error handling
 */

import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  required = false,
  error,
  hint,
  children,
  className = ''
}: FormFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {children}

      {hint && !error && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {hint}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
