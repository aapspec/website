import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deployment Patterns',
  description: 'Kubernetes, Docker, and cloud provider deployment examples and best practices.',
  alternates: {
    canonical: '/deployment',
  },
  openGraph: {
    title: 'Deployment Patterns',
    description: 'Kubernetes, Docker, and cloud provider deployment examples and best practices.',
    url: '/deployment',
  },
};

export default function DeploymentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
