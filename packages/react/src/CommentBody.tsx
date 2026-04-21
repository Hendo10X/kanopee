import React from 'react';

export interface CommentBodyProps {
  /** The comment text. Swap in your own markdown renderer as children. */
  children: React.ReactNode;
  className?: string;
}

export function CommentBody({ children, className }: CommentBodyProps) {
  return (
    <p className={['canopy-body', className].filter(Boolean).join(' ')}>
      {children}
    </p>
  );
}
