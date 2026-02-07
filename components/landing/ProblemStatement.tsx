'use client';

import { landingContent } from '@/lib/content/landing-en';
import { Card } from '@/components/shared/Card';
import { Section } from '@/components/shared/Section';
import { Lock, HelpCircle, Link2, Eye, AlertTriangle, Zap } from 'lucide-react';
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/shared/MotionWrappers';

export function ProblemStatement() {
  const { problem } = landingContent;

  const iconComponents: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
    lock: Lock,
    fileQuestion: HelpCircle,
    chain: Link2,
    eye: Eye,
    alertTriangle: AlertTriangle,
    zap: Zap
  };

  return (
    <Section id="problem" background="dark" padding="lg">
      <FadeUp className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
          {problem.title}
        </h2>
        <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
          {problem.subtitle}
        </p>
      </FadeUp>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problem.challenges.map((challenge, index) => {
          const Icon = iconComponents[challenge.icon];
          return (
            <StaggerItem key={index}>
              <Card
                variant="glass"
                hover
                className="group relative overflow-hidden h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 text-white/80 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    {challenge.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {challenge.description}
                  </p>
                </div>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </Section>
  );
}
