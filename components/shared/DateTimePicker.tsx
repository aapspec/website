/**
 * DateTimePicker component - Helper for Unix timestamp inputs
 */

'use client';

import React, { useState } from 'react';
import { FormField } from './FormField';

interface DateTimePickerProps {
  value: number;
  onChange: (timestamp: number) => void;
  label: string;
  required?: boolean;
  hint?: string;
}

export function DateTimePicker({
  value,
  onChange,
  label,
  required = false,
  hint
}: DateTimePickerProps) {
  const [mode, setMode] = useState<'relative' | 'absolute'>('relative');

  const handleRelative = (hours: number) => {
    const timestamp = Math.floor(Date.now() / 1000) + (hours * 3600);
    onChange(timestamp);
  };

  const handleAbsolute = (dateTimeString: string) => {
    if (!dateTimeString) return;
    const timestamp = Math.floor(new Date(dateTimeString).getTime() / 1000);
    onChange(timestamp);
  };

  const formatTimestamp = (ts: number) => {
    try {
      return new Date(ts * 1000).toISOString();
    } catch {
      return 'Invalid date';
    }
  };

  const toDateTimeLocal = (ts: number) => {
    try {
      const date = new Date(ts * 1000);
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    } catch {
      return '';
    }
  };

  return (
    <FormField
      label={label}
      required={required}
      hint={hint || `Current: ${formatTimestamp(value)} (${value})`}
    >
      <div className="space-y-2">
        <div className="flex gap-2">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as 'relative' | 'absolute')}
            className="px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="relative">Relative</option>
            <option value="absolute">Absolute</option>
          </select>

          {mode === 'relative' ? (
            <select
              onChange={(e) => handleRelative(Number(e.target.value))}
              className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select time offset...</option>
              <option value="0.25">15 minutes from now</option>
              <option value="0.5">30 minutes from now</option>
              <option value="1">1 hour from now</option>
              <option value="6">6 hours from now</option>
              <option value="24">1 day from now</option>
              <option value="168">1 week from now</option>
              <option value="720">30 days from now</option>
            </select>
          ) : (
            <input
              type="datetime-local"
              value={toDateTimeLocal(value)}
              onChange={(e) => handleAbsolute(e.target.value)}
              className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        </div>
      </div>
    </FormField>
  );
}
