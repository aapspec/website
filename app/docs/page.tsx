import Link from 'next/link';
import { Book, FileCode, Shield, HelpCircle, Database, Code, Rocket, AlertTriangle, FileText, Zap } from 'lucide-react';

export const metadata = {
  title: 'Documentation - Agent Authorization Profile',
  description: 'Complete documentation for AAP including specification, guides, and reference implementation.',
};

interface DocCard {
  title: string;
  description: string;
  href: string;
  icon: any;
  badge?: string;
}

const docSections: { title: string; cards: DocCard[] }[] = [
  {
    title: 'Getting Started',
    cards: [
      {
        title: 'Quick Start Guide',
        description: 'Get up and running with AAP in minutes. Learn the basics and create your first AAP token.',
        href: '/getting-started',
        icon: Zap,
        badge: 'Start here',
      },
      {
        title: 'Complete Specification',
        description: 'Full technical specification with formal schemas, semantics, and validation rules.',
        href: '/specification',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Implementation',
    cards: [
      {
        title: 'Reference Implementation',
        description: 'Working Authorization Server and Resource Server implementations in Python.',
        href: '/reference-impl',
        icon: Code,
      },
      {
        title: 'JSON Schemas',
        description: 'Formal JSON Schema definitions for AAP token validation and interoperability testing.',
        href: '/schemas',
        icon: FileCode,
      },
      {
        title: 'Test Vectors',
        description: '80+ test cases covering all specification sections, constraints, and edge cases.',
        href: '/test-vectors',
        icon: Database,
      },
    ],
  },
  {
    title: 'Guides',
    cards: [
      {
        title: 'Migration Guide',
        description: 'Step-by-step guide for migrating from OAuth Scopes to AAP Capabilities.',
        href: '/migration',
        icon: Book,
      },
      {
        title: 'Deployment Patterns',
        description: 'Kubernetes, Docker, and cloud provider deployment examples and best practices.',
        href: '/deployment',
        icon: Rocket,
      },
      {
        title: 'FAQ',
        description: 'Frequently asked questions about AAP, security, compliance, and implementation.',
        href: '/faq',
        icon: HelpCircle,
      },
    ],
  },
  {
    title: 'Security',
    cards: [
      {
        title: 'Threat Model',
        description: 'Comprehensive threat analysis with 15 attack scenarios and mitigations.',
        href: '/threat-model',
        icon: Shield,
      },
      {
        title: 'Security Considerations',
        description: 'Cryptographic recommendations, proof-of-possession, and security profiles.',
        href: '/specification#security',
        icon: AlertTriangle,
      },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4">Documentation</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
            Complete documentation for the Agent Authorization Profile. From getting started guides to deep technical specifications.
          </p>
        </div>

        <div className="mb-16 p-6 bg-linear-to-br from-blue-50 to-violet-50 dark:from-blue-950 dark:to-violet-950 rounded-lg border border-blue-200 dark:border-blue-900">
          <h2 className="text-lg font-semibold mb-3">Quick Access</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/getting-started" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              → Quick Start
            </Link>
            <Link href="/specification" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              → Read Spec
            </Link>
            <Link href="/reference-impl" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              → View Code
            </Link>
            <Link href="/faq" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              → Get Help
            </Link>
          </div>
        </div>

        {docSections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">{section.title}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.cards.map((card, cardIndex) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={cardIndex}
                    href={card.href}
                    className="group p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      {card.badge && (
                        <span className="px-2 py-1 text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                          {card.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {card.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        <section className="mt-16 p-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Community & Support</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Join the AAP community, contribute to the specification, or get help with implementation.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/aap-protocol/spec"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              View on GitHub
            </a>
            <a
              href="https://github.com/aap-protocol/spec/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Join Discussions
            </a>
            <a
              href="https://github.com/aap-protocol/spec/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Report Issues
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
