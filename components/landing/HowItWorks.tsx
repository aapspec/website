import { landingContent } from '@/lib/content/landing-en';
import { Section } from '@/components/shared/Section';

export function HowItWorks() {
  const { howItWorks } = landingContent;

  return (
      <Section
          id="how-it-works"
          background="muted"
          padding="lg"
          className="relative overflow-hidden"
      >
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[32px_32px]" />

          <div className="relative">
              <div className="text-center mb-20">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
                      {howItWorks.title}
                  </h2>
                  <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
                      {howItWorks.subtitle}
                  </p>
              </div>

              <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {howItWorks.steps.map((step, index) => (
                          <div key={index} className="group">
                              <div className="relative h-full p-8 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col items-center text-center overflow-hidden">
                                  {/* Number badge - top left corner */}
                                  <div className="absolute top-0 left-0 px-4 py-2 rounded-tl-2xl rounded-br-2xl bg-linear-to-br from-blue-500 via-blue-600 to-violet-600 text-white font-bold text-base group-hover:rounded-br-2xl group-hover:from-blue-600 group-hover:to-violet-700 transition-all duration-300">
                                      <span className="relative z-10">
                                          {step.number}
                                      </span>
                                      <div className="absolute inset-0 bg-white/10 opacity-0 rounded-br-2xl group-hover:opacity-100 transition-opacity duration-300" />
                                  </div>

                                  {/* Actor badge */}
                                  <div className="inline-block px-4 py-2 rounded-full bg-linear-to-br from-blue-500/10 to-violet-500/10 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4 border border-blue-200 dark:border-blue-800">
                                      {getActorLabel(step.actor)}
                                  </div>

                                  {/* Title */}
                                  <h3 className="text-2xl font-bold mb-3 text-zinc-900 dark:text-white">
                                      {step.title}
                                  </h3>

                                  {/* Description */}
                                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                      {step.description}
                                  </p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </Section>
  );
}

function getActorLabel(actor: string): string {
  const labels: Record<string, string> = {
    operator: 'Operator',
    agent: 'Agent',
    as: 'Authorization Server',
    rs: 'Resource Server',
    system: 'System'
  };
  return labels[actor] || actor;
}
