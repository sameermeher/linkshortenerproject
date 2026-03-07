# Agent Instructions — Link Shortener Project

This file is the entry point for LLM agents and AI coding assistants working in this repository.
All coding standards, architectural decisions, and domain-specific conventions are broken out into
separate documents inside the `/docs` directory.

> [!CAUTION]
> **MANDATORY — NO EXCEPTIONS:** You MUST use the `read_file` tool to fully read every relevant
> file in the `/docs` directory **before writing or modifying a single line of code.** Generating
> code without first reading the applicable doc(s) is a critical violation of these instructions.
> Skimming this summary is NOT sufficient — open and read the full document.

---

## Documents

| File | What it covers |
|---|---|
| [Authentication Guidelines](docs/authentication.md) | Clerk authentication — protected routes, redirects, modal sign-in/sign-up, and auth helpers |
| [UI Components Guidelines](docs/ui-components.md) | shadcn/ui usage — component imports, adding new components, customization rules |

**Before touching any auth-related code → read `docs/authentication.md` in full.**
**Before touching any UI/component code → read `docs/ui-components.md` in full.**
**When in doubt, read both.**

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
