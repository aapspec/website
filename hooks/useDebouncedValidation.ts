'use client';

import { useState, useEffect, useRef } from 'react';
import type { ValidationResult } from '@/lib/token-generator/types';

export function useDebouncedValidation(
  payload: object,
  schemasLoaded: boolean,
  delay = 300
): ValidationResult {
  const [result, setResult] = useState<ValidationResult>({ valid: true, errors: [] });
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!schemasLoaded) {
      setResult({ valid: false, errors: [{ message: 'Loading schemas...' }] });
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const { validateTokenPayload } = await import(
          '@/lib/token-generator/schema-validator'
        );
        const validationResult = validateTokenPayload(payload);
        setResult(validationResult);
      } catch (error) {
        setResult({
          valid: false,
          errors: [
            { message: error instanceof Error ? error.message : 'Validation error' },
          ],
        });
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [payload, schemasLoaded, delay]);

  return result;
}
