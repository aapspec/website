'use client';

import { Code, Server, Shield, CheckCircle, ArrowRight, Github, FileCode } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/MotionWrappers';

const features = [
  {
    component: 'Authorization Server',
    icon: Server,
    features: [
      'Client Credentials Grant (RFC 6749)',
      'Token Exchange (RFC 8693) with privilege reduction',
      'Policy-based capability evaluation',
      'ES256/RS256 token signing',
      'Delegation depth tracking',
      'Oversight requirements configuration',
    ],
    files: ['config.py', 'policy_engine.py', 'token_issuer.py', 'server.py'],
    loc: '~1,000',
    path: 'as',
  },
  {
    component: 'Resource Server',
    icon: Shield,
    features: [
      'Complete 7-step validation pipeline',
      'JWT signature verification',
      'Constraint enforcement (rate limits, domains, time windows)',
      'Capability matching with ABNF validation',
      'Privacy-preserving error messages',
      'Example protected endpoints',
    ],
    files: ['validator.py', 'capability_matcher.py', 'constraint_enforcer.py', 'server.py'],
    loc: '~850',
    path: 'rs',
  },
];

const quickStartSteps = [
  { title: '1. Install Dependencies', code: `cd reference-impl\npip install -r requirements.txt` },
  { title: '2. Generate Keys', code: `bash scripts/generate_keys.sh` },
  { title: '3. Start Authorization Server', code: `cd as\npython server.py` },
  { title: '4. Start Resource Server', code: `cd rs\npython server.py` },
  {
    title: '5. Request Token',
    code: `curl -X POST http://localhost:8080/token \\
  -d grant_type=client_credentials \\
  -d client_id=agent-researcher-01 \\
  -d client_secret=secret \\
  -d operator=org:acme-corp \\
  -d capabilities=search.web`,
  },
];

export default function ReferenceImplPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <PageHeader
        title="Reference Implementation"
        description="Production-ready Authorization Server and Resource Server implementations demonstrating all AAP features."
        breadcrumbs={[
          { label: 'Documentation', href: '/docs' },
          { label: 'Reference Implementation' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
        {/* Quick Stats */}
        <StaggerContainer className="grid grid-cols-3 gap-4 md:gap-6 mb-14">
          <StaggerItem>
            <div className="p-5 md:p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">1,800+</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Lines of Python</div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="p-5 md:p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-violet-500/30 dark:hover:border-violet-500/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="text-2xl md:text-3xl font-bold text-violet-600 dark:text-violet-400 mb-1">Core</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Spec Coverage</div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="p-5 md:p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-green-500/30 dark:hover:border-green-500/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">2-3ms</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Token Validation</div>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Components */}
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <section key={index} className="mb-14">
              <FadeUp>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">{item.component}</h2>
                  <span className="px-2.5 py-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-full">{item.loc} LOC</span>
                </div>
              </FadeUp>

              <StaggerContainer className="grid md:grid-cols-2 gap-6">
                <StaggerItem>
                  <div className="h-full p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl">
                    <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Features</h3>
                    <ul className="space-y-2.5">
                      {item.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                          <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="h-full p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl">
                    <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Source Files</h3>
                    <ul className="space-y-2.5">
                      {item.files.map((file, fIndex) => (
                        <li key={fIndex}>
                          <a
                            href={`https://github.com/aapspec/reference-impl/blob/main/${item.path}/${file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors font-mono"
                          >
                            <FileCode className="w-3.5 h-3.5" />
                            {file}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <a
                        href={`https://github.com/aapspec/reference-impl/tree/main/${item.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                      >
                        View README
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </section>
          );
        })}

        {/* Quick Start */}
        <FadeUp>
          <section className="mb-14 p-8 md:p-10 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-zinc-900 dark:text-white">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30">
                <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              Quick Start
            </h2>

            <div className="space-y-5">
              {quickStartSteps.map((step, i) => (
                <div key={i}>
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{step.title}</h3>
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                    <pre className="p-4 overflow-x-auto text-sm">
                      <code className="text-zinc-800 dark:text-zinc-200">{step.code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeUp>

        {/* Download Section */}
        <FadeUp>
          <section className="relative overflow-hidden p-8 md:p-10 rounded-2xl bg-zinc-900 dark:bg-zinc-800/50 border border-zinc-700/50 dark:border-zinc-700/30">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10" />
            <div className="relative">
              <h2 className="text-xl font-bold mb-3 text-white">Download Implementation</h2>
              <p className="text-zinc-400 mb-6">
                Get the complete reference implementation including AS, RS, policies, and documentation.
              </p>
              <a
                href="https://github.com/aapspec/reference-impl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 rounded-full font-semibold hover:bg-zinc-100 hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Github className="w-4 h-4" />
                View on GitHub
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </section>
        </FadeUp>
      </div>
    </div>
  );
}
