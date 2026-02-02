# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16.1.6 application with React 19 that appears to be documentation or a reference implementation for the **Agent Authorization Profile (AAP)** protocol. AAP is an authorization profile built on OAuth 2.0 and JWT designed for autonomous AI agents that act as clients calling APIs.

The project uses pnpm as the package manager (note: this is a pnpm workspace project).

## Development Commands

```bash
# Install dependencies
pnpm install

# Run development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **React**: 19.2.4 with new React 19 APIs
- **TypeScript**: Version 5
- **Styling**: Tailwind CSS v4 with PostCSS
- **Fonts**: Geist Sans and Geist Mono (via next/font)
- **Linting**: ESLint with Next.js config (flat config format)
- **Package Manager**: pnpm

## Architecture

### App Directory Structure

The project uses Next.js App Router with the following structure:

- `app/page.tsx` - Homepage component
- `app/layout.tsx` - Root layout with font configuration and metadata
- `app/globals.css` - Global styles using Tailwind CSS v4 with custom theme

### TypeScript Configuration

- Target: ES2017
- Module resolution: bundler
- Strict mode enabled
- Path alias: `@/*` points to root directory
- JSX: react-jsx (React 19 automatic runtime)

### Styling System

Uses Tailwind CSS v4 with inline theme configuration in `globals.css`:
- Custom CSS variables for colors: `--background`, `--foreground`
- Font variables: `--font-geist-sans`, `--font-geist-mono`
- Dark mode support via `prefers-color-scheme`
- Theme tokens defined using `@theme inline` directive

### ESLint Configuration

Uses Next.js flat config format (eslint.config.mjs) with:
- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`
- Custom global ignores for `.next/`, `out/`, `build/`, `next-env.d.ts`

## Documentation

The `docs/` directory contains AAP protocol specification:

- `AAP_Complete_Draft_Specification.md` - Full protocol specification
- `AAP_Resumen.md` - Spanish summary of the AAP protocol

### About the AAP Protocol

The Agent Authorization Profile (AAP) extends OAuth 2.0 with structured claims for AI agent authorization:

- **Agent identity**: Explicit, verifiable identity for autonomous agents
- **Capability-based authorization**: Specific actions with restrictions (domains, rates, time windows)
- **Task binding**: Tokens linked to specific tasks and declared purposes
- **Delegation tracking**: Auditable delegation chains between agents and tools
- **Human oversight**: Claims indicating which actions require human approval
- **Standards-based**: Built on OAuth 2.0, JWT, Token Exchange (RFC 8693), DPoP, mTLS, OIDC, and optionally SPIFFE

## Next.js Specific Notes

- Uses App Router (not Pages Router)
- Font optimization via `next/font/google`
- Image optimization via `next/image`
- TypeScript configuration includes Next.js plugin
- No custom Next.js configuration beyond defaults

## pnpm Workspace Configuration

The project uses pnpm workspaces with specific build dependency settings:
- Ignores built dependencies: `unrs-resolver`
- Only builds: `sharp`
