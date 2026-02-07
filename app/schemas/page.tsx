'use client';

import Link from 'next/link';
import { Download, FileText, Database, Code, CheckCircle, ArrowRight, Github } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/MotionWrappers';

interface Schema {
  name: string;
  file: string;
  description: string;
  claim?: string;
  type: 'core' | 'component';
}

const schemas: Schema[] = [
  {
    name: 'AAP Token',
    file: 'aap-token.schema.json',
    description: 'Complete schema for AAP JWT payload. Validates all required and optional claims.',
    type: 'core',
  },
  {
    name: 'Agent Identity',
    file: 'aap-agent.schema.json',
    description: 'Agent identity claim with id, type, operator, and model information.',
    claim: 'agent',
    type: 'component',
  },
  {
    name: 'Task Binding',
    file: 'aap-task.schema.json',
    description: 'Task context including id, purpose, and creator information.',
    claim: 'task',
    type: 'component',
  },
  {
    name: 'Capabilities',
    file: 'aap-capabilities.schema.json',
    description: 'Array of capabilities with action names and constraints.',
    claim: 'capabilities',
    type: 'component',
  },
  {
    name: 'Constraints',
    file: 'aap-constraints.schema.json',
    description: 'Rate limits, domain restrictions, time windows, and data constraints.',
    type: 'component',
  },
  {
    name: 'Oversight',
    file: 'aap-oversight.schema.json',
    description: 'Human oversight requirements and approval workflows.',
    claim: 'oversight',
    type: 'component',
  },
  {
    name: 'Delegation',
    file: 'aap-delegation.schema.json',
    description: 'Delegation chain tracking with depth and lineage.',
    claim: 'delegation',
    type: 'component',
  },
  {
    name: 'Context',
    file: 'aap-context.schema.json',
    description: 'Execution context including environment and runtime metadata.',
    claim: 'context',
    type: 'component',
  },
  {
    name: 'Audit',
    file: 'aap-audit.schema.json',
    description: 'Audit logging requirements and compliance frameworks.',
    claim: 'audit',
    type: 'component',
  },
];

const usageExamples = {
  javascript: `// Node.js example using ajv
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv();
addFormats(ajv);

// Load schemas
const tokenSchema = require('./aap-token.schema.json');
const agentSchema = require('./aap-agent.schema.json');

// Add schemas to validator
ajv.addSchema(agentSchema);
ajv.addSchema(taskSchema);

// Validate a token
const validate = ajv.compile(tokenSchema);
const valid = validate(tokenPayload);

if (!valid) {
  console.error('Validation errors:', validate.errors);
}`,
  python: `# Python example using jsonschema
import jsonschema
import json

# Load schemas
with open('aap-token.schema.json') as f:
    token_schema = json.load(f)

# Create resolver for $ref
resolver = jsonschema.RefResolver.from_schema(
    token_schema,
    store={
        'aap-agent.schema.json': agent_schema,
    }
)

# Validate token
try:
    jsonschema.validate(
        instance=token_payload,
        schema=token_schema,
        resolver=resolver
    )
    print("Token is valid")
except jsonschema.ValidationError as e:
    print(f"Validation error: {e.message}")`,
};

const relatedResources = [
  {
    title: 'Complete Specification',
    description: 'Read the full AAP protocol specification',
    href: '/specification',
    icon: FileText,
  },
  {
    title: 'Test Vectors',
    description: '80+ test cases for validation testing',
    href: '/test-vectors',
    icon: Database,
  },
  {
    title: 'Reference Implementation',
    description: 'Working AS and RS code examples',
    href: '/reference-impl',
    icon: Code,
  },
];

