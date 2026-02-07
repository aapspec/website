import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Threat Model',
  description: 'Comprehensive threat analysis with 15 attack scenarios and mitigations.',
  alternates: {
    canonical: '/threat-model',
  },
  openGraph: {
    title: 'Threat Model',
    description: 'Comprehensive threat analysis with 15 attack scenarios and mitigations.',
    url: '/threat-model',
  },
};

export default function ThreatModelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
