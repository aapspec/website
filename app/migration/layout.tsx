import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Migration Guide',
  description: 'Step-by-step guide for migrating from OAuth Scopes to AAP Capabilities.',
  alternates: {
    canonical: '/migration',
  },
  openGraph: {
    title: 'Migration Guide',
    description: 'Step-by-step guide for migrating from OAuth Scopes to AAP Capabilities.',
    url: '/migration',
  },
};

export default function MigrationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
