import type { RawComment, TreeNode } from './types.js';

/**
 * Build a forest (array of root trees) from a flat comment array.
 *
 * - O(n) — single pass to index, single pass to wire parents.
 * - Comments whose parentId references a non-existent ID are promoted to roots.
 * - Sibling order is preserved from the input array.
 */
export function buildTree(comments: RawComment[]): TreeNode[] {
  const nodeMap = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  // First pass: index every node.
  for (const c of comments) {
    nodeMap.set(c.id, { ...c, children: [] });
  }

  // Second pass: wire up relationships.
  for (const c of comments) {
    const node = nodeMap.get(c.id)!;
    const parentId = c.parentId;

    if (parentId != null && nodeMap.has(parentId)) {
      nodeMap.get(parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
