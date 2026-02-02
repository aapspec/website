'use client';

import { useState, useEffect } from 'react';

export function useSchemas() {
  const [schemasLoaded, setSchemasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSchemas() {
      try {
        const response = await fetch('/api/schemas');
        const data = await response.json();

        if (data.success && data.schemas) {
          const { initializeSchemas } = await import(
            '@/lib/token-generator/schema-validator'
          );
          initializeSchemas(data.schemas);
          setSchemasLoaded(true);
        } else {
          setError(data.error || 'Failed to load schemas');
          console.error('Failed to load schemas:', data.error);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error fetching schemas';
        setError(message);
        console.error('Error fetching schemas:', err);
      }
    }

    loadSchemas();
  }, []);

  return { schemasLoaded, error };
}
