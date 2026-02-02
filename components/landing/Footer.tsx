import { landingContent } from '@/lib/content/landing-en';

export function Footer() {
  const { footer } = landingContent;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-zinc-950 text-zinc-400 py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-zinc-950" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        {/* Logo/Brand section */}
        <div className="mb-16 text-center">
          <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent mb-4">
            Agent Authorization Profile
          </h3>
          <p className="text-zinc-500 max-w-2xl mx-auto">
            OAuth 2.0 authorization for autonomous AI agents. Built on open standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">
              {footer.about.title}
            </h3>
            <ul className="space-y-3">
              {footer.about.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-zinc-100 transition-colors hover:underline"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Docs */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">
              {footer.docs.title}
            </h3>
            <ul className="space-y-3">
              {footer.docs.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-zinc-100 transition-colors hover:underline"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">
              {footer.technical.title}
            </h3>
            <ul className="space-y-3">
              {footer.technical.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-zinc-100 transition-colors hover:underline"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">
              {footer.community.title}
            </h3>
            <ul className="space-y-3">
              {footer.community.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-zinc-100 transition-colors hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Standards */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">
              {footer.standards.title}
            </h3>
            <ul className="space-y-3">
              {footer.standards.links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-zinc-100 transition-colors hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-12 border-t border-zinc-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-500">
              © {currentYear} Agent Authorization Profile. Built on OAuth 2.0, JWT, and open standards.
            </p>
            <div className="flex gap-6">
              <a href="https://github.com/aapspec" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://datatracker.ietf.org" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">
                IETF
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
