# Agent Instructions — Link Shortener Project

This file is the entry point for LLM agents and AI coding assistants working in this repository.

---

## Documents

| File | What it covers |
|---|---|
| [Authentication Guidelines](#authentication) | Clerk authentication — protected routes, redirects, modal sign-in/sign-up, and auth helpers |
| [UI Components Guidelines](#ui-components) | shadcn/ui usage — component imports, adding new components, customization rules |
---

## Quick Rules (apply everywhere)

- **TypeScript everywhere** — no `.js` files in `app/`, `components/`, or `lib/`. The only `.js` file
  allowed is `db/index.js` until it is migrated.
- **Never commit secrets** — env vars live in `.env.local` only; access them server-side.
- **Server Components by default** — add `"use client"` only when a component needs browser APIs
  or React state/effects.
- **shadcn/ui for all UI primitives** — do not install raw Radix UI packages separately; import
  through the `@/components/ui` alias.
- **Drizzle for all DB access** — no raw SQL strings except inside `drizzle`'s `sql` tagged template.
- **Clerk for all auth** — do not implement custom session handling.
