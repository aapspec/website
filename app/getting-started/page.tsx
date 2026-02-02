import Link from 'next/link';
import { Zap, CheckCircle, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Getting Started - Agent Authorization Profile',
  description: 'Quick start guide to get up and running with AAP in minutes.',
};

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
git clone https://github.com/aap-protocol/spec.git
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
      code: `from aap_rs.validator import TokenValidator

validator = TokenValidator(
    as_public_key=as_public_key,
    rs_audience="https://api.example.com"
)

# Validate token
try:
    payload = validator.validate(token, request={
        "action": "search.web",
        "target_url": "https://example.org/data"
    })
    print("Token valid:", payload["agent"]["id"])
except ValidationError as e:
    print("Token invalid:", e)`,
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

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link href="/docs" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4 inline-block">
            ← Back to Documentation
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-10 h-10 text-yellow-500" />
            <h1 className="text-5xl font-bold">Getting Started</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Get up and running with AAP in 6 steps. From understanding the basics to validating your first token.
          </p>
        </div>

        {/* Quick Overview */}
        <div className="mb-12 p-6 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950 dark:to-violet-950 rounded-lg border border-blue-200 dark:border-blue-900">
          <h2 className="text-xl font-semibold mb-3">What You'll Learn</h2>
          <ul className="grid md:grid-cols-2 gap-3 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>AAP token structure and claims</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>Setting up Authorization Server</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>Requesting AAP tokens</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>Validating tokens in Resource Server</span>
            </li>
          </ul>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step) => (
            <div
              key={step.number}
              id={`step-${step.number}`}
              className="relative pl-12 pb-8 border-l-2 border-gray-200 dark:border-gray-800 last:border-0"
            >
              {/* Step Number */}
              <div className="absolute left-0 top-0 -translate-x-1/2 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                {step.number}
              </div>

              {/* Step Content */}
              <div>
                <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{step.description}</p>

                {/* Details List */}
                {step.details && (
                  <ul className="mb-4 space-y-2">
                    {step.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Code Example */}
                {step.codeExample && (
                  <div className="mb-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm font-semibold">{step.codeExample.title}</span>
                    </div>
                    <pre className="p-4 overflow-x-auto text-sm">
                      <code className="text-gray-800 dark:text-gray-200">{step.codeExample.code}</code>
                    </pre>
                  </div>
                )}

                {/* Action Button */}
                <Link
                  href={step.action.href}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  {step.action.text}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Token Example */}
        <section id="token-example" className="mt-16 p-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Example AAP Token</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            A complete AAP token with all claims:
          </p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-xs">
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
        </section>

        {/* Next Steps */}
        <section className="mt-16 p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border border-green-200 dark:border-green-900">
          <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/migration"
              className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-500 transition-colors"
            >
              <h3 className="font-semibold mb-2">Migrate from OAuth Scopes</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Step-by-step guide for existing OAuth systems
              </p>
            </Link>
            <Link
              href="/deployment"
              className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-500 transition-colors"
            >
              <h3 className="font-semibold mb-2">Deploy to Production</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Kubernetes, Docker, and cloud deployment patterns
              </p>
            </Link>
            <Link
              href="/threat-model"
              className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-500 transition-colors"
            >
              <h3 className="font-semibold mb-2">Review Security Model</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Understand threats and mitigations
              </p>
            </Link>
            <Link
              href="/faq"
              className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-500 transition-colors"
            >
              <h3 className="font-semibold mb-2">Get Help</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Find answers to common questions
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
