import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about AAP, security, compliance, and implementation.',
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'FAQ',
    description: 'Frequently asked questions about AAP, security, compliance, and implementation.',
    url: '/faq',
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
