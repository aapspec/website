import { promises as fs } from 'fs';
import path from 'path';
import { MarkdownViewer } from '@/components/docs/MarkdownViewer';
import { TableOfContents } from '@/components/docs/TableOfContents';
import { PageHeader } from '@/components/shared/PageHeader';

function parseFaqJsonLd(markdown: string) {
  const faqItems: { question: string; answer: string }[] = [];
  const lines = markdown.split('\n');

  let currentQuestion = '';
  let currentAnswer: string[] = [];
  let inAnswer = false;

  for (const line of lines) {
    const questionMatch = line.match(/^###\s+Q\d+:\s+(.+)/);
    if (questionMatch) {
      if (currentQuestion && currentAnswer.length > 0) {
        faqItems.push({
          question: currentQuestion,
          answer: currentAnswer.join(' ').trim(),
        });
      }
      currentQuestion = questionMatch[1];
      currentAnswer = [];
      inAnswer = false;
      continue;
    }

    if (currentQuestion && line.startsWith('**A:**')) {
      inAnswer = true;
      const rest = line.replace('**A:**', '').trim();
      if (rest) currentAnswer.push(rest);
      continue;
    }

    if (inAnswer && line.startsWith('###')) {
      inAnswer = false;
      continue;
    }

    if (inAnswer && line.startsWith('---')) {
      inAnswer = false;
      continue;
    }

    if (inAnswer) {
      const cleaned = line
        .replace(/\*\*/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/^\s*[-*]\s+/, '- ')
        .replace(/^\|.*\|$/, '')
        .replace(/^```\w*$/, '')
        .trim();
      if (cleaned) currentAnswer.push(cleaned);
    }
  }

  if (currentQuestion && currentAnswer.length > 0) {
    faqItems.push({
      question: currentQuestion,
      answer: currentAnswer.join(' ').trim(),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export default async function FAQPage() {
  const filePath = path.join(process.cwd(), 'public', 'docs', 'FAQ.md');
  const markdown = await fs.readFile(filePath, 'utf-8');

  const faqJsonLd = parseFaqJsonLd(markdown);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHeader
        title="FAQ"
        description="Frequently asked questions about AAP, security, compliance, and implementation."
        breadcrumbs={[
          { label: 'Documentation', href: '/docs' },
          { label: 'FAQ' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-12">
          <div className="min-w-0">
            <MarkdownViewer content={markdown} syntaxHighlight={false} />
          </div>
          <div className="hidden lg:block">
            <TableOfContents markdown={markdown} />
          </div>
        </div>
      </div>
    </div>
  );
}
