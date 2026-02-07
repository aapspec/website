'use client';

import Link from 'next/link';
import { CheckCircle, ArrowRight, Shield, Rocket, HelpCircle, GitMerge } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/MotionWrappers';

const steps = [
  {
    number: 1,
    title: 'Understand AAP Basics',
    description: 'AAP extends OAuth 2.0 with structured claims for AI agents.',
    details: [
      'Agent identity (who is making the request)',
      'Capabilities with constraints (what actions are allowed)',
      'Task binding (purpose of the request)',
      'Delegation tracking (chain of authority)',
      'Human oversight (approval requirements)',
    ],
    action: {
      text: 'Read Specification',
      href: '/specification',
    },
  },
  {
    number: 2,
    title: 'Review JSON Schemas',
    description: 'Understand the token structure using formal schemas.',
    details: [
      'aap-token.schema.json - Complete token structure',
      'aap-agent.schema.json - Agent identity',
      'aap-capabilities.schema.json - Actions and constraints',
      'aap-constraints.schema.json - Rate limits, domains, time windows',
    ],
    action: {
      text: 'Explore Schemas',
      href: '/schemas',
    },
  },
  {
    number: 3,
    title: 'Set Up Authorization Server',
    description: 'Deploy an AS that issues AAP tokens.',
    codeExample: {
      title: 'Install Reference Implementation',
      code: `# Clone repository
git clone https://github.com/aapspec/spec.git
cd spec/reference-impl

# Install dependencies
pip install -r requirements.txt

# Generate keys
bash scripts/generate_keys.sh

# Configure policies
cp policies/org-acme-corp.json policies/my-org.json
# Edit my-org.json with your capabilities

# Start AS
cd as
python server.py`,
    },
    action: {
      text: 'View AS Documentation',
      href: '/reference-impl',
    },
  },
  {
    number: 4,
    title: 'Request Your First Token',
    description: 'Use Client Credentials flow to get an AAP token.',
    codeExample: {
      title: 'Request Token',
      code: `curl -X POST http://localhost:8080/token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=client_credentials" \\
  -d "client_id=agent-researcher-01" \\
  -d "client_secret=your-secret" \\
  -d "operator=org:acme-corp" \\
  -d "task_id=task-123" \\
  -d "task_purpose=research_articles" \\
  -d "capabilities=search.web,cms.draft" \\
  -d "audience=https://api.example.com"`,
    },
    action: {
      text: 'See Token Examples',
      href: '#token-example',
    },
  },
  {
    number: 5,
    title: 'Validate Tokens in Resource Server',
    description: 'Implement validation logic in your API.',
    codeExample: {
      title: 'Python Validation Example',
      code: `from rs.validator import TokenValidator, ValidationError

validator = TokenValidator(
    public_key=public_key,
    audience="https://api.example.com",
    trusted_issuers=["https://as.example.com"]
)

# Validate token
try:
    payload = validator.validate(token, request={
        "action": "search.web",
        "target_url": "https://example.org/data"
    })
    print("Token valid:", payload["agent"]["id"])
except ValidationError as e:
    print("Token invalid:", e.error_code, e.description)`,
    },
    action: {
      text: 'View RS Documentation',
      href: '/reference-impl',
    },
  },
  {
    number: 6,
    title: 'Test with Test Vectors',
    description: 'Validate your implementation against standard test cases.',
    details: [
      'Valid tokens - Should pass all validation',
      'Invalid tokens - Should fail with specific errors',
      'Constraint violations - Test rate limits, domains, etc.',
      'Edge cases - Clock skew, delegation depth, etc.',
    ],
    action: {
      text: 'Explore Test Vectors',
      href: '/test-vectors',
    },
  },
];

