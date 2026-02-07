import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Getting Started',
  description: 'Quick start guide to get up and running with AAP in minutes.',
  alternates: {
    canonical: '/getting-started',
  },
  openGraph: {
    title: 'Getting Started',
    description: 'Quick start guide to get up and running with AAP in minutes.',
    url: '/getting-started',
  },
};

export default function GettingStartedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
