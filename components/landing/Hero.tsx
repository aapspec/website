'use client';

import { landingContent } from '@/lib/content/landing-en';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';
import { Section } from '@/components/shared/Section';
import { Shield, Lock, CheckCircle } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';

function AnimatedCounter({ value }: { value: string }) {
  const numericMatch = value.match(/^(\d+)/);
  const suffix = value.replace(/^\d+/, '');
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (numericMatch) {
      const target = parseInt(numericMatch[1]);
      const controls = animate(count, target, {
        duration: 1.5,
        ease: [0.25, 0.4, 0.25, 1],
      });
      return controls.stop;
    }
  }, [count, numericMatch]);

  if (!numericMatch) {
    return (
      <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
        {value}
      </div>
    );
  }

  return (
    <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
      <motion.span ref={ref}>{rounded}</motion.span>{suffix}
    </div>
  );
}

const ease = [0.25, 0.4, 0.25, 1] as const;

export function Hero() {
  const { hero } = landingContent;

  return (
    <Section id="hero" padding="xl" className="min-h-screen flex items-center relative overflow-hidden">
      {/* Animated gradient mesh */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-violet-50 dark:from-blue-950/20 dark:via-black dark:to-violet-950/20" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.2),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(59,130,246,0.1),transparent_70%)] animate-gradient-shift" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.2),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(139,92,246,0.1),transparent_70%)] animate-gradient-shift animation-delay-4000" />
        <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.15),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(236,72,153,0.05),transparent_70%)] animate-gradient-shift animation-delay-2000" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative flex flex-col items-center text-center max-w-7xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 blur-xl bg-blue-500/30 dark:bg-blue-500/20 rounded-full" />
          <Badge variant="info" className="relative shadow-lg backdrop-blur-sm">
            {hero.badge}
          </Badge>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-8 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent"
        >
          {hero.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          className="text-xl md:text-2xl lg:text-3xl font-semibold text-zinc-600 dark:text-zinc-400 mb-6 max-w-4xl"
        >
          {hero.subtitle}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease }}
          className="text-base md:text-lg lg:text-xl leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-3xl mb-12"
        >
          {hero.description}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
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
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-4xl"
        >
          {[
            { icon: Shield, value: '5 Claims', label: 'Structured JWT Extensions', color: 'blue' },
            { icon: CheckCircle, value: '9 Schemas', label: 'JSON Schema Validation', color: 'violet' },
            { icon: Lock, value: 'RFC 8693', label: 'Token Exchange Standard', color: 'green' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex flex-col items-center p-6 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${
                stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                stat.color === 'violet' ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400' :
                'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
              }`}>
                <stat.icon className="w-6 h-6" strokeWidth={2} />
              </div>
              <AnimatedCounter value={stat.value} />
              <div className="text-sm text-zinc-600 dark:text-zinc-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
