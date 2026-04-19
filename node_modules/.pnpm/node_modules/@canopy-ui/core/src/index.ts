export type {
  RawComment,
  TreeNode,
  FlatItem,
  CollapseState,
} from './types.js';

export { buildTree } from './tree.js';
export {
  flattenTree,
  collapseSubtree,
  buildNodeMap,
  countVisibleDescendants,
} from './flatten.js';
