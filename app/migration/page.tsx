import { promises as fs } from 'fs';
import path from 'path';
import { MarkdownViewer } from '@/components/docs/MarkdownViewer';
import { TableOfContents } from '@/components/docs/TableOfContents';
import { PageHeader } from '@/components/shared/PageHeader';

export default async function MigrationPage() {
  const filePath = path.join(process.cwd(), 'public', 'docs', 'Migration_Guide.md');
  const markdown = await fs.readFile(filePath, 'utf-8');

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <PageHeader
        title="Migration Guide"
        description="Step-by-step guide for migrating from OAuth Scopes to AAP Capabilities."
        breadcrumbs={[
          { label: 'Documentation', href: '/docs' },
          { label: 'Migration Guide' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
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
