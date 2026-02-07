'use client';

import { landingContent } from '@/lib/content/landing-en';
import { Section } from '@/components/shared/Section';
import { FadeUp } from '@/components/shared/MotionWrappers';
import { motion } from 'framer-motion';

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
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative">
        <FadeUp className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
            {howItWorks.title}
          </h2>
          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
            {howItWorks.subtitle}
          </p>
        </FadeUp>

        {/* Desktop: Two rows of 3 */}
        <div className="hidden lg:block max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {howItWorks.steps.slice(0, 3).map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.15, ease: [0.25, 0.4, 0.25, 1] }}
                className="relative"
              >
                <StepCard step={step} />
                {index < 2 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                    className="absolute top-12 -right-4 w-8 h-[2px] bg-gradient-to-r from-blue-500 to-violet-500 origin-left"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Connector between rows */}
          <div className="flex justify-end pr-[16.67%] my-4">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.3, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
              className="w-[2px] h-8 bg-gradient-to-b from-violet-500 to-blue-500 origin-top"
            />
          </div>

          <div className="grid grid-cols-3 gap-8">
            {howItWorks.steps.slice(3, 6).map((step, index) => (
              <motion.div
                key={index + 3}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.15, ease: [0.25, 0.4, 0.25, 1] }}
                className="relative"
              >
                <StepCard step={step} />
                {index < 2 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.15 + 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                    className="absolute top-12 -right-4 w-8 h-[2px] bg-gradient-to-r from-blue-500 to-violet-500 origin-left"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="lg:hidden max-w-xl mx-auto">
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500 via-violet-500 to-blue-500" />

            <div className="space-y-8">
              {howItWorks.steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
                  className="relative pl-16"
                >
                  <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/25 z-10">
                    {step.number}
                  </div>

                  <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-lg border border-zinc-200 dark:border-zinc-800">
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3 border border-blue-200 dark:border-blue-800">
                      {getActorLabel(step.actor)}
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function StepCard({ step }: { step: { number: number; title: string; description: string; actor: string } }) {
  return (
    <div className="group h-full p-8 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col items-center text-center overflow-hidden relative">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/25 mb-4">
        {step.number}
      </div>

      <div className="inline-block px-4 py-2 rounded-full bg-linear-to-br from-blue-500/10 to-violet-500/10 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4 border border-blue-200 dark:border-blue-800">
        {getActorLabel(step.actor)}
      </div>

      <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">
        {step.title}
      </h3>

      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
        {step.description}
      </p>
    </div>
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
