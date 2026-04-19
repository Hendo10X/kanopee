import type { RawComment, TreeNode } from './types.js';
/**
 * Build a forest (array of root trees) from a flat comment array.
 *
 * - O(n) — single pass to index, single pass to wire parents.
 * - Comments whose parentId references a non-existent ID are promoted to roots.
 * - Sibling order is preserved from the input array.
 */
export declare function buildTree(comments: RawComment[]): TreeNode[];
//# sourceMappingURL=tree.d.ts.map