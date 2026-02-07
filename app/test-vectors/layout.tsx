import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test Vectors',
  description: '70+ test cases covering all specification sections, constraints, and edge cases.',
  alternates: {
    canonical: '/test-vectors',
  },
  openGraph: {
    title: 'Test Vectors',
    description: '70+ test cases covering all specification sections, constraints, and edge cases.',
    url: '/test-vectors',
  },
};

export default function TestVectorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
