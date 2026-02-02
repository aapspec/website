'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = 'json',
  filename,
  showLineNumbers = false,
  className = ''
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const lines = code.split('\n');

  return (
    <div className={`not-prose my-8 group ${className}`}>
      {/* Code block container */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#0d1117] via-[#0d1117] to-[#010409] shadow-2xl border border-zinc-800/50 ring-1 ring-white/5">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {/* Traffic light dots */}
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-zinc-700/50"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-700/50"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-700/50"></div>
            </div>
            {/* Language/Filename badge */}
            <div className="flex items-center gap-2">
              {filename && (
                <span className="text-xs font-medium text-zinc-400">
                  {filename}
                </span>
              )}
              {!filename && (
                <span className="px-2.5 py-1 text-xs font-semibold text-zinc-400 bg-zinc-800/50 rounded-md border border-zinc-700/50">
                  {language.toUpperCase()}
                </span>
              )}
            </div>
          </div>
          {/* Copy button */}
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-lg transition-all duration-200 border border-zinc-700/50 hover:border-zinc-600/50"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" strokeWidth={2} />
                <span className="text-green-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" strokeWidth={2} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        {/* Code content */}
        <div className="overflow-x-auto">
          <pre className="p-6 text-xs leading-relaxed">
            <code className="font-mono text-zinc-100">
              {showLineNumbers ? (
                <table className="w-full border-collapse">
                  <tbody>
                    {lines.map((line, i) => (
                      <tr key={i}>
                        <td className="pr-4 text-right text-zinc-600 select-none w-10 align-top">
                          <span className="font-mono text-xs">{i + 1}</span>
                        </td>
                        <td className="text-zinc-100 align-top">
                          <span className="inline-block">{line || '\u00A0'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                code
              )}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
