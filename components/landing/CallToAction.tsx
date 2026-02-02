import { landingContent } from '@/lib/content/landing-en';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Section } from '@/components/shared/Section';
import { Github, MessageCircle, Book } from 'lucide-react';

export function CallToAction() {
  const { cta } = landingContent;

  const iconComponents: Record<string, any> = {
    github: Github,
    messageCircle: MessageCircle,
    book: Book
  };

  return (
    <Section id="cta" background="default" padding="lg" className="relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-violet-50/50 dark:via-blue-950/20 dark:to-violet-950/20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="relative max-w-6xl mx-auto">
        <div className="relative overflow-hidden text-center mb-20 p-12 md:p-20 rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-violet-600 text-white shadow-2xl">
          {/* Animated background patterns */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-violet-300 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob animation-delay-4000" />

          <div className="relative">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8">
              {cta.title}
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-3xl mx-auto leading-relaxed">
              {cta.subtitle}
            </p>
            <Button
              variant="primary"
              size="lg"
              href={cta.primaryAction.href}
              className="bg-white text-blue-600 hover:bg-zinc-50 shadow-2xl hover:shadow-blue-900/50 hover:scale-110 transition-all duration-300 text-lg px-12 py-6"
            >
              {cta.primaryAction.text}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cta.secondaryActions.map((action, index) => {
            const Icon = iconComponents[action.icon];
            return (
              <div
                key={index}
                className="group p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-300 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-900/30 dark:to-violet-900/30 text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <Button
                  variant="ghost"
                  href={action.href}
                  className="w-full font-semibold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400"
                >
                  {action.text}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