const nextSteps = [
  {
    title: 'Migrate from OAuth Scopes',
    description: 'Step-by-step guide for existing OAuth systems',
    href: '/migration',
    icon: GitMerge,
  },
  {
    title: 'Deploy to Production',
    description: 'Kubernetes, Docker, and cloud deployment patterns',
    href: '/deployment',
    icon: Rocket,
  },
  {
    title: 'Review Security Model',
    description: 'Understand threats and mitigations',
    href: '/threat-model',
    icon: Shield,
  },
  {
    title: 'Get Help',
    description: 'Find answers to common questions',
    href: '/faq',
    icon: HelpCircle,
  },
];

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <PageHeader
        title="Getting Started"
        description="Get up and running with AAP in 6 steps. From understanding the basics to validating your first token."
        breadcrumbs={[
          { label: 'Documentation', href: '/docs' },
          { label: 'Getting Started' },
        ]}
      />

      <div className="max-w-5xl mx-auto px-6 md:px-8 py-12 md:py-16">
        {/* What You'll Learn */}
        <FadeUp>
          <div className="mb-14 p-6 md:p-8 rounded-2xl border border-blue-200/60 dark:border-blue-800/40 bg-gradient-to-br from-blue-50/80 via-violet-50/50 to-blue-50/80 dark:from-blue-950/40 dark:via-violet-950/30 dark:to-blue-950/40 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">What You&apos;ll Learn</h2>
            <ul className="grid md:grid-cols-2 gap-3 text-sm">
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                <span className="text-zinc-700 dark:text-zinc-300">AAP token structure and claims</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                <span className="text-zinc-700 dark:text-zinc-300">Setting up Authorization Server</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                <span className="text-zinc-700 dark:text-zinc-300">Requesting AAP tokens</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                <span className="text-zinc-700 dark:text-zinc-300">Validating tokens in Resource Server</span>
              </li>
            </ul>
          </div>
        </FadeUp>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step) => (
            <FadeUp key={step.number}>
              <div
                id={`step-${step.number}`}
                className="relative pl-14 pb-8 border-l-2 border-zinc-200 dark:border-zinc-800 last:border-0"
              >
                {/* Step Number */}
                <div className="absolute left-0 top-0 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20">
                  {step.number}
                </div>

                {/* Step Content */}
                <div>
                  <h3 className="text-2xl font-semibold mb-2 text-zinc-900 dark:text-white">{step.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">{step.description}</p>

                  {/* Details List */}
                  {step.details && (
                    <ul className="mb-4 space-y-2">
                      {step.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                          <span className="text-zinc-700 dark:text-zinc-300">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Code Example */}
                  {step.codeExample && (
                    <div className="mb-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                      <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700">
                        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{step.codeExample.title}</span>
                      </div>
                      <pre className="p-4 overflow-x-auto text-sm">
                        <code className="text-zinc-800 dark:text-zinc-200">{step.codeExample.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Action Button */}
                  <Link
                    href={step.action.href}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-full text-sm font-semibold transition-all duration-200 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
                  >
                    {step.action.text}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Token Example */}
        <FadeUp>
          <section id="token-example" className="mt-16 relative overflow-hidden p-8 md:p-10 rounded-2xl bg-zinc-900 dark:bg-zinc-800/50 border border-zinc-700/50 dark:border-zinc-700/30">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10" />
            <div className="relative">
              <h2 className="text-2xl font-bold mb-3 text-white">Example AAP Token</h2>
              <p className="text-zinc-400 mb-6">
                A complete AAP token with all claims:
              </p>
              <pre className="bg-zinc-950 text-zinc-100 p-5 rounded-xl overflow-x-auto text-xs border border-zinc-800">
                <code>{`{
  "iss": "https://as.example.com",
  "sub": "spiffe://example.com/agent/researcher-01",
  "aud": ["https://api.example.com"],
  "exp": 1735689600,
  "iat": 1735686000,
  "jti": "unique-token-id",

  "agent": {
    "id": "agent-researcher-01",
    "type": "llm-autonomous",
    "operator": "org:acme-corp",
    "model": "gpt-4"
  },

  "task": {
    "id": "task-123",
    "purpose": "research_articles",
    "data_sensitivity": "public"
  },

  "capabilities": [
    {
      "action": "search.web",
      "constraints": {
        "domains_allowed": ["example.org", "wikipedia.org"],
        "max_requests_per_hour": 50
      }
    }
  ],

  "delegation": {
    "depth": 0,
    "max_depth": 2
  }
}`}</code>
              </pre>
            </div>
          </section>
        </FadeUp>

        {/* Next Steps */}
        <FadeUp>
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">Next Steps</h2>
            <StaggerContainer className="grid md:grid-cols-2 gap-4">
              {nextSteps.map((item) => {
                const Icon = item.icon;
                return (
                  <StaggerItem key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-start gap-4 p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 group-hover:scale-110 transition-transform duration-300 shrink-0">
                        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                          {item.title}
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </section>
        </FadeUp>
      </div>
    </div>
  );
}
