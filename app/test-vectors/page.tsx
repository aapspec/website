import { promises as fs } from 'fs';
import path from 'path';
import { PageHeader } from '@/components/shared/PageHeader';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/MotionWrappers';
import { TestVectorCategory } from './TestVectorCategory';

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
      } catch {
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
      <PageHeader
        title="Test Vectors"
        description="Comprehensive test cases for AAP token validation. Use these to verify your implementation against the specification."
        breadcrumbs={[
          { label: 'Documentation', href: '/docs' },
          { label: 'Test Vectors' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
        {/* Total count badge */}
        <FadeUp>
          <div className="mb-10 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/40 dark:to-violet-950/40 border border-blue-200/60 dark:border-blue-800/40">
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalTests}</span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">test cases across all categories</span>
          </div>
        </FadeUp>

        {/* Quick Stats */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {testVectors.map((category, index) => (
            <StaggerItem key={index}>
              <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{category.count}</div>
                <div className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">{category.title}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">{category.description}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Test Vector Categories */}
        {testVectors.map((category, categoryIndex) => (
          <section key={categoryIndex} className="mb-14">
            <FadeUp>
              <h2 className="text-2xl font-semibold mb-2 text-zinc-900 dark:text-white">{category.title}</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">{category.description}</p>
            </FadeUp>

            <FadeUp>
              <TestVectorCategory category={category} />
            </FadeUp>
          </section>
        ))}

        {/* Usage Guide */}
        <FadeUp>
          <section className="mt-16 relative overflow-hidden p-8 md:p-10 rounded-2xl bg-zinc-900 dark:bg-zinc-800/50 border border-zinc-700/50 dark:border-zinc-700/30">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10" />

            <div className="relative">
              <h2 className="text-2xl font-bold mb-4 text-white">Using Test Vectors</h2>
              <div className="space-y-4 text-sm text-zinc-300">
                <p>
                  Test vectors are organized by category. Each vector includes a token payload and expected validation results.
                </p>
                <div className="bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
                  <div className="px-4 py-2.5 bg-zinc-800/80 border-b border-zinc-700">
                    <span className="text-sm font-semibold text-zinc-300">Python Example</span>
                  </div>
                  <pre className="p-4 overflow-x-auto text-xs text-zinc-100">
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
            </div>
          </section>
        </FadeUp>
      </div>
    </div>
  );
}
