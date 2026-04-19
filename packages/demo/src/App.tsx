import { useState, useCallback, useId } from 'react';
import { CommentThread } from '@kanopee/react';
import type { RawComment } from '@kanopee/react';
import { SEED_COMMENTS } from './seed.js';

// ── Theme tokens ──────────────────────────────────────────────────
const themes = {
  dark: {
    '--canopy-line-color': 'rgba(255,255,255,0.1)',
    '--canopy-input-bg': 'rgba(255,255,255,0.05)',
    '--canopy-input-border': 'rgba(255,255,255,0.12)',
    '--canopy-input-border-focus': 'rgba(255,255,255,0.35)',
    '--canopy-submit-bg': '#e8e8ea',
    '--canopy-submit-color': '#0f0f11',
    '--canopy-liked-color': '#ff6b6b',
    '--canopy-meta-color': 'rgba(232,232,234,0.45)',
    '--canopy-action-color': 'rgba(232,232,234,0.4)',
    '--canopy-action-hover-color': '#e8e8ea',
    color: '#e8e8ea',
  },
  light: {
    '--canopy-line-color': 'rgba(0,0,0,0.1)',
    '--canopy-input-bg': 'rgba(0,0,0,0.04)',
    '--canopy-input-border': 'rgba(0,0,0,0.12)',
    '--canopy-input-border-focus': 'rgba(0,0,0,0.35)',
    '--canopy-submit-bg': '#111',
    '--canopy-submit-color': '#fff',
    '--canopy-liked-color': '#e5484d',
    '--canopy-meta-color': 'rgba(17,17,17,0.45)',
    '--canopy-action-color': 'rgba(17,17,17,0.4)',
    '--canopy-action-hover-color': '#111',
    color: '#111',
  },
} as const;

let nextId = 100;

export function App() {
  const [comments, setComments] = useState<RawComment[]>(SEED_COMMENTS);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [virtualised, setVirtualised] = useState(true);
  const newCommentId = useId();
  const [newBody, setNewBody] = useState('');

  const handleReply = useCallback(
    async (parentId: string, body: string) => {
      // Simulate a network round-trip
      await new Promise((r) => setTimeout(r, 300));
      setComments((prev) => [
        ...prev,
        {
          id: String(++nextId),
          parentId,
          author: 'You',
          body,
          timestamp: new Date().toISOString(),
          likeCount: 0,
          isLiked: false,
        },
      ]);
    },
    [],
  );

  const handleLike = useCallback((commentId: string, isLiked: boolean) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              isLiked,
              likeCount: (c.likeCount ?? 0) + (isLiked ? 1 : -1),
            }
          : c,
      ),
    );
  }, []);

  const handleAddRoot = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = newBody.trim();
      if (!trimmed) return;
      setComments((prev) => [
        ...prev,
        {
          id: String(++nextId),
          parentId: null,
          author: 'You',
          body: trimmed,
          timestamp: new Date().toISOString(),
          likeCount: 0,
          isLiked: false,
        },
      ]);
      setNewBody('');
    },
    [newBody],
  );

  const bg = theme === 'dark' ? '#0f0f11' : '#f5f5f7';
  const surface = theme === 'dark' ? '#18181b' : '#ffffff';
  const border = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const mutedText = theme === 'dark' ? 'rgba(232,232,234,0.4)' : 'rgba(17,17,17,0.4)';

  return (
    <div style={{ minHeight: '100vh', background: bg, transition: 'background 0.2s' }}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <header
        style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          ...themes[theme],
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Kanopee
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: mutedText }}>
            Nested comment threads · {comments.length} comments
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: mutedText, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={virtualised}
              onChange={(e) => setVirtualised(e.target.checked)}
            />
            Virtualised (height=600)
          </label>

          <button
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: `1px solid ${border}`,
              background: 'transparent',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: 13,
              fontFamily: 'inherit',
            }}
          >
            {theme === 'dark' ? '☀ Light' : '☾ Dark'}
          </button>
        </div>
      </header>

      {/* ── Main layout ────────────────────────────────────────── */}
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 64px' }}>
        {/* New root comment */}
        <form
          onSubmit={handleAddRoot}
          style={{
            marginBottom: 32,
            padding: 16,
            background: surface,
            borderRadius: 10,
            border: `1px solid ${border}`,
            ...themes[theme],
          }}
        >
          <label
            htmlFor={newCommentId}
            style={{ display: 'block', fontWeight: 600, marginBottom: 8, fontSize: 14, color: 'inherit' }}
          >
            Add a comment
          </label>
          <textarea
            id={newCommentId}
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleAddRoot(e as unknown as React.FormEvent); }}
            placeholder="What's on your mind? (⌘↵ to submit)"
            rows={3}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '8px 10px',
              background: 'var(--canopy-input-bg)',
              border: '1px solid var(--canopy-input-border)',
              borderRadius: 6,
              color: 'inherit',
              fontFamily: 'inherit',
              fontSize: 14,
              resize: 'vertical',
              outline: 'none',
              minHeight: 72,
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button
              type="submit"
              disabled={!newBody.trim()}
              style={{
                padding: '6px 16px',
                background: 'var(--canopy-submit-bg)',
                color: 'var(--canopy-submit-color)',
                border: 'none',
                borderRadius: 6,
                fontFamily: 'inherit',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                opacity: newBody.trim() ? 1 : 0.4,
              }}
            >
              Post
            </button>
          </div>
        </form>

        {/* The three-liner ✨ */}
        <CommentThread
          comments={comments}
          onReply={handleReply}
          onLike={handleLike}
          height={virtualised ? 600 : undefined}
          style={{ ...themes[theme] } as React.CSSProperties}
        />
      </main>
    </div>
  );
}
