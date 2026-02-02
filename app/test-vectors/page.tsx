import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';

export const metadata = {
  title: 'Test Vectors - Agent Authorization Profile',
  description: '80+ test cases covering all specification sections, constraints, and edge cases.',
};

async function getTestVectors() {
  const basePath = path.join(process.cwd(), 'public', 'test-vectors');
  
  const categories = [
    { name: 'valid-tokens', title: 'Valid Tokens', description: 'Tokens that should pass validation' },
    { name: 'invalid-tokens', title: 'Invalid Tokens', description: 'Tokens that should fail validation' },
    { name: 'constraint-violations', title: 'Constraint Violations', description: 'Tests for constraint enforcement' },
    { name: 'edge-cases', title: 'Edge Cases', description: 'Clock skew, delegation limits, and edge scenarios' },
  ];

  const testVectors = await Promise.all(
    categories.map(async (category) => {
      const categoryPath = path.join(basePath, category.name);
      try {
        const files = await fs.readdir(categoryPath);
        const jsonFiles = files.filter(f => f.endsWith('.json'));
        
        const vectors = await Promise.all(
          jsonFiles.map(async (file) => {
            const content = await fs.readFile(path.join(categoryPath, file), 'utf-8');
            const data = JSON.parse(content);
            return {
              filename: file,
              ...data
            };
          })
        );

        return {
          ...category,
          count: vectors.length,
          vectors
        };
      } catch (error) {
        return {
          ...category,
          count: 0,
          vectors: []
        };
      }
    })
  );

  return testVectors;
}

export default async function TestVectorsPage() {
  const testVectors = await getTestVectors();
  const totalTests = testVectors.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link href="/docs" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4 inline-block">
            ← Back to Documentation
          </Link>
          <h1 className="text-4xl font-bold mb-4">Test Vectors</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            Comprehensive test cases for AAP token validation. Use these to verify your implementation against the specification.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalTests}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">test cases</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {testVectors.map((category, index) => (
            <div key={index} className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{category.count}</div>
              <div className="text-sm font-semibold mb-1">{category.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{category.description}</div>
            </div>
          ))}
        </div>

        {/* Test Vector Categories */}
        {testVectors.map((category, categoryIndex) => (
          <section key={categoryIndex} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{category.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{category.description}</p>

            <div className="space-y-4">
              {category.vectors.map((vector, vectorIndex) => (
                <details
                  key={vectorIndex}
                  className="group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden"
                >
                  <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <code className="text-sm text-blue-600 dark:text-blue-400 font-mono">
                        {vector.filename}
                      </code>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {vector.description || vector.name}
                      </span>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>

                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
                    <pre className="text-xs overflow-x-auto p-4 bg-gray-900 dark:bg-gray-800 text-gray-100 rounded">
                      <code>{JSON.stringify(vector, null, 2)}</code>
                    </pre>
                    <div className="mt-4 flex gap-2">
                      <a
                        href={`/test-vectors/${category.name}/${vector.filename}`}
                        download
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Download JSON
                      </a>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        {/* Usage Guide */}
        <section className="mt-16 p-8 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950 dark:to-violet-950 rounded-lg border border-blue-200 dark:border-blue-900">
          <h2 className="text-2xl font-semibold mb-4">Using Test Vectors</h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <p>
              Test vectors are organized by category. Each vector includes a token payload and expected validation results.
            </p>
            <div>
              <h3 className="font-semibold mb-2">Python Example:</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-xs">
{`import json
from your_implementation import validate_token

# Load test vector
with open('valid-tokens/01-basic-research-agent.json') as f:
    test_vector = json.load(f)

# Validate
result = validate_token(test_vector['token_payload'])
assert result == test_vector['expected_result']`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
