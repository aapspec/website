'use client';

import Link from 'next/link';
import { Book, FileCode, Shield, HelpCircle, Database, Code, Rocket, AlertTriangle, FileText, Zap, ArrowRight, Github, MessageCircle, Bug } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/MotionWrappers';

interface DocCard {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
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
        description: '70+ test cases covering all specification sections, constraints, and edge cases.',
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

const quickLinks = [
  { label: 'Quick Start', href: '/getting-started', icon: Zap },
  { label: 'Read Spec', href: '/specification', icon: FileText },
  { label: 'View Code', href: '/reference-impl', icon: Code },
  { label: 'Get Help', href: '/faq', icon: HelpCircle },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <PageHeader
        title="Documentation"
        description="Complete documentation for the Agent Authorization Profile. From getting started guides to deep technical specifications."
        breadcrumbs={[{ label: 'Documentation' }]}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
        {/* Quick Access */}
        <FadeUp>
          <div className="mb-16 p-6 md:p-8 rounded-2xl border border-blue-200/60 dark:border-blue-800/40 bg-gradient-to-br from-blue-50/80 via-violet-50/50 to-blue-50/80 dark:from-blue-950/40 dark:via-violet-950/30 dark:to-blue-950/40 backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Quick Access</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/70 dark:bg-zinc-900/50 border border-blue-100 dark:border-blue-900/50 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-zinc-800/70 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all duration-200"
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                );
              })}
            </div>
          </div>
        </FadeUp>

        {/* Doc Sections */}
        {docSections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="mb-14">
            <FadeUp>
              <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-white">{section.title}</h2>
            </FadeUp>
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.cards.map((card, cardIndex) => {
                const Icon = card.icon;
                return (
                  <StaggerItem key={cardIndex}>
                    <Link
                      href={card.href}
                      className="group block h-full p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        {card.badge && (
                          <span className="px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-blue-100 to-violet-100 dark:from-blue-900/40 dark:to-violet-900/40 text-blue-700 dark:text-blue-300 rounded-full">
                            {card.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        {card.title}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {card.description}
                      </p>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </section>
        ))}

        {/* Community & Support */}
        <FadeUp>
          <section className="mt-16 relative overflow-hidden p-8 md:p-12 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 dark:from-zinc-800/50 dark:via-zinc-900/50 dark:to-zinc-800/50 border border-zinc-700/50 dark:border-zinc-700/30">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10" />

            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">Community & Support</h2>
              <p className="text-zinc-400 mb-8 max-w-2xl text-lg">
                Join the AAP community, contribute to the specification, or get help with implementation.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/aapspec/spec"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 rounded-full font-semibold hover:bg-zinc-100 hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <Github className="w-4 h-4" />
                  View on GitHub
                </a>
                <a
                  href="https://github.com/aapspec/spec/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-600 text-zinc-200 rounded-full font-semibold hover:bg-zinc-800 hover:border-zinc-500 transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  Join Discussions
                </a>
                <a
                  href="https://github.com/aapspec/spec/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-600 text-zinc-200 rounded-full font-semibold hover:bg-zinc-800 hover:border-zinc-500 transition-all duration-200"
                >
                  <Bug className="w-4 h-4" />
                  Report Issues
                </a>
              </div>
            </div>
          </section>
        </FadeUp>
      </div>
    </div>
  );
}
