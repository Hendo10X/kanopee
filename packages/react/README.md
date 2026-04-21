# @kanopee/react

React 18 adapter for Kanopee — nested comment threads with virtualisation, collapse, likes, and inline replies.

## Install

```bash
npm install @kanopee/react
```

React 18+ and react-dom are peer dependencies.

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

Pass a flat array — Kanopee builds the tree, virtualises the list, and manages collapse state internally.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `comments` | `RawComment[]` | required | Flat array of comments |
| `onReply` | `(parentId, body) => void \| Promise` | — | Called on reply submit. Awaited if async. |
| `onLike` | `(id, isLiked) => void` | — | Called on like toggle |
| `onCollapse` | `(id, collapsed) => void` | — | Called on collapse/expand |
| `height` | `number` | — | Fixed height (px) for the scroll container. Enables virtualisation. |
| `indentWidth` | `number` | `24` | Pixels per indent level |
| `estimatedRowHeight` | `number` | `80` | Virtualiser row size hint |
| `defaultCollapsed` | `string[]` | `[]` | IDs whose subtrees start collapsed |
| `collapsed` | `string[]` | — | Controlled collapse state |
| `emptyState` | `ReactNode` | — | Shown when comments is empty |
| `onScrollEnd` | `() => void` | — | Fires near the bottom (pagination) |
| `className` | `string` | — | Added to the root element |
| `style` | `CSSProperties` | — | Use to pass CSS custom properties inline |

## Styling

All visual tokens are CSS custom properties. Override at `:root` or any wrapper:

```css
:root {
  --canopy-indent-width: 24px;
  --canopy-avatar-size: 32px;
  --canopy-liked-color: #e5484d;
  --canopy-submit-bg: #111;
  --canopy-font-family: inherit;
}
```

## License

MIT
