import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Complete documentation for AAP including specification, guides, and reference implementation.',
  alternates: {
    canonical: '/docs',
  },
  openGraph: {
    title: 'Documentation',
    description: 'Complete documentation for AAP including specification, guides, and reference implementation.',
    url: '/docs',
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
