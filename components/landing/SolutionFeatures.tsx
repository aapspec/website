import { landingContent } from '@/lib/content/landing-en';
import { CodeBlock } from '@/components/shared/CodeBlock';
import { Section } from '@/components/shared/Section';
import { User, Key, Target, GitBranch, UserCheck, Shield } from 'lucide-react';

const iconMap: Record<string, any> = {
  user: User,
  key: Key,
  target: Target,
  gitBranch: GitBranch,
  userCheck: UserCheck,
  shield: Shield,
};

export function SolutionFeatures() {
  const { solution } = landingContent;

  return (
    <Section id="solution" background="default" padding="lg" className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 -right-64 w-96 h-96 bg-violet-200 dark:bg-violet-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />

      <div className="relative">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
            {solution.title}
          </h2>
          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            {solution.subtitle}
          </p>
        </div>

        <div className="space-y-40">
          {solution.features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Shield;
            return (
              <div
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''} group`}>
                  <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 blur-2xl bg-gradient-to-br from-blue-500 to-violet-500 opacity-30 group-hover:opacity-50 transition-opacity" />
                    <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-2xl shadow-blue-500/30 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''} group`}>
                  <div className="relative">
                    <div className="absolute -inset-4 bg-linear-to-r from-blue-500/20 to-violet-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <CodeBlock code={feature.code} language="json" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
