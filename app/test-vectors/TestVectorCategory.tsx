'use client';

import { ChevronDown, Download } from 'lucide-react';

interface Vector {
  filename: string;
  description?: string;
  name?: string;
  [key: string]: unknown;
}

interface Category {
  name: string;
  title: string;
  description: string;
  count: number;
  vectors: Vector[];
}

export function TestVectorCategory({ category }: { category: Category }) {
  return (
    <div className="space-y-3">
      {category.vectors.map((vector, vectorIndex) => (
        <details
          key={vectorIndex}
          className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300"
        >
          <summary className="px-6 py-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <code className="text-sm text-blue-600 dark:text-blue-400 font-mono shrink-0">
                {vector.filename}
              </code>
              <span className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                {vector.description || vector.name}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-zinc-400 transition-transform duration-200 group-open:rotate-180 shrink-0 ml-3" />
          </summary>

          <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-800">
            <pre className="text-xs overflow-x-auto p-4 bg-zinc-900 dark:bg-zinc-800 text-zinc-100 rounded-xl border border-zinc-800 dark:border-zinc-700">
              <code>{JSON.stringify(vector, null, 2)}</code>
            </pre>
            <div className="mt-4">
              <a
                href={`/test-vectors/${category.name}/${vector.filename}`}
                download
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download JSON
              </a>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
