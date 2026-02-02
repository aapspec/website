import { landingContent } from '@/lib/content/landing-en';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { Section } from '@/components/shared/Section';
import { Shield, Lock, CheckCircle } from 'lucide-react';

export function Hero() {
  const { hero } = landingContent;

  return (
    <Section id="hero" padding="xl" className="min-h-screen flex items-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-violet-50 dark:from-blue-950/20 dark:via-black dark:to-violet-950/20" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Gradient orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-violet-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000" />

      <div className="relative flex flex-col items-center text-center max-w-6xl mx-auto">
        {/* Badge with glow */}
        <div className="relative mb-8">
          <div className="absolute inset-0 blur-xl bg-blue-500/30 dark:bg-blue-500/20 rounded-full" />
          <Badge variant="info" className="relative shadow-lg backdrop-blur-sm">
            {hero.badge}
          </Badge>
        </div>

        {/* Main heading with better hierarchy */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-8 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent animate-fade-in-up">
          {hero.title}
        </h1>

        <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-zinc-600 dark:text-zinc-400 mb-6 max-w-4xl animate-fade-in-up animation-delay-200">
          {hero.subtitle}
        </p>

        <p className="text-base md:text-lg lg:text-xl leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-3xl mb-12 animate-fade-in-up animation-delay-400">
          {hero.description}
        </p>

        {/* CTAs with enhanced styling */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in-up animation-delay-600">
          <Button
            variant="primary"
            size="lg"
            href={hero.primaryCta.href}
            className="shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200"
          >
            {hero.primaryCta.text}
          </Button>
          <Button
            variant="outline"
            size="lg"
            href={hero.secondaryCta.href}
            className="backdrop-blur-sm hover:bg-white/50 dark:hover:bg-zinc-900/50"
          >
            {hero.secondaryCta.text}
          </Button>
        </div>

        {/* Stats/Features row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-4xl animate-fade-in-up animation-delay-800">
          <div className="flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-3">
              <Shield className="w-6 h-6" strokeWidth={2} />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">5 Claims</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Structured JWT Extensions</div>
          </div>

          <div className="flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 mb-3">
              <CheckCircle className="w-6 h-6" strokeWidth={2} />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">9 Schemas</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">JSON Schema Validation</div>
          </div>

          <div className="flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-3">
              <Lock className="w-6 h-6" strokeWidth={2} />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">RFC 8693</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Token Exchange Standard</div>
          </div>
        </div>
      </div>
    </Section>
  );
}
