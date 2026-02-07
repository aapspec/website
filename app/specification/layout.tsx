import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Complete Specification',
  description: 'Full technical specification with formal schemas, semantics, and validation rules.',
  alternates: {
    canonical: '/specification',
  },
  openGraph: {
    title: 'Complete Specification',
    description: 'Full technical specification with formal schemas, semantics, and validation rules.',
    url: '/specification',
  },
};

export default function SpecificationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
