import Link from 'next/link';

export const metadata = {
  title: 'JSON Schemas - Agent Authorization Profile',
  description: 'Formal JSON Schema definitions for AAP token validation and interoperability testing.',
};

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

export default function SchemasPage() {
  const coreSchemas = schemas.filter((s) => s.type === 'core');
  const componentSchemas = schemas.filter((s) => s.type === 'component');

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">JSON Schemas</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            Formal JSON Schema definitions for the Agent Authorization Profile. These schemas provide machine-readable validation
            for AAP tokens and enable automatic interoperability testing.
          </p>
        </div>

        {/* Key Features */}
        <div className="mb-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Key Features</h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
              <span><strong>JSON Schema Draft 2020-12</strong> - Latest schema standard with full feature support</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
              <span><strong>Formal ABNF Grammar</strong> - Action names validated against RFC-style grammar</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
              <span><strong>Precise Constraint Semantics</strong> - Rate limits, domain restrictions, time windows with clear enforcement rules</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
              <span><strong>Modular Design</strong> - Component schemas can be validated independently</span>
            </li>
          </ul>
        </div>

        {/* Core Schema */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Core Token Schema</h2>
          <div className="grid gap-4">
            {coreSchemas.map((schema) => (
              <div
                key={schema.file}
                className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{schema.name}</h3>
                  <a
                    href={`/schemas/${schema.file}`}
                    download
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Download
                  </a>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{schema.description}</p>
                <code className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {schema.file}
                </code>
              </div>
            ))}
          </div>
        </section>

        {/* Component Schemas */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Component Schemas</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {componentSchemas.map((schema) => (
              <div
                key={schema.file}
                className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{schema.name}</h3>
                  <a
                    href={`/schemas/${schema.file}`}
                    download
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Download
                  </a>
                </div>
                {schema.claim && (
                  <div className="mb-2">
                    <code className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded">
                      {schema.claim}
                    </code>
                  </div>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">{schema.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Usage Examples</h2>

          {/* JavaScript */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">JavaScript / Node.js</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{usageExamples.javascript}</code>
            </pre>
          </div>

          {/* Python */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Python</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{usageExamples.python}</code>
            </pre>
          </div>
        </section>

        {/* Constraint Semantics */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Constraint Semantics</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left p-3 font-semibold">Constraint</th>
                  <th className="text-left p-3 font-semibold">Type</th>
                  <th className="text-left p-3 font-semibold">Semantics</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100 dark:border-gray-900">
                  <td className="p-3"><code>max_requests_per_hour</code></td>
                  <td className="p-3">integer</td>
                  <td className="p-3">Fixed hourly window, resets at minute 0</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-900">
                  <td className="p-3"><code>max_requests_per_minute</code></td>
                  <td className="p-3">integer</td>
                  <td className="p-3">Sliding 60-second window</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-900">
                  <td className="p-3"><code>domains_allowed</code></td>
                  <td className="p-3">array[string]</td>
                  <td className="p-3">DNS suffix matching (rightmost)</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-900">
                  <td className="p-3"><code>time_window</code></td>
                  <td className="p-3">object</td>
                  <td className="p-3">Inclusive start, exclusive end (ISO 8601)</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-900">
                  <td className="p-3"><code>max_depth</code></td>
                  <td className="p-3">integer</td>
                  <td className="p-3">Maximum delegation depth (0-10)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <strong>Multiple constraints:</strong> Within a capability, all constraints use AND semantics (all must pass).
            Multiple capabilities with the same action use OR semantics (any matching capability allows).
          </p>
        </section>

        {/* CLI Tools */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">CLI Validation</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Using ajv-cli (JavaScript)</h3>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-sm">
                <code>npx ajv validate -s schemas/aap-token.schema.json -d token.json --spec=draft2020</code>
              </pre>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Using jsonschema (Python)</h3>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-sm">
                <code>python -m jsonschema schemas/aap-token.schema.json -i token.json</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Download All */}
        <section className="mb-12">
          <div className="p-6 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-900">
            <h2 className="text-xl font-semibold mb-3">Download All Schemas</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Get all JSON Schema files for offline validation and integration testing.
            </p>
            <a
              href="https://github.com/aap-protocol/spec/tree/main/schemas"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              View on GitHub →
            </a>
          </div>
        </section>

        {/* Related Resources */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Related Resources</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/docs/AAP_Complete_Draft_Specification.md"
              className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              <h3 className="font-semibold mb-2">Complete Specification</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Read the full AAP protocol specification</p>
            </Link>
            <Link
              href="/test-vectors"
              className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              <h3 className="font-semibold mb-2">Test Vectors</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">80+ test cases for validation testing</p>
            </Link>
            <Link
              href="/reference-impl"
              className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              <h3 className="font-semibold mb-2">Reference Implementation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Working AS and RS code examples</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
