# Auth — Clerk Integration

## Rules

- **Clerk is the only auth provider.** Do not implement custom session handling, NextAuth, or any other auth method.
- All auth state (current user, session, sign-in status) must be read from Clerk's helpers only.

## Protected Routes

- `/dashboard` is a protected route — users must be signed in to access it.
- Enforce via Clerk's `clerkMiddleware` in `proxy.ts` using `createRouteMatcher`.
- Unauthenticated users visiting `/dashboard` are redirected to `/` (not Clerk's sign-in page).

## Redirects

- If a signed-in user visits `/`, redirect them to `/dashboard`.
- Handle this in `proxy.ts`.

## Sign-in & Sign-up UI

- Sign-in and sign-up must always open as a **modal** — never as a full-page redirect.
- Use `<SignInButton mode="modal">` and `<SignUpButton mode="modal">`.
- Do **not** create dedicated `/sign-in` or `/sign-up` pages.

## Accessing Auth Data

- **Server Components / Route Handlers**: use `auth()` or `currentUser()` from `@clerk/nextjs/server`.
- **Client Components**: use `useUser()` or `useAuth()` from `@clerk/nextjs`.

## Environment Variables

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` must be set in `.env.local`.
- Never expose `CLERK_SECRET_KEY` to the client.

---

## Adding `clerkMiddleware()` to Your App

`clerkMiddleware()` grants you access to user authentication state throughout the app and allows you to protect specific routes from unauthenticated users.

> **Important:** This project uses **Next.js 16+**, so the middleware file must be named **`proxy.ts`** (not `middleware.ts`). For Next.js ≤15 projects, use `middleware.ts` instead. The code itself is identical — only the filename differs.

The file already exists at `proxy.ts`. Apply the route-protection logic there.

---

## Examples

### `proxy.ts` — Protect `/dashboard` and redirect signed-in users from `/`

```ts
// proxy.ts (Next.js 16+) — use middleware.ts for Next.js ≤15
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Redirect signed-in users away from the homepage
  if (req.nextUrl.pathname === "/") {
    const { userId } = await auth();
    if (userId) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Protect /dashboard — redirect to home if not authenticated
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
```

### Sign-in & Sign-up modal buttons

```tsx
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  return (
    <div className="flex gap-2">
      <SignInButton mode="modal">
        <Button variant="outline">Sign in</Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button>Sign up</Button>
      </SignUpButton>
    </div>
  );
}
```

### Reading auth data in a Server Component

```tsx
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  return <p>Welcome, {user?.firstName}</p>;
}
```

### Reading auth data in a Client Component

```tsx
"use client";
import { useUser } from "@clerk/nextjs";

export function UserGreeting() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return null;
  return <p>Hello, {user?.firstName}</p>;
}
```
