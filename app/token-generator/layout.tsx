import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AAP Token Generator',
  description: 'Generate and validate Agent Authorization Profile (AAP) JWT tokens compatible with jwt.io.',
  alternates: {
    canonical: '/token-generator',
  },
  openGraph: {
    title: 'AAP Token Generator',
    description: 'Generate and validate Agent Authorization Profile (AAP) JWT tokens compatible with jwt.io.',
    url: '/token-generator',
  },
};

export default function TokenGeneratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
