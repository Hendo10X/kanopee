// ── Full composed components ──────────────────────────────────────
export { CommentThread } from './CommentThread.js';
export type { CommentThreadProps } from './CommentThread.js';

export { CommentRow } from './CommentRow.js';
export type { CommentRowCallbacks } from './CommentRow.js';

// ── Primitives — compose your own row ────────────────────────────
export { CommentAvatar } from './CommentAvatar.js';
export type { CommentAvatarProps } from './CommentAvatar.js';

export { CommentHeader } from './CommentHeader.js';
export type { CommentHeaderProps } from './CommentHeader.js';

export { CommentBody } from './CommentBody.js';
export type { CommentBodyProps } from './CommentBody.js';

export { CommentActions } from './CommentActions.js';
export type { CommentActionsProps } from './CommentActions.js';

export { CommentReplyForm } from './CommentReplyForm.js';
export type { CommentReplyFormProps } from './CommentReplyForm.js';

// ── Core types re-exported for convenience ────────────────────────
export type { RawComment, FlatItem, CollapseState } from '@kanopee/core';
