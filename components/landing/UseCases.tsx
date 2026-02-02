'use client';

import { useState } from 'react';
import { landingContent } from '@/lib/content/landing-en';
import { Section } from '@/components/shared/Section';
import { Card } from '@/components/shared/Card';
import { X, Check, AlertTriangle } from 'lucide-react';

export function UseCases() {
  const { useCases } = landingContent;
  const [activeTab, setActiveTab] = useState(useCases.cases[0].id);

  const activeCase = useCases.cases.find(c => c.id === activeTab) || useCases.cases[0];

  return (
    <Section id="use-cases" background="default" padding="lg" className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent" />

      <div className="relative">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
            {useCases.title}
          </h2>
          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
            {useCases.subtitle}
          </p>
        </div>

        {/* Enhanced tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {useCases.cases.map((useCase) => (
            <button
              key={useCase.id}
              onClick={() => setActiveTab(useCase.id)}
              className={`relative px-8 py-4 rounded-2xl font-semibold transition-all ${
                activeTab === useCase.id
                  ? 'bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-2xl shadow-blue-500/30 scale-105'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 hover:scale-105 hover:shadow-lg'
              }`}
            >
              {useCase.title}
            </button>
          ))}
        </div>

        {/* Active case content */}
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 p-10 rounded-3xl bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/20 dark:to-violet-950/20 border border-blue-200 dark:border-blue-900/30 shadow-xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-zinc-900 dark:text-white">Scenario</h3>
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {activeCase.scenario}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border-2 border-red-200 dark:border-red-900/30 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
                  Challenges
                </h3>
              </div>
              <ul className="space-y-4">
                {activeCase.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                    <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {challenge}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border-2 border-green-200 dark:border-green-900/30 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                  AAP Solution
                </h3>
              </div>
              <ul className="space-y-4">
                {activeCase.aapSolution.map((solution, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {solution}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
