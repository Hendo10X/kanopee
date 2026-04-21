import React, { useState, useRef, useCallback } from 'react';

export interface CommentReplyFormProps {
  /** Author name used in the placeholder text. */
  replyingTo: string;
  /** Called on submit. Awaited if it returns a Promise — button shows loading state. */
  onSubmit: (body: string) => void | Promise<void>;
  onCancel: () => void;
  className?: string;
}

export function CommentReplyForm({
  replyingTo,
  onSubmit,
  onCancel,
  className,
}: CommentReplyFormProps) {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  const submit = useCallback(async () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await onSubmit(trimmed);
      setBody('');
    } finally {
      setSubmitting(false);
    }
  }, [body, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        submit();
      }
      if (e.key === 'Escape') onCancel();
    },
    [submit, onCancel],
  );

  return (
    <form
      className={['canopy-reply-form', className].filter(Boolean).join(' ')}
      onSubmit={(e) => { e.preventDefault(); submit(); }}
      aria-label={`Reply to ${replyingTo}`}
    >
      <textarea
        ref={ref}
        className="canopy-reply-input"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Reply to ${replyingTo}… (⌘↵ to submit)`}
        rows={3}
        disabled={submitting}
        autoFocus
      />
      <div className="canopy-reply-actions">
        <button
          type="button"
          className="canopy-reply-cancel"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="canopy-reply-submit"
          disabled={!body.trim() || submitting}
        >
          {submitting ? 'Posting…' : 'Reply'}
        </button>
      </div>
    </form>
  );
}
