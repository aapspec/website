'use client';

import { Shield, CheckCircle, ExternalLink } from 'lucide-react';
import { TokenGeneratorClient } from './TokenGeneratorClient';
import { FadeUp, StaggerContainer, StaggerItem, ScaleUp } from '@/components/shared/MotionWrappers';

const quickInfoItems = [
  {
    title: 'OAuth 2.0',
    desc: 'Built on standards',
    icon: Shield,
    accent: 'text-blue-600 dark:text-blue-400',
    hoverBorder: 'hover:border-blue-500/30 dark:hover:border-blue-500/30',
  },
  {
    title: 'Schema Validated',
    desc: 'Real-time checks',
    icon: CheckCircle,
    accent: 'text-green-600 dark:text-green-400',
    hoverBorder: 'hover:border-green-500/30 dark:hover:border-green-500/30',
  },
  {
    title: 'jwt.io Ready',
    desc: 'Fully compatible',
    icon: ExternalLink,
    accent: 'text-violet-600 dark:text-violet-400',
    hoverBorder: 'hover:border-violet-500/30 dark:hover:border-violet-500/30',
  },
];

export default function TokenGeneratorPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-violet-500/5 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-5">
          <FadeUp>
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-blue-200/60 dark:border-blue-800/40 bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/40 dark:to-violet-950/40 text-sm font-medium text-blue-600 dark:text-blue-400 mb-4">
              Now with Schema Validation
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white">
              AAP Token Generator
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Generate compliant Agent Authorization Profile JWT tokens with real-time validation and jwt.io compatibility.
            </p>
          </FadeUp>

          {/* Quick Info */}
          <StaggerContainer className="grid grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto pt-8">
            {quickInfoItems.map((item) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={item.title}>
                  <div className={`group p-5 md:p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 ${item.hoverBorder} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                    <div className="flex justify-center mb-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 group-hover:scale-110 transition-transform duration-300">
                        <Icon className={`w-5 h-5 ${item.accent}`} />
                      </div>
                    </div>
                    <div className={`text-lg md:text-xl font-bold ${item.accent} mb-1`}>
                      {item.title}
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      {item.desc}
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Client Component (Form - untouched) */}
        <ScaleUp>
          <TokenGeneratorClient />
        </ScaleUp>
      </div>
    </div>
  );
}
