import React, { CSSProperties } from 'react';
import { getInitials } from './utils.js';

export interface CommentAvatarProps {
  /** Author display name — used for initials fallback. */
  author: string;
  /** Optional avatar image URL. */
  avatarUrl?: string;
  className?: string;
  style?: CSSProperties;
}

export function CommentAvatar({ author, avatarUrl, className, style }: CommentAvatarProps) {
  return (
    <div
      className={['canopy-avatar', className].filter(Boolean).join(' ')}
      aria-hidden="true"
      style={style}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={author} loading="lazy" />
      ) : (
        getInitials(author)
      )}
    </div>
  );
}
