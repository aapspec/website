import Link from 'next/link';
import { Code, Server, Shield, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Reference Implementation - Agent Authorization Profile',
  description: 'Working Authorization Server and Resource Server implementations in Python.',
};

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
    loc: '~800',
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
    loc: '~700',
    path: 'rs',
  },
];

export default function ReferenceImplPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link href="/docs" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4 inline-block">
            ← Back to Documentation
          </Link>
          <h1 className="text-4xl font-bold mb-4">Reference Implementation</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            Production-ready Authorization Server and Resource Server implementations demonstrating all AAP features.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">1,500+</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">Lines of Python</div>
          </div>
          <div className="p-6 bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900 rounded-lg">
            <div className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">100%</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">Spec Coverage</div>
          </div>
          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">2-3ms</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">Token Validation</div>
          </div>
        </div>

        {/* Components */}
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <section key={index} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-semibold">{item.component}</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">{item.loc} LOC</span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-semibold mb-4">Features</h3>
                  <ul className="space-y-2">
                    {item.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-semibold mb-4">Source Files</h3>
                  <ul className="space-y-2">
                    {item.files.map((file, fIndex) => (
                      <li key={fIndex}>
                        <a
                          href={`/reference-impl/${item.path}/${file}`}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-mono"
                          download
                        >
                          {file}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <a
                      href={`/reference-impl/${item.path}/README.md`}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                      → View README
                    </a>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {/* Quick Start */}
        <section className="mb-12 p-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Code className="w-6 h-6" />
            Quick Start
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">1. Install Dependencies</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                <code>{`cd reference-impl
pip install -r requirements.txt`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">2. Generate Keys</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                <code>{`bash scripts/generate_keys.sh`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">3. Start Authorization Server</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                <code>{`cd as
python server.py`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">4. Start Resource Server</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                <code>{`cd rs
python server.py`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">5. Request Token</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                <code>{`curl -X POST http://localhost:8080/token \\
  -d grant_type=client_credentials \\
  -d client_id=agent-researcher-01 \\
  -d client_secret=secret \\
  -d operator=org:acme-corp \\
  -d capabilities=search.web`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section className="p-8 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950 dark:to-violet-950 rounded-lg border border-blue-200 dark:border-blue-900">
          <h2 className="text-2xl font-semibold mb-4">Download Implementation</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Get the complete reference implementation including AS, RS, policies, and documentation.
          </p>
          <a
            href="https://github.com/aap-protocol/spec/tree/main/reference-impl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            View on GitHub →
          </a>
        </section>
      </div>
    </div>
  );
}
