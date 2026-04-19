import type { TreeNode, FlatItem, CollapseState } from './types.js';
/**
 * Depth-first traversal of a forest into a flat list with depth metadata.
 * Collapsed nodes have their subtrees omitted from the output.
 */
export declare function flattenTree(nodes: TreeNode[], collapsed: CollapseState, depth?: number): FlatItem[];
/**
 * Collapse a node and all of its descendants.
 */
export declare function collapseSubtree(nodeId: string, allNodes: Map<string, TreeNode>, collapsed: CollapseState): CollapseState;
/**
 * Build a flat lookup map from a forest (used by collapseSubtree).
 */
export declare function buildNodeMap(nodes: TreeNode[]): Map<string, TreeNode>;
/**
 * Count how many visible descendants a node has (recursive total, not just direct children).
 */
export declare function countVisibleDescendants(nodeId: string, allNodes: Map<string, TreeNode>, collapsed: CollapseState): number;
//# sourceMappingURL=flatten.d.ts.map