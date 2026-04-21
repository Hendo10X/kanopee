# @kanopee/core

Framework-agnostic tree builder and flattener for nested comment threads. Zero runtime dependencies.

## Install

```bash
npm install @kanopee/core
```

## Usage

```ts
import { buildTree, flattenTree, buildNodeMap, collapseSubtree } from '@kanopee/core';

// 1. Build the tree from a flat array
const forest = buildTree(comments);

// 2. Flatten with depth metadata (respects collapse state)
const items = flattenTree(forest, collapsedSet);
// items[n] = { comment, depth, hasChildren, isCollapsed, childCount }

// 3. Collapse a subtree
const nodeMap = buildNodeMap(forest);
const nextCollapsed = collapseSubtree(commentId, nodeMap, collapsedSet);
```

## API

### `buildTree(comments: RawComment[]): TreeNode[]`

Converts a flat array into a forest in O(n). Comments with unknown `parentId` are promoted to roots.

### `flattenTree(forest: TreeNode[], collapsed: Set<string>): FlatItem[]`

Depth-first walk of the tree. Returns a flat array with `depth`, `hasChildren`, `isCollapsed`, and `childCount` on each item. Skips children of collapsed nodes.

### `buildNodeMap(forest: TreeNode[]): Map<string, TreeNode>`

Indexes all nodes by ID for O(1) lookup.

### `collapseSubtree(id: string, nodeMap, collapsed: Set<string>): Set<string>`

Returns a new Set with the target node and all its descendants added. Does not mutate the original.

### `countVisibleDescendants(id: string, nodeMap, collapsed: Set<string>): number`

Counts how many descendants are currently visible (not hidden by a collapsed ancestor).

## Types

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
  [key: string]: unknown;
}

interface FlatItem {
  comment: RawComment;
  depth: number;
  hasChildren: boolean;
  isCollapsed: boolean;
  childCount: number;
}

type CollapseState = Set<string>;
```

## License

MIT