export default function SchemasPage() {
  const coreSchemas = schemas.filter((s) => s.type === 'core');
  const componentSchemas = schemas.filter((s) => s.type === 'component');

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <PageHeader
        title="JSON Schemas"
        description="Formal JSON Schema definitions for the Agent Authorization Profile. These schemas provide machine-readable validation for AAP tokens and enable automatic interoperability testing."
        breadcrumbs={[
          { label: 'Documentation', href: '/docs' },
          { label: 'JSON Schemas' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 md:px-8 py-12 md:py-16">
        {/* Key Features */}
        <FadeUp>
          <div className="mb-14 p-6 md:p-8 rounded-2xl border border-blue-200/60 dark:border-blue-800/40 bg-gradient-to-br from-blue-50/80 via-violet-50/50 to-blue-50/80 dark:from-blue-950/40 dark:via-violet-950/30 dark:to-blue-950/40 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">Key Features</h2>
            <ul className="space-y-3 text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                <span><strong>JSON Schema Draft 2020-12</strong> - Latest schema standard with full feature support</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                <span><strong>Formal ABNF Grammar</strong> - Action names validated against RFC-style grammar</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                <span><strong>Precise Constraint Semantics</strong> - Rate limits, domain restrictions, time windows with clear enforcement rules</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                <span><strong>Modular Design</strong> - Component schemas can be validated independently</span>
              </li>
            </ul>
          </div>
        </FadeUp>

        {/* Core Schema */}
        <section className="mb-14">
          <FadeUp>
            <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-white">Core Token Schema</h2>
          </FadeUp>
          <FadeUp>
            <div className="grid gap-4">
              {coreSchemas.map((schema) => (
                <div
                  key={schema.file}
                  className="group p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{schema.name}</h3>
                    <a
                      href={`/schemas/${schema.file}`}
                      download
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-3">{schema.description}</p>
                  <code className="text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">
                    {schema.file}
                  </code>
                </div>
              ))}
            </div>
          </FadeUp>
        </section>

        {/* Component Schemas */}
        <section className="mb-14">
          <FadeUp>
            <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-white">Component Schemas</h2>
          </FadeUp>
          <StaggerContainer className="grid md:grid-cols-2 gap-4">
            {componentSchemas.map((schema) => (
              <StaggerItem key={schema.file}>
                <div className="group h-full p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{schema.name}</h3>
                    <a
                      href={`/schemas/${schema.file}`}
                      download
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                  </div>
                  {schema.claim && (
                    <div className="mb-2">
                      <code className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/40 dark:to-violet-900/40 px-2.5 py-1 rounded-full">
                        {schema.claim}
                      </code>
                    </div>
                  )}
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{schema.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Usage Examples */}
        <section className="mb-14">
          <FadeUp>
            <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-white">Usage Examples</h2>
          </FadeUp>

          <div className="space-y-6">
            <FadeUp>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">JavaScript / Node.js</span>
                </div>
                <pre className="p-4 overflow-x-auto text-sm">
                  <code className="text-zinc-800 dark:text-zinc-200">{usageExamples.javascript}</code>
                </pre>
              </div>
            </FadeUp>

            <FadeUp>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Python</span>
                </div>
                <pre className="p-4 overflow-x-auto text-sm">
                  <code className="text-zinc-800 dark:text-zinc-200">{usageExamples.python}</code>
                </pre>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Constraint Semantics */}
        <section className="mb-14">
          <FadeUp>
            <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-white">Constraint Semantics</h2>
          </FadeUp>
          <FadeUp>
            <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                    <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Constraint</th>
                    <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Type</th>
                    <th className="text-left p-4 font-semibold text-zinc-900 dark:text-white">Semantics</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                    <td className="p-4"><code className="text-blue-600 dark:text-blue-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">max_requests_per_hour</code></td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-400">integer</td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-400">Fixed hourly window, resets at minute 0</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                    <td className="p-4"><code className="text-blue-600 dark:text-blue-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">max_requests_per_minute</code></td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-400">integer</td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-400">Sliding 60-second window</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                    <td className="p-4"><code className="text-blue-600 dark:text-blue-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">domains_allowed</code></td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-400">array[string]</td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-400">DNS suffix matching (rightmost)</td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800/50">
                    <td className="p-4"><code className="text-blue-600 dark:text-blue-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">time_window</code></td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-400">object</td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-400">Inclusive start, exclusive end (ISO 8601)</td>
                  </tr>
                  <tr>
                    <td className="p-4"><code className="text-blue-600 dark:text-blue-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">max_depth</code></td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-400">integer</td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-400">Maximum delegation depth (0-10)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              <strong>Multiple constraints:</strong> Within a capability, all constraints use AND semantics (all must pass).
              Multiple capabilities with the same action use OR semantics (any matching capability allows).
            </p>
          </FadeUp>
        </section>

        {/* CLI Validation */}
        <section className="mb-14">
          <FadeUp>
            <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-white">CLI Validation</h2>
          </FadeUp>
          <FadeUp>
            <div className="space-y-4">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Using ajv-cli (JavaScript)</span>
                </div>
                <pre className="p-4 overflow-x-auto text-sm">
                  <code className="text-zinc-800 dark:text-zinc-200">npx ajv validate -s schemas/aap-token.schema.json -d token.json --spec=draft2020</code>
                </pre>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Using jsonschema (Python)</span>
                </div>
                <pre className="p-4 overflow-x-auto text-sm">
                  <code className="text-zinc-800 dark:text-zinc-200">python -m jsonschema schemas/aap-token.schema.json -i token.json</code>
                </pre>
              </div>
            </div>
          </FadeUp>
        </section>

        {/* Download All */}
        <FadeUp>
          <section className="mb-14 relative overflow-hidden p-8 md:p-10 rounded-2xl bg-zinc-900 dark:bg-zinc-800/50 border border-zinc-700/50 dark:border-zinc-700/30">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10" />
            <div className="relative">
              <h2 className="text-xl font-bold mb-3 text-white">Download All Schemas</h2>
              <p className="text-zinc-400 mb-6">
                Get all JSON Schema files for offline validation and integration testing.
              </p>
              <a
                href="https://github.com/aapspec/schemas"
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

        {/* Related Resources */}
        <section>
          <FadeUp>
            <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-white">Related Resources</h2>
          </FadeUp>
          <StaggerContainer className="grid md:grid-cols-3 gap-4">
            {relatedResources.map((resource) => {
              const Icon = resource.icon;
              return (
                <StaggerItem key={resource.href}>
                  <Link
                    href={resource.href}
                    className="group flex items-start gap-4 h-full p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 group-hover:scale-110 transition-transform duration-300 shrink-0">
                      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{resource.description}</p>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>
      </div>
    </div>
  );
}
