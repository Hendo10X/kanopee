import React from 'react';
import { formatTimestamp } from './utils.js';

export interface CommentHeaderProps {
  author: string;
  timestamp: string | number | Date;
  className?: string;
}

export function CommentHeader({ author, timestamp, className }: CommentHeaderProps) {
  const iso = timestamp instanceof Date ? timestamp.toISOString() : String(timestamp);
  return (
    <div className={['canopy-header', className].filter(Boolean).join(' ')}>
      <span className="canopy-author">{author}</span>
      <time
        className="canopy-timestamp"
        dateTime={iso}
        title={new Date(iso).toLocaleString()}
      >
        {formatTimestamp(timestamp)}
      </time>
    </div>
  );
}
