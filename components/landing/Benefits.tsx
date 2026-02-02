import { landingContent } from '@/lib/content/landing-en';
import { Card } from '@/components/shared/Card';
import { Section } from '@/components/shared/Section';
import { Shield, Clipboard, Settings, Check } from 'lucide-react';

export function Benefits() {
  const { benefits } = landingContent;

  const iconComponents: Record<string, any> = {
    shield: Shield,
    clipboard: Clipboard,
    settings: Settings
  };

  return (
    <Section id="benefits" background="muted" padding="lg" className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
            {benefits.title}
          </h2>
          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            {benefits.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 auto-rows-fr">
        {benefits.categories.map((category, index) => {
          const Icon = iconComponents[category.icon];
          return (
            <div key={index} className="h-full">
              <div className="p-10 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl h-full flex flex-col">
                <div className="mb-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg mb-8">
                    <Icon className="w-10 h-10" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-3xl font-bold text-zinc-900 dark:text-white">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-8 flex-1">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="rounded-xl transition-colors">
                      <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-3">
                        {item.title}
                      </h4>
                      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
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
