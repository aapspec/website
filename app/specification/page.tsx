import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { MarkdownViewer } from '@/components/docs/MarkdownViewer';
import { TableOfContents } from '@/components/docs/TableOfContents';

export const metadata = {
  title: 'Complete Specification - Agent Authorization Profile',
  description: 'Full technical specification with formal schemas, semantics, and validation rules.',
};

export default async function SpecificationPage() {
  const filePath = path.join(process.cwd(), 'public', 'docs', 'AAP_Complete_Draft_Specification.md');
  const markdown = await fs.readFile(filePath, 'utf-8');

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Link href="/docs" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4 inline-block">
            ← Back to Documentation
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-12">
          <div className="min-w-0">
            <MarkdownViewer content={markdown} />
          </div>
          <div className="hidden lg:block">
            <TableOfContents markdown={markdown} />
          </div>
        </div>
      </div>
    </div>
  );
}
