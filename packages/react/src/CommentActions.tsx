import React, { useCallback } from 'react';

export interface CommentActionsProps {
  commentId: string;
  isLiked?: boolean;
  likeCount?: number;
  /** True if this comment has at least one direct reply. */
  hasChildren?: boolean;
  isCollapsed?: boolean;
  childCount?: number;
  onLike?: (id: string, isLiked: boolean) => void;
  /** Called when the Reply button is clicked. Open your own reply form in response. */
  onReplyClick?: () => void;
  onCollapse?: (id: string, collapsed: boolean) => void;
  className?: string;
}

export function CommentActions({
  commentId,
  isLiked = false,
  likeCount = 0,
  hasChildren = false,
  isCollapsed = false,
  childCount = 0,
  onLike,
  onReplyClick,
  onCollapse,
  className,
}: CommentActionsProps) {
  const handleLike = useCallback(() => {
    onLike?.(commentId, !isLiked);
  }, [onLike, commentId, isLiked]);

  const handleCollapse = useCallback(() => {
    onCollapse?.(commentId, !isCollapsed);
  }, [onCollapse, commentId, isCollapsed]);

  return (
    <div
      className={['canopy-actions', className].filter(Boolean).join(' ')}
      role="group"
      aria-label="Comment actions"
    >
      {onLike && (
        <button
          className="canopy-action canopy-action--like"
          onClick={handleLike}
          aria-pressed={isLiked}
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24"
            fill={isLiked ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {likeCount > 0 && <span>{likeCount}</span>}
        </button>
      )}

      {onReplyClick && (
        <button
          className="canopy-action canopy-action--reply"
          onClick={onReplyClick}
          aria-label="Reply"
        >
          <svg width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 17 4 12 9 7" />
            <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
          </svg>
          Reply
        </button>
      )}

      {hasChildren && onCollapse && (
        <button
          className="canopy-action canopy-action--collapse"
          onClick={handleCollapse}
          aria-expanded={!isCollapsed}
          aria-label={
            isCollapsed
              ? `Show ${childCount} ${childCount === 1 ? 'reply' : 'replies'}`
              : 'Collapse replies'
          }
        >
          {isCollapsed ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          )}
          {isCollapsed ? (
            <span className="canopy-collapsed-hint">
              {childCount} {childCount === 1 ? 'reply' : 'replies'}
            </span>
          ) : (
            <span>Collapse</span>
          )}
        </button>
      )}
    </div>
  );
}
