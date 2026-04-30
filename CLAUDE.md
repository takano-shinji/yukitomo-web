# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev       # Start dev server at http://localhost:3000
pnpm build     # Production build
pnpm start     # Run production build
pnpm lint      # Run ESLint
```

No test runner is configured yet.

## Stack

- **Next.js 16.2.3** with App Router — read `node_modules/next/dist/docs/` before writing any code; this version has breaking changes from prior releases
- **React 19.2.4**
- **Tailwind CSS v4** — v4 has breaking changes from v3 (new `@import "tailwindcss"` syntax, no `tailwind.config.js` by default)
- **TypeScript**
- **pnpm** (use `pnpm`, not `npm` or `yarn`)

## Architecture

Uses the App Router with a single root layout (`app/layout.tsx`) that applies Geist fonts and a flex column body. Pages are under `app/`:

- `app/page.tsx` — home page
- `app/privacy/page.tsx` — privacy policy page

CSS is in `app/globals.css` via Tailwind. No API routes, middleware, or server actions exist yet.
