# Kanopee

Nested comment threads for React, Svelte, and Vue — in three lines of code.

Pass a flat array of comments with parent IDs. Kanopee builds the tree, virtualises the list, and hands you callbacks for replies, likes, and collapse. Drop it into any JS framework without touching your design system.

## Packages

| Package | Description |
|---|---|
| [`@kanopee/core`](./packages/core) | Framework-agnostic tree builder and flattener. Zero runtime deps. |
| [`@kanopee/react`](./packages/react) | React 18 adapter with `@tanstack/react-virtual` |
| [`@kanopee/svelte`](./packages/svelte) | Svelte 4 adapter |
| [`@kanopee/vue`](./packages/vue) | Vue 3 adapter |

## Install

```bash
# React
npm install @kanopee/react

# Svelte
npm install @kanopee/svelte

# Vue
npm install @kanopee/vue

# Core only (bring your own renderer)
npm install @kanopee/core
```

## Usage

```tsx
import { CommentThread } from '@kanopee/react';
import '@kanopee/react/styles.css';

function App() {
  return (
    <CommentThread
      comments={comments}
      onReply={(parentId, body) => postReply(parentId, body)}
      onLike={(id, liked) => toggleLike(id, liked)}
    />
  );
}
```

`comments` is a flat array — Kanopee handles the tree building, virtualisation, and collapse state internally.

## Styling

Every visual decision is a CSS custom property. Override at `:root` or any wrapper:

```css
:root {
  --canopy-indent-width: 24px;
  --canopy-avatar-size: 32px;
  --canopy-liked-color: #e5484d;
  --canopy-submit-bg: #111;
}
```

No Tailwind, no CSS-in-JS, no conflicts.

## RawComment shape

```ts
interface RawComment {
  id: string;
  parentId?: string | null;
  author: string;
  body: string;
  timestamp: string | number | Date;
  avatarUrl?: string;
  likeCount?: number;
  isLiked?: boolean;
  [key: string]: unknown; // any extra fields are passed through
}
```

## Development

```bash
pnpm install
pnpm build        # build all packages
pnpm test         # run unit tests
pnpm dev          # start demo at localhost:3001
```

## License

MIT
