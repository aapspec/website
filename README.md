# Agent Authorization Profile (AAP) - Official Website

[![Live Site](https://img.shields.io/badge/Live-aap--protocol.org-blue)](https://aap-protocol.org)
[![IETF Draft](https://img.shields.io/badge/IETF-draft--aap--oauth--profile-orange)](https://datatracker.ietf.org/doc/draft-aap-oauth-profile/)
[![License](https://img.shields.io/badge/License-Apache%202.0-green.svg)](LICENSE)

Official documentation website for the **Agent Authorization Profile (AAP)** - an OAuth 2.0 authorization profile for autonomous AI agents.

**🌐 Live Site:** https://aap-protocol.org

---

## 🎯 What is AAP?

AAP extends OAuth 2.0 with structured claims designed specifically for AI agent authorization:

- **Agent Identity**: Explicit, verifiable identity for autonomous agents
- **Capabilities**: Specific actions with enforceable constraints (domains, rate limits, time windows)
- **Task Binding**: Tokens linked to declared purposes
- **Delegation**: Auditable delegation chains between agents and tools
- **Oversight**: Claims indicating actions requiring human approval

---

## 📚 Website Content

The website includes 11 comprehensive documentation pages:

- **Homepage** - Overview and quick links
- **Documentation Hub** (`/docs`) - Central navigation
- **Getting Started** (`/getting-started`) - 6-step quick start guide
- **Complete Specification** (`/specification`) - Full technical spec
- **JSON Schemas** (`/schemas`) - 9 formal validation schemas
- **Test Vectors** (`/test-vectors`) - 80+ test cases
- **Reference Implementation** (`/reference-impl`) - AS + RS in Python
- **Migration Guide** (`/migration`) - OAuth Scopes → AAP
- **Deployment Patterns** (`/deployment`) - K8s, Docker, Cloud
- **FAQ** (`/faq`) - 30 frequently asked questions
- **Threat Model** (`/threat-model`) - 15 attack scenarios

---

## 🚀 Local Development

### Prerequisites

- Node.js 18+ or 20+
- pnpm 8+ (recommended) or npm

### Setup

```bash
# Clone repository
git clone https://github.com/aapspec/website.git
cd website

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Available Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

---

## 🏗️ Tech Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **UI:** React 19 + Tailwind CSS v4
- **Markdown:** react-markdown + remark-gfm
- **Syntax Highlighting:** rehype-highlight + highlight.js
- **Icons:** lucide-react
- **Fonts:** Geist Sans + Geist Mono

---

## 📁 Project Structure

```
website/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── docs/              # Documentation hub
│   ├── getting-started/   # Quick start guide
│   ├── specification/     # Full spec viewer
│   ├── schemas/           # JSON Schemas explorer
│   ├── test-vectors/      # Test cases explorer
│   ├── reference-impl/    # Implementation docs
│   ├── migration/         # Migration guide
│   ├── deployment/        # Deployment patterns
│   ├── faq/              # FAQ
│   └── threat-model/      # Security analysis
│
├── components/
│   ├── landing/           # Homepage components
│   ├── docs/              # Documentation components
│   │   ├── MarkdownViewer.tsx
│   │   └── TableOfContents.tsx
│   └── shared/            # Shared UI components
│
├── lib/
│   └── content/           # Content configuration
│
├── public/                # Static assets
│   ├── schemas/           # JSON Schema files
│   ├── docs/              # Markdown documentation
│   ├── test-vectors/      # Test vector files
│   └── reference-impl/    # Reference code
│
└── [config files]
```

## 🔗 Related Repositories

- **Specification:** [github.com/aapspec/spec](https://github.com/aapspec/spec)
- **JSON Schemas:** [github.com/aapspec/schemas](https://github.com/aapspec/schemas)
- **Reference Implementation:** [github.com/aapspec/reference-impl](https://github.com/aapspec/reference-impl)
- **Test Vectors:** [github.com/aapspec/test-vectors](https://github.com/aapspec/test-vectors)

---

## 📝 Contributing

We welcome contributions to improve the website!

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test locally (`pnpm dev`)
5. Build to verify (`pnpm build`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Areas for Contribution

- Fix typos or unclear documentation
- Improve UI/UX
- Add examples or tutorials
- Enhance accessibility
- Optimize performance
- Add translations

---

## 🐛 Bug Reports

Found a bug? Please open an issue:

https://github.com/aapspec/website/issues/new

Include:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/OS information

---

## 📞 Community

- **IETF Mailing List:** oauth@ietf.org
- **GitHub Discussions:** [github.com/aapspec/spec/discussions](https://github.com/aapspec/spec/discussions)
- **Website:** https://aap-protocol.org

---

## 📄 License

Apache License 2.0 - See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org) by Vercel
- [Tailwind CSS](https://tailwindcss.com)
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [Lucide Icons](https://lucide.dev)
- [highlight.js](https://highlightjs.org)

---

**Website Version:** 1.0
**Last Updated:** 2026-02-01
**Maintained by:** AAP Working Group
