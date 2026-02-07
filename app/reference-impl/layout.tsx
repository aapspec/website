import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reference Implementation',
  description: 'Working Authorization Server and Resource Server implementations in Python.',
  alternates: {
    canonical: '/reference-impl',
  },
  openGraph: {
    title: 'Reference Implementation',
    description: 'Working Authorization Server and Resource Server implementations in Python.',
    url: '/reference-impl',
  },
};

export default function ReferenceImplLayout({ children }: { children: React.ReactNode }) {
  return children;
}
