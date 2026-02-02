'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { useState, useEffect } from 'react';
import 'highlight.js/styles/github-dark.css';
import { Copy, Check } from 'lucide-react';

function CopyButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    const pre = e.currentTarget.closest('.group')?.querySelector('pre');
    const code = pre?.textContent;
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-700/50 hover:bg-zinc-600/50 rounded-lg transition-all duration-200 border border-zinc-600/50"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-400" strokeWidth={2} />
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" strokeWidth={2} />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

export function DocsContent({ content }: { content: string }) {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    const headings = document.querySelectorAll('h2[id], h3[id]');
    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  // Extract table of contents from markdown
  const tocItems: { id: string; text: string; level: number }[] = [];
  const lines = content.split('\n');
  lines.forEach((line) => {
    const h2Match = line.match(/^## (.+)/);
    const h3Match = line.match(/^### (.+)/);
    if (h2Match) {
      const text = h2Match[1].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      tocItems.push({ id, text, level: 2 });
    } else if (h3Match) {
      const text = h3Match[1].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      tocItems.push({ id, text, level: 3 });
    }
  });

  return (
    <div className="flex gap-12 max-w-[1400px] mx-auto px-6 py-12">
      {/* Table of Contents - Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto">
        <div className="pb-4 mb-4 border-b-2 border-blue-500/20">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            On This Page
          </h2>
        </div>
        <nav className="space-y-0.5">
          {tocItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block py-2 px-3 text-sm rounded-md transition-all ${
                item.level === 3 ? 'pl-6 text-xs' : 'font-medium'
              } ${
                activeSection === item.id
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-l-2 border-blue-600'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
              }`}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <article className="flex-1 min-w-0 pb-20">
        <div className="
          prose prose-zinc dark:prose-invert max-w-none

          /* Base text styling */
          [&]:text-[17px] [&]:leading-[1.75]

          /* Headings - Make them pop */
          [&_h1]:text-5xl [&_h1]:font-extrabold [&_h1]:tracking-tight
          [&_h1]:text-zinc-900 dark:[&_h1]:text-zinc-50
          [&_h1]:mb-6 [&_h1]:mt-16 [&_h1]:pb-6
          [&_h1]:border-b-4 [&_h1]:border-gradient-to-r [&_h1]:from-blue-600 [&_h1]:to-violet-600
          [&_h1]:bg-gradient-to-r [&_h1]:from-blue-600 [&_h1]:to-violet-600 [&_h1]:bg-clip-text [&_h1]:text-transparent
          [&_h1]:scroll-mt-24

          [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:tracking-tight
          [&_h2]:text-zinc-900 dark:[&_h2]:text-zinc-50
          [&_h2]:mb-6 [&_h2]:mt-14 [&_h2]:pb-4
          [&_h2]:border-b-2 [&_h2]:border-zinc-200 dark:[&_h2]:border-zinc-800
          [&_h2]:scroll-mt-24

          [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:tracking-tight
          [&_h3]:text-zinc-800 dark:[&_h3]:text-zinc-100
          [&_h3]:mb-4 [&_h3]:mt-10
          [&_h3]:scroll-mt-24

          [&_h4]:text-xl [&_h4]:font-semibold
          [&_h4]:text-zinc-800 dark:[&_h4]:text-zinc-100
          [&_h4]:mb-3 [&_h4]:mt-8

          /* Paragraphs - Better readability */
          [&_p]:text-[17px] [&_p]:leading-[1.8]
          [&_p]:text-zinc-700 dark:[&_p]:text-zinc-300
          [&_p]:mb-6 [&_p]:font-normal
          [&_p]:max-w-[75ch]

          /* Links - More prominent */
          [&_a]:text-blue-600 dark:[&_a]:text-blue-400
          [&_a]:font-medium [&_a]:no-underline
          [&_a]:decoration-2 [&_a]:underline-offset-2
          hover:[&_a]:underline hover:[&_a]:text-blue-700 dark:hover:[&_a]:text-blue-300

          /* Inline code - Better visibility */
          [&_:not(pre)>code]:text-[14px] [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:font-semibold
          [&_:not(pre)>code]:bg-blue-50 dark:[&_:not(pre)>code]:bg-blue-950/40
          [&_:not(pre)>code]:text-blue-800 dark:[&_:not(pre)>code]:text-blue-200
          [&_:not(pre)>code]:px-2 [&_:not(pre)>code]:py-1 [&_:not(pre)>code]:rounded-md
          [&_:not(pre)>code]:border [&_:not(pre)>code]:border-blue-200/50 dark:[&_:not(pre)>code]:border-blue-800/50
          [&_:not(pre)>code]:before:content-[''] [&_:not(pre)>code]:after:content-['']

          /* Lists - Better spacing and bullets */
          [&_ul]:my-8 [&_ul]:space-y-3
          [&_ul]:list-none [&_ul]:pl-0
          [&_ul>li]:relative [&_ul>li]:pl-8
          [&_ul>li]:text-[17px] [&_ul>li]:leading-relaxed
          [&_ul>li]:text-zinc-700 dark:[&_ul>li]:text-zinc-300
          [&_ul>li]:before:content-['▸'] [&_ul>li]:before:absolute
          [&_ul>li]:before:left-0 [&_ul>li]:before:text-blue-600 dark:[&_ul>li]:before:text-blue-400
          [&_ul>li]:before:font-bold

          [&_ol]:my-8 [&_ol]:space-y-3
          [&_ol]:list-decimal [&_ol]:pl-8
          [&_ol]:marker:text-blue-600 dark:[&_ol]:marker:text-blue-400
          [&_ol]:marker:font-semibold
          [&_ol>li]:text-[17px] [&_ol>li]:leading-relaxed
          [&_ol>li]:text-zinc-700 dark:[&_ol>li]:text-zinc-300
          [&_ol>li]:pl-2

          /* Nested lists */
          [&_li>ul]:mt-3 [&_li>ul]:mb-2
          [&_li>ol]:mt-3 [&_li>ol]:mb-2

          /* Tables - Clean and modern */
          [&_table]:w-full [&_table]:my-10
          [&_table]:border-collapse
          [&_table]:text-[15px]
          [&_table]:bg-white dark:[&_table]:bg-zinc-900
          [&_table]:rounded-xl [&_table]:overflow-hidden
          [&_table]:shadow-lg [&_table]:border [&_table]:border-zinc-200 dark:[&_table]:border-zinc-800

          [&_thead]:bg-gradient-to-r [&_thead]:from-zinc-50 [&_thead]:to-zinc-100
          dark:[&_thead]:from-zinc-800 dark:[&_thead]:to-zinc-850
          [&_thead]:border-b-2 [&_thead]:border-zinc-300 dark:[&_thead]:border-zinc-700

          [&_th]:p-4 [&_th]:text-left [&_th]:font-bold
          [&_th]:text-zinc-900 dark:[&_th]:text-zinc-100
          [&_th]:text-sm [&_th]:uppercase [&_th]:tracking-wider

          [&_td]:p-4 [&_td]:text-zinc-700 dark:[&_td]:text-zinc-300
          [&_td]:border-t [&_td]:border-zinc-200 dark:[&_td]:border-zinc-800

          [&_tbody_tr]:transition-colors
          hover:[&_tbody_tr]:bg-zinc-50 dark:hover:[&_tbody_tr]:bg-zinc-800/50

          /* Blockquotes - Standout style */
          [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500
          [&_blockquote]:bg-blue-50/50 dark:[&_blockquote]:bg-blue-950/20
          [&_blockquote]:pl-6 [&_blockquote]:pr-6 [&_blockquote]:py-4
          [&_blockquote]:my-8 [&_blockquote]:rounded-r-lg
          [&_blockquote]:italic
          [&_blockquote]:text-zinc-700 dark:[&_blockquote]:text-zinc-300
          [&_blockquote_p]:my-2

          /* Strong/Bold text */
          [&_strong]:font-bold [&_strong]:text-zinc-900 dark:[&_strong]:text-zinc-50

          /* Emphasis/Italic */
          [&_em]:italic [&_em]:text-zinc-800 dark:[&_em]:text-zinc-200

          /* Horizontal rules */
          [&_hr]:border-0 [&_hr]:h-px
          [&_hr]:bg-gradient-to-r [&_hr]:from-transparent [&_hr]:via-zinc-300 dark:[&_hr]:via-zinc-700 [&_hr]:to-transparent
          [&_hr]:my-16
        ">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
            components={{
              h1: ({ children, ...props }) => {
                const text = String(children);
                const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return <h1 id={id} {...props}>{children}</h1>;
              },
              h2: ({ children, ...props }) => {
                const text = String(children);
                const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return <h2 id={id} {...props}>{children}</h2>;
              },
              h3: ({ children, ...props }) => {
                const text = String(children);
                const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return <h3 id={id} {...props}>{children}</h3>;
              },
              // Enhanced code blocks with beautiful design
              pre: ({ children, ...props }) => {
                // Extract language from className if present
                const child = children as any;
                const className = child?.props?.className || '';
                const language = className.replace('language-', '') || 'text';

                return (
                  <div className="not-prose my-8 group">
                    {/* Code block container */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 shadow-2xl border border-zinc-700/50">
                      {/* Header bar */}
                      <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                          {/* Traffic light dots */}
                          <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                          </div>
                          {/* Language badge */}
                          <span className="ml-3 px-2.5 py-1 text-xs font-semibold text-zinc-400 bg-zinc-700/50 rounded-md border border-zinc-600/50">
                            {language}
                          </span>
                        </div>
                        {/* Copy button */}
                        <CopyButton />
                      </div>
                      {/* Code content */}
                      <div className="overflow-x-auto">
                        <pre {...props} className="!my-0 !bg-transparent !border-0 !shadow-none px-6 py-5">
                          {children}
                        </pre>
                      </div>
                    </div>
                  </div>
                );
              },
              // Style the code element inside pre
              code: ({ className, children, ...props }) => {
                const isInline = !className;
                if (isInline) {
                  return <code className={className} {...props}>{children}</code>;
                }
                return (
                  <code
                    className={`${className} !text-[15px] !leading-relaxed font-mono`}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              // Enhance tables with wrapper
              table: ({ children, ...props }) => (
                <div className="not-prose overflow-x-auto my-10 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
                  <table className="w-full border-collapse text-[15px] bg-white dark:bg-zinc-900" {...props}>
                    {children}
                  </table>
                </div>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
