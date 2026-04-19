import React, { useState, useRef, useCallback } from 'react';
import type { FlatItem } from '@kanopee/core';
import { formatTimestamp, getInitials } from './utils.js';

export interface CommentRowCallbacks {
  onReply?: (parentId: string, body: string) => void;
  onLike?: (commentId: string, isLiked: boolean) => void;
  onCollapse?: (commentId: string, collapsed: boolean) => void;
}

interface CommentRowProps extends CommentRowCallbacks {
  item: FlatItem;
  indentWidth: number;
}

export const CommentRow = React.memo(function CommentRow({
  item,
  indentWidth,
  onReply,
  onLike,
  onCollapse,
}: CommentRowProps) {
  const { comment, depth, hasChildren, isCollapsed, childCount } = item;
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const paddingLeft = depth * indentWidth;

  const handleLike = useCallback(() => {
    onLike?.(comment.id, !comment.isLiked);
  }, [onLike, comment.id, comment.isLiked]);

  const handleCollapseToggle = useCallback(() => {
    onCollapse?.(comment.id, !isCollapsed);
  }, [onCollapse, comment.id, isCollapsed]);

  const openReply = useCallback(() => {
    setReplyOpen(true);
    // Focus textarea on next frame after render
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, []);

  const cancelReply = useCallback(() => {
    setReplyOpen(false);
    setReplyBody('');
  }, []);

  const submitReply = useCallback(async () => {
    const trimmed = replyBody.trim();
    if (!trimmed || !onReply) return;
    setIsSubmitting(true);
    try {
      await onReply(comment.id, trimmed);
      setReplyBody('');
      setReplyOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [replyBody, onReply, comment.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        submitReply();
      }
      if (e.key === 'Escape') {
        cancelReply();
      }
    },
    [submitReply, cancelReply],
  );

  return (
    <div
      className="canopy-row"
      style={{ paddingLeft }}
      data-depth={depth}
      data-comment-id={comment.id}
    >
      <div
        className="canopy-comment"
        data-has-children={hasChildren || undefined}
        data-collapsed={isCollapsed || undefined}
      >
        {/* Avatar */}
        <div className="canopy-avatar" aria-hidden="true">
          {comment.avatarUrl ? (
            <img src={comment.avatarUrl} alt={comment.author} loading="lazy" />
          ) : (
            getInitials(comment.author)
          )}
        </div>

        {/* Content */}
        <div className="canopy-content">
          <div className="canopy-header">
            <span className="canopy-author">{comment.author}</span>
            <time
              className="canopy-timestamp"
              dateTime={
                comment.timestamp instanceof Date
                  ? comment.timestamp.toISOString()
                  : String(comment.timestamp)
              }
              title={new Date(comment.timestamp as string).toLocaleString()}
            >
              {formatTimestamp(comment.timestamp)}
            </time>
          </div>

          <p className="canopy-body">{comment.body}</p>

          {/* Actions */}
          <div className="canopy-actions" role="group" aria-label="Comment actions">
            {onLike && (
              <button
                className="canopy-action canopy-action--like"
                onClick={handleLike}
                aria-pressed={comment.isLiked ?? false}
                aria-label={comment.isLiked ? 'Unlike' : 'Like'}
              >
                <LikeIcon filled={comment.isLiked ?? false} />
                {(comment.likeCount ?? 0) > 0 && (
                  <span>{comment.likeCount}</span>
                )}
              </button>
            )}

            {onReply && (
              <button
                className="canopy-action canopy-action--reply"
                onClick={openReply}
                aria-label="Reply"
              >
                <ReplyIcon />
                Reply
              </button>
            )}

            {hasChildren && onCollapse && (
              <button
                className="canopy-action canopy-action--collapse"
                onClick={handleCollapseToggle}
                aria-expanded={!isCollapsed}
                aria-label={
                  isCollapsed
                    ? `Show ${childCount} ${childCount === 1 ? 'reply' : 'replies'}`
                    : 'Collapse replies'
                }
              >
                {isCollapsed ? (
                  <ChevronDownIcon />
                ) : (
                  <ChevronUpIcon />
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

          {/* Inline reply form */}
          {replyOpen && (
            <form
              className="canopy-reply-form"
              onSubmit={(e) => { e.preventDefault(); submitReply(); }}
              aria-label={`Reply to ${comment.author}`}
            >
              <textarea
                ref={textareaRef}
                className="canopy-reply-input"
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Reply to ${comment.author}… (⌘↵ to submit)`}
                rows={3}
                disabled={isSubmitting}
              />
              <div className="canopy-reply-actions">
                <button
                  type="button"
                  className="canopy-reply-cancel"
                  onClick={cancelReply}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="canopy-reply-submit"
                  disabled={!replyBody.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Posting…' : 'Reply'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
});

/* ── Inline SVG icons (no external dep) ──────────────────────── */

function LikeIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ReplyIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 17 4 12 9 7" />
      <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
