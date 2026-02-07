import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Schemas',
  description: 'Formal JSON Schema definitions for AAP token validation and interoperability testing.',
  alternates: {
    canonical: '/schemas',
  },
  openGraph: {
    title: 'JSON Schemas',
    description: 'Formal JSON Schema definitions for AAP token validation and interoperability testing.',
    url: '/schemas',
  },
};

export default function SchemasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
