import { landingContent } from '@/lib/content/landing-en';
import { CodeBlock } from '@/components/shared/CodeBlock';
import { Section } from '@/components/shared/Section';

export function CodeExample() {
  const { codeExample } = landingContent;

  return (
    <Section id="code-example" background="dark" padding="lg" className="relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

      <div className="relative">
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-semibold text-zinc-300 mb-6">
            Complete JWT Example
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            {codeExample.title}
          </h2>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto">
            {codeExample.subtitle}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative">
              <CodeBlock
                code={codeExample.token}
                language="json"
                showLineNumbers
                filename="aap-token.json"
              />
            </div>
          </div>

          <div className="mt-12 p-8 md:p-10 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl hover:bg-white/10 transition-colors">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-white flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500" />
              AAP Claims Reference
            </h3>
            <dl className="grid md:grid-cols-2 gap-x-8 gap-y-6">
              {Object.entries(codeExample.annotations).map(([key, value]) => (
                <div key={key} className="group/item hover:bg-white/5 p-4 rounded-xl transition-colors">
                  <dt className="font-mono text-base text-blue-400 font-bold mb-2 group-hover/item:text-blue-300">
                    {key}
                  </dt>
                  <dd className="text-zinc-300 text-sm leading-relaxed">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Section>
  );
}
