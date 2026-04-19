/**
 * The shape a consumer passes in. Only `id` and `parentId` are required;
 * everything else is passed through untouched to the renderer.
 */
export interface RawComment {
  /** Unique identifier for this comment. */
  id: string;
  /** ID of the parent comment, or null/undefined for root-level comments. */
  parentId?: string | null;
  /** Display name of the comment author. */
  author: string;
  /** Optional URL for the author's avatar image. */
  avatarUrl?: string;
  /** The comment body. May contain plain text. */
  body: string;
  /** ISO string, Unix timestamp (ms), or Date. */
  timestamp: string | number | Date;
  /** Total likes/upvotes. */
  likeCount?: number;
  /** Whether the current user has liked this comment. */
  isLiked?: boolean;
  /** Allow consumers to attach arbitrary extra data. */
  [key: string]: unknown;
}

/** Internal tree node built from a flat array. */
export interface TreeNode extends RawComment {
  children: TreeNode[];
}

/** One item in the virtualized flat list. */
export interface FlatItem {
  comment: RawComment;
  /** Zero-based nesting depth. */
  depth: number;
  /** True if this comment has at least one direct reply. */
  hasChildren: boolean;
  /** True if children are currently hidden. */
  isCollapsed: boolean;
  /** Number of direct children (not recursive). */
  childCount: number;
}

export type CollapseState = Set<string>;
