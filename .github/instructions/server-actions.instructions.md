---
description: Read this before implementing or modifying any server actions or data mutation code in this project.
---

# Server Actions — Mutations

## Rules

- **Server actions are the only way to mutate data.** No API routes, no direct DB calls from components.
- Server action files **must** be named `actions.ts` and colocated with the component that calls them.
- Server actions **must** be called from **Client Components** only.
- All server actions must have `"use server"` at the top of the file.
- Server actions **must never throw errors**. Always return a result object with either an `error` or `success` property.

## Return Type

All server actions must return a plain object:

```ts
// Success
return { success: true };

// Failure
return { error: "Unauthorized" };
```

## Auth Check

Every server action must verify a logged-in user **before** any database operation:

```ts
import { auth } from "@clerk/nextjs/server";

export async function deleteLink(data: DeleteLinkInput) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  // DB operation via helper function
  return { success: true };
}
```

## Input Typing & Validation

- **Never** use `FormData` as a parameter type.
- All inputs must have explicit TypeScript types.
- All inputs must be validated with **Zod** before use.

```ts
import { z } from "zod";

const createLinkSchema = z.object({
  url: z.string().url(),
  slug: z.string().min(1).max(50),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

export async function createLink(data: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const parsed = createLinkSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid input" };

  await insertLink({ ...parsed.data, userId });
  return { success: true };
}
```

## Database Access

- Server actions **must not** use Drizzle queries directly.
- All DB operations must go through helper functions in the `/data` directory.

```ts
// ✅ DO — use a helper from /data
import { insertLink } from "@/data/links";
await insertLink({ url, slug, userId });

// ❌ DON'T — call Drizzle directly in a server action
import { db } from "@/db";
await db.insert(links).values({ url, slug, userId });
```

## File Structure

Colocate `actions.ts` with the client component that calls it:

```
app/
  dashboard/
    actions.ts        ← server actions for dashboard
    page.tsx          ← or a client component in this directory
components/
  create-link-form/
    actions.ts        ← server actions for this form
    create-link-form.tsx
```

## DOs and DON'Ts

| DO | DON'T |
|---|---|
| Return `{ error: "..." }` or `{ success: true }` from every action | Throw errors inside server actions |
| Use `auth()` from `@clerk/nextjs/server` at the top of every action | Skip the auth check |
| Define explicit TS types for all parameters | Use `FormData` as a type |
| Validate all inputs with Zod | Trust raw client input |
| Call helper functions from `/data` for DB access | Use Drizzle directly inside actions |
| Name the file `actions.ts` | Name it anything else (`mutations.ts`, `serverActions.ts`, etc.) |
| Colocate `actions.ts` with the calling component | Put all actions in a single global file |
