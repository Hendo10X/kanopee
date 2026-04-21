import React, { useState, useCallback } from 'react';
import type { FlatItem } from '@canopy-ui/core';
import { CommentAvatar } from './CommentAvatar.js';
import { CommentHeader } from './CommentHeader.js';
import { CommentBody } from './CommentBody.js';
import { CommentActions } from './CommentActions.js';
import { CommentReplyForm } from './CommentReplyForm.js';

export interface CommentRowCallbacks {
  onReply?: (parentId: string, body: string) => void | Promise<void>;
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

  const handleReplySubmit = useCallback(
    async (body: string) => {
      await onReply?.(comment.id, body);
      setReplyOpen(false);
    },
    [onReply, comment.id],
  );

  return (
    <div
      className="canopy-row"
      style={{ paddingLeft: depth * indentWidth }}
      data-depth={depth}
      data-comment-id={comment.id}
    >
      <div
        className="canopy-comment"
        data-has-children={hasChildren || undefined}
        data-collapsed={isCollapsed || undefined}
      >
        <CommentAvatar author={comment.author} avatarUrl={comment.avatarUrl as string | undefined} />

        <div className="canopy-content">
          <CommentHeader author={comment.author} timestamp={comment.timestamp} />
          <CommentBody>{comment.body as string}</CommentBody>

          <CommentActions
            commentId={comment.id}
            isLiked={comment.isLiked as boolean | undefined}
            likeCount={comment.likeCount as number | undefined}
            hasChildren={hasChildren}
            isCollapsed={isCollapsed}
            childCount={childCount}
            onLike={onLike}
            onReplyClick={onReply ? () => setReplyOpen((o) => !o) : undefined}
            onCollapse={onCollapse}
          />

          {replyOpen && (
            <CommentReplyForm
              replyingTo={comment.author}
              onSubmit={handleReplySubmit}
              onCancel={() => setReplyOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
});
