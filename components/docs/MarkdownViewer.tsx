'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export function MarkdownViewer({ content, className = '' }: MarkdownViewerProps) {
  return (
    <div className={`prose prose-zinc dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Custom code block styling
          code: ({ node, className, children, ...props }: any) => {
            const inline = !className;
            const match = /language-(\w+)/.exec(className || '');
            return !inline ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code
                className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Custom table styling
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                {children}
              </table>
            </div>
          ),
          // Custom heading with anchor links
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-semibold mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-semibold mt-6 mb-3">
              {children}
            </h3>
          ),
          // Custom link styling
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          // Custom blockquote styling
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-950 rounded-r">
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
