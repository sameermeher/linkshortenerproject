---
description: Read this before implementing or modifying any UI/component-related code in this project.
---

# UI Components Guidelines

All UI elements in this project use **shadcn/ui**. Never create custom component primitives — always use or extend shadcn/ui components.

---

## Key Rules

- **Only shadcn/ui** — do not build custom buttons, inputs, dialogs, cards, or any other UI primitive from scratch.
- **Import from `@/components/ui`** — all shadcn components live under this alias (e.g. `import { Button } from "@/components/ui/button"`).
- **Do not install raw Radix UI packages** — shadcn/ui wraps Radix; import through `@/components/ui` only.
- **Icon library is `lucide-react`** — use Lucide icons exclusively; do not install other icon libraries.
- **Tailwind CSS + CSS variables** — styling uses Tailwind with CSS variables defined in `app/globals.css`. No inline styles or external CSS modules.
- **Style is `radix-nova`, base color `neutral`** — do not override the global theme on individual components unless explicitly required.

## Adding a New shadcn Component

Run the shadcn CLI to add components — do **not** hand-write them:

```bash
npx shadcn@latest add <component-name>
```

This places the component in `components/ui/` and ensures it matches the project's style config.

## Component Customization

- Extend components via `className` props and Tailwind utility classes.
- For recurring variants, add a new `variant` or `size` inside the existing component file in `components/ui/` using `cva`.
- Do not wrap a shadcn component in an identically-named custom component just to restyle it — modify the source file in `components/ui/` directly.

---

## Examples

### Importing and Using Components

✅ **DO** — import from `@/components/ui`:
```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ShortenForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shorten a URL</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Input placeholder="https://example.com" />
        <Button>Shorten</Button>
      </CardContent>
    </Card>
  );
}
```

❌ **DON'T** — build primitives from scratch or import directly from Radix:
```tsx
// ❌ hand-rolled button
export function Button({ children }) {
  return <button className="bg-blue-500 px-4 py-2 rounded">{children}</button>;
}

// ❌ raw Radix import
import * as Dialog from "@radix-ui/react-dialog";
```

---

### Using Lucide Icons

✅ **DO** — use `lucide-react` icons alongside shadcn components:
```tsx
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

<Button variant="outline" size="icon">
  <Copy className="h-4 w-4" />
</Button>
```

❌ **DON'T** — install or import from other icon libraries:
```tsx
import { FaCopy } from "react-icons/fa"; // ❌ wrong library
```

---

### Extending with Tailwind Classes

✅ **DO** — pass `className` to extend styles:
```tsx
<Button className="w-full mt-4">Copy Link</Button>
```

❌ **DON'T** — use inline styles or override CSS variables on individual elements:
```tsx
<Button style={{ backgroundColor: "#6366f1" }}>Copy Link</Button> // ❌
```

---

### Adding a Custom Variant

✅ **DO** — add variants in `components/ui/button.tsx` using `cva`:
```tsx
// inside components/ui/button.tsx
const buttonVariants = cva("...", {
  variants: {
    variant: {
      // existing variants ...
      danger: "bg-red-500 text-white hover:bg-red-600",
    },
  },
});
```

❌ **DON'T** — create a wrapper component just to change appearance:
```tsx
// ❌ unnecessary wrapper
export function DangerButton(props) {
  return <Button className="bg-red-500" {...props} />;
}
```
