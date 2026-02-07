'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

interface MarkdownViewerProps {
  content: string;
  className?: string;
  syntaxHighlight?: boolean;
}

const languageLabels: Record<string, string> = {
  http: 'HTTP',
  python: 'Python',
  bash: 'Bash',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  json: 'JSON',
  yaml: 'YAML',
  go: 'Go',
  rust: 'Rust',
  java: 'Java',
  shell: 'Shell',
  sh: 'Shell',
};

function getLanguageFromChildren(children: React.ReactNode): string | null {
  if (!children || typeof children !== 'object') return null;
  const child = Array.isArray(children) ? children[0] : children;
  if (child && typeof child === 'object' && 'props' in child) {
    const className = child.props?.className || '';
    const match = /language-(\w+)/.exec(className);
    return match ? match[1] : null;
  }
  return null;
}

export function MarkdownViewer({ content, className = '', syntaxHighlight = true }: MarkdownViewerProps) {
  const rehypePlugins = syntaxHighlight ? [rehypeHighlight, rehypeRaw] : [rehypeRaw];

  return (
    <div className={`prose prose-zinc dark:prose-invert max-w-none prose-p:text-zinc-600 prose-p:dark:text-zinc-400 prose-p:leading-relaxed prose-strong:text-zinc-900 prose-strong:dark:text-white prose-li:text-zinc-600 prose-li:dark:text-zinc-400 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={rehypePlugins}
        components={{
          // Custom pre block styling (wraps code blocks)
          pre: ({ children }) => {
            const lang = getLanguageFromChildren(children);
            const label = lang ? languageLabels[lang] || lang : null;
            return (
              <div className="not-prose my-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 dark:bg-zinc-900 overflow-hidden shadow-sm">
                {label && (
                  <div className="px-4 py-2 bg-zinc-800 dark:bg-zinc-800/80 border-b border-zinc-700 dark:border-zinc-700">
                    <span className="text-xs font-semibold text-zinc-400">{label}</span>
                  </div>
                )}
                <pre className="p-4 overflow-x-auto text-sm !bg-transparent !m-0">
                  {children}
                </pre>
              </div>
            );
          },
          // Custom code block styling
          code: ({ node, className, children, ...props }: any) => {
            const inline = !className;
            return !inline ? (
              <code className={`${className} !text-zinc-100`} {...props}>
                {children}
              </code>
            ) : (
              <code
                className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-200 font-medium"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Custom table styling
          table: ({ children }) => (
            <div className="not-prose overflow-x-auto my-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-900 dark:text-white">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/50">
              {children}
            </td>
          ),
          // Horizontal rule
          hr: () => (
            <div className="not-prose my-10">
              <div className="h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent" />
            </div>
          ),
          // Custom heading with anchor links
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold mt-8 mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold mt-12 mb-4 pb-3 border-b border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold mt-8 mb-3 text-zinc-900 dark:text-white">
              {children}
            </h3>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className="my-4 space-y-1.5 pl-5 list-disc marker:text-zinc-400 dark:marker:text-zinc-600">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 space-y-1.5 pl-5 list-decimal marker:text-zinc-400 dark:marker:text-zinc-600">
              {children}
            </ol>
          ),
          li: ({ children, ...props }: any) => (
            <li className="text-[0.95rem] leading-relaxed pl-1" {...props}>
              {children}
            </li>
          ),
          // Paragraphs
          p: ({ children }) => (
            <p className="text-[0.95rem] leading-relaxed my-3 text-zinc-600 dark:text-zinc-400">
              {children}
            </p>
          ),
          // Strong text
          strong: ({ children }) => (
            <strong className="font-semibold text-zinc-900 dark:text-white">
              {children}
            </strong>
          ),
          // Custom link styling
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          // Custom blockquote styling
          blockquote: ({ children }) => (
            <blockquote className="not-prose border-l-4 border-blue-500 pl-5 py-3 my-6 bg-blue-50/50 dark:bg-blue-950/30 rounded-r-xl text-sm text-zinc-600 dark:text-zinc-400">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
