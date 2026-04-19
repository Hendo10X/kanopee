import type { TreeNode, FlatItem, CollapseState } from './types.js';

/**
 * Depth-first traversal of a forest into a flat list with depth metadata.
 * Collapsed nodes have their subtrees omitted from the output.
 */
export function flattenTree(
  nodes: TreeNode[],
  collapsed: CollapseState,
  depth = 0,
): FlatItem[] {
  const result: FlatItem[] = [];

  for (const node of nodes) {
    const isCollapsed = collapsed.has(node.id);
    const hasChildren = node.children.length > 0;

    result.push({
      comment: node,
      depth,
      hasChildren,
      isCollapsed,
      childCount: node.children.length,
    });

    if (!isCollapsed && hasChildren) {
      const childItems = flattenTree(node.children, collapsed, depth + 1);
      for (const item of childItems) {
        result.push(item);
      }
    }
  }

  return result;
}

/**
 * Collapse a node and all of its descendants.
 */
export function collapseSubtree(
  nodeId: string,
  allNodes: Map<string, TreeNode>,
  collapsed: CollapseState,
): CollapseState {
  const next = new Set(collapsed);

  function visit(id: string) {
    next.add(id);
    const node = allNodes.get(id);
    if (node) {
      for (const child of node.children) {
        visit(child.id);
      }
    }
  }

  visit(nodeId);
  return next;
}

/**
 * Build a flat lookup map from a forest (used by collapseSubtree).
 */
export function buildNodeMap(nodes: TreeNode[]): Map<string, TreeNode> {
  const map = new Map<string, TreeNode>();

  function visit(node: TreeNode) {
    map.set(node.id, node);
    for (const child of node.children) {
      visit(child);
    }
  }

  for (const root of nodes) {
    visit(root);
  }

  return map;
}

/**
 * Count how many visible descendants a node has (recursive total, not just direct children).
 */
export function countVisibleDescendants(
  nodeId: string,
  allNodes: Map<string, TreeNode>,
  collapsed: CollapseState,
): number {
  const node = allNodes.get(nodeId);
  if (!node || collapsed.has(nodeId)) return 0;

  let count = 0;
  for (const child of node.children) {
    count += 1 + countVisibleDescendants(child.id, allNodes, collapsed);
  }
  return count;
}
