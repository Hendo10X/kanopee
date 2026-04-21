# @kanopee/vue

Vue 3 adapter for Kanopee — nested comment threads with virtualisation, collapse, likes, and inline replies.

## Install

```bash
npm install @kanopee/vue
```

Vue 3+ is a peer dependency.

## Usage

```vue
<script setup>
import { CommentThread } from '@kanopee/vue';
import '@kanopee/vue/styles.css';
</script>

<template>
  <CommentThread
    :comments="comments"
    :on-reply="(parentId, body) => postReply(parentId, body)"
    :on-like="(id, liked) => toggleLike(id, liked)"
  />
</template>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `comments` | `RawComment[]` | required | Flat array of comments |
| `onReply` | `(parentId, body) => void \| Promise` | — | Called on reply submit. Awaited if async. |
| `onLike` | `(id, isLiked) => void` | — | Called on like toggle |
| `onCollapse` | `(id, collapsed) => void` | — | Called on collapse/expand |
| `height` | `number` | — | Fixed height (px). Enables scroll virtualisation. |
| `indentWidth` | `number` | `24` | Pixels per indent level |
| `estimatedRowHeight` | `number` | `80` | Virtualiser row size hint |
| `defaultCollapsed` | `string[]` | `[]` | IDs whose subtrees start collapsed |
| `collapsed` | `string[]` | — | Controlled collapse state |
| `emptyStateText` | `string` | `'No comments yet.'` | Shown when comments is empty |
| `className` | `string` | — | Added to the root element |
| `onScrollEnd` | `() => void` | — | Fires near the bottom (pagination) |

## Styling

All visual tokens are CSS custom properties — identical to `@kanopee/react` so themes are portable across frameworks:

```css
:root {
  --canopy-indent-width: 24px;
  --canopy-avatar-size: 32px;
  --canopy-liked-color: #e5484d;
  --canopy-submit-bg: #111;
}
```

## License

MIT
