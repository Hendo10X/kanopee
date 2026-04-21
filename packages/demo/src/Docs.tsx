import { useState, useEffect, useCallback, useRef } from 'react';
import {
  CommentThread,
  CommentAvatar,
  CommentHeader,
  CommentBody,
  CommentActions,
  CommentReplyForm,
} from '@kanopee/react';
import type { RawComment, FlatItem } from '@kanopee/react';
import { CodeBlock } from './CodeBlock.js';
import { navigate } from './router.js';
import { useTheme } from './useTheme.js'; // still needed for dark threadStyle
import { SEED_COMMENTS } from './seed.js';

// ─── design tokens (CSS-variable-aware) ──────────────────────────
const fInter = "'Inter', sans-serif";
const fKarla = "'Karla', sans-serif";
const fMono  = "'Geist Mono', monospace";
const BORDER = '1px solid var(--ui-border)';
const MUTED  = 'var(--ui-muted)';
const SUBTLE = 'var(--ui-surface)';

// ─── responsive hook ──────────────────────────────────────────────
function useIsMobile(bp = 768) {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < bp,
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${bp - 1}px)`);
    const h = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener('change', h);
    setMobile(mq.matches);
    return () => mq.removeEventListener('change', h);
  }, [bp]);
  return mobile;
}

// ─── nav sections ─────────────────────────────────────────────────
const NAV = [
  {
    group: 'Getting Started',
    items: [
      { id: 'installation',  label: 'Installation' },
      { id: 'quick-start',   label: 'Quick start' },
    ],
  },
  {
    group: 'Components',
    items: [
      { id: 'comment-thread',     label: 'CommentThread' },
      { id: 'comment-row',        label: 'CommentRow' },
      { id: 'comment-avatar',     label: 'CommentAvatar' },
      { id: 'comment-header',     label: 'CommentHeader' },
      { id: 'comment-body',       label: 'CommentBody' },
      { id: 'comment-actions',    label: 'CommentActions' },
      { id: 'comment-reply-form', label: 'CommentReplyForm' },
    ],
  },
  {
    group: 'API Reference',
    items: [
      { id: 'raw-comment',    label: 'RawComment' },
      { id: 'flat-item',      label: 'FlatItem' },
      { id: 'css-vars',       label: 'CSS variables' },
      { id: 'core-functions', label: 'Core functions' },
    ],
  },
];

// ─── code snippets ────────────────────────────────────────────────
const S = {
  installReact:  'npm install @kanopee/react',
  installSvelte: 'npm install @kanopee/svelte',
  installVue:    'npm install @kanopee/vue',
  installCore:   'npm install @kanopee/core',

  quickStart: `import { CommentThread } from '@kanopee/react';
import '@kanopee/react/styles.css';

const comments = [
  { id: '1', parentId: null, author: 'Ada', body: 'Hello world', timestamp: new Date() },
  { id: '2', parentId: '1',  author: 'Alan', body: 'Hi Ada!',    timestamp: new Date() },
];

function App() {
  return (
    <CommentThread
      comments={comments}
      onReply={(parentId, body) => console.log(parentId, body)}
      onLike={(id, liked) => console.log(id, liked)}
    />
  );
}`,

  commentThread: `import { CommentThread } from '@kanopee/react';
import '@kanopee/react/styles.css';

<CommentThread
  comments={comments}        // RawComment[] — required
  onReply={handleReply}      // (parentId, body) => void | Promise<void>
  onLike={handleLike}        // (id, isLiked) => void
  onCollapse={handleCollapse}// (id, collapsed) => void
  height={500}               // fixed-height scroll container
  indentWidth={24}           // px per depth level (default 24)
  defaultCollapsed={['3']}   // start these subtrees collapsed
  emptyState={<p>No comments yet</p>}
  onScrollEnd={loadMore}     // fires near bottom — paginate here
/>`,

  renderItem: `import { CommentThread, CommentAvatar, CommentHeader, CommentBody, CommentActions } from '@kanopee/react';
import { useState } from 'react';

function CustomRow({ item, onLike }: { item: FlatItem; onLike: (id: string, liked: boolean) => void }) {
  const { comment, depth } = item;
  return (
    <div style={{ paddingLeft: depth * 24, display: 'flex', gap: 10, padding: '10px 0' }}>
      <CommentAvatar author={comment.author} avatarUrl={comment.avatarUrl} />
      <div>
        <CommentHeader author={comment.author} timestamp={comment.timestamp} />
        <CommentBody>{comment.body}</CommentBody>
        <CommentActions
          commentId={comment.id}
          isLiked={comment.isLiked}
          likeCount={comment.likeCount}
          onLike={onLike}
        />
      </div>
    </div>
  );
}

<CommentThread
  comments={comments}
  renderItem={(item) => <CustomRow item={item} onLike={handleLike} />}
/>`,

  commentAvatar: `import { CommentAvatar } from '@kanopee/react';

// Initials fallback
<CommentAvatar author="Ada Lovelace" />

// With image
<CommentAvatar author="Alan Turing" avatarUrl="/alan.jpg" />

// Custom size via CSS variable
<CommentAvatar
  author="Grace Hopper"
  style={{ '--canopy-avatar-size': '40px' } as React.CSSProperties}
/>`,

  commentHeader: `import { CommentHeader } from '@kanopee/react';

<CommentHeader
  author="Ada Lovelace"
  timestamp="2024-01-15T10:00:00Z" // ISO string
/>

<CommentHeader
  author="Alan Turing"
  timestamp={Date.now() - 3600_000} // Unix ms
/>`,

  commentBody: `import { CommentBody } from '@kanopee/react';

// Plain text
<CommentBody>Hello, world!</CommentBody>

// Custom renderer (e.g. markdown)
<CommentBody>
  <ReactMarkdown>{comment.body}</ReactMarkdown>
</CommentBody>`,

  commentActions: `import { CommentActions } from '@kanopee/react';
import { useState } from 'react';

function MyActions({ comment }) {
  const [replying, setReplying] = useState(false);
  return (
    <CommentActions
      commentId={comment.id}
      isLiked={comment.isLiked}
      likeCount={comment.likeCount}
      hasChildren={comment.hasChildren}
      isCollapsed={comment.isCollapsed}
      childCount={comment.childCount}
      onLike={(id, liked) => handleLike(id, liked)}
      onReplyClick={() => setReplying(true)}
      onCollapse={(id, c) => handleCollapse(id, c)}
    />
  );
}`,

  commentReplyForm: `import { CommentReplyForm } from '@kanopee/react';
import { useState } from 'react';

function WithReply({ comment }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(o => !o)}>Reply</button>
      {open && (
        <CommentReplyForm
          replyingTo={comment.author}   // shown in the placeholder
          onSubmit={async (body) => {
            await postReply(comment.id, body);
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      )}
    </>
  );
}`,

  coreFunctions: `import { buildTree, flattenTree, buildNodeMap, collapseSubtree, countVisibleDescendants } from '@kanopee/core';

// 1. Build the tree from a flat comment array — O(n)
const forest = buildTree(comments);

// 2. Flatten with depth metadata — respects collapse state
const items = flattenTree(forest, new Set(['comment-3']));
// items[n] = { comment, depth, hasChildren, isCollapsed, childCount }

// 3. Node map for O(1) lookups by ID
const map = buildNodeMap(forest);
const node = map.get('comment-3');

// 4. Collapse an entire subtree (returns new Set)
const collapsed = collapseSubtree(map, 'comment-3', new Set());

// 5. Count visible descendants of a node
const count = countVisibleDescendants(node, collapsed);`,
};

// ─── prop tables ──────────────────────────────────────────────────
type PropRow = { name: string; type: string; req: boolean; desc: string };

const THREAD_PROPS: PropRow[] = [
  { name: 'comments',           type: 'RawComment[]',                     req: true,  desc: 'Flat array of comment objects.' },
  { name: 'onReply',            type: '(parentId, body) => void|Promise', req: false, desc: 'Called on reply submit. Awaited if async — submit shows loading state.' },
  { name: 'onLike',             type: '(id, isLiked) => void',            req: false, desc: 'Toggle like. Update isLiked / likeCount in your data store.' },
  { name: 'onCollapse',         type: '(id, collapsed) => void',          req: false, desc: 'Collapse/expand callback. Omit to use internal uncontrolled state.' },
  { name: 'renderItem',         type: '(item: FlatItem) => ReactNode',    req: false, desc: 'Custom row renderer. Receives FlatItem — replaces the default CommentRow.' },
  { name: 'height',             type: 'number',                           req: false, desc: 'Scroll container height (px). Omit for natural height.' },
  { name: 'indentWidth',        type: 'number',                           req: false, desc: 'Pixels per indent level. Default: 24.' },
  { name: 'estimatedRowHeight', type: 'number',                           req: false, desc: 'Virtualiser height estimate. Auto-measured. Default: 80.' },
  { name: 'defaultCollapsed',   type: 'string[]',                         req: false, desc: 'IDs whose subtrees start collapsed (uncontrolled mode).' },
  { name: 'collapsed',          type: 'string[]',                         req: false, desc: 'Controlled collapse state. Pair with onCollapse.' },
  { name: 'emptyState',         type: 'ReactNode',                        req: false, desc: 'Content shown when comments array is empty.' },
  { name: 'onScrollEnd',        type: '() => void',                       req: false, desc: 'Fires near scroll bottom — use for pagination.' },
  { name: 'className / style',  type: 'string / CSSProperties',           req: false, desc: 'Applied to root element. Use style to pass CSS custom properties.' },
];

const AVATAR_PROPS: PropRow[] = [
  { name: 'author',    type: 'string',        req: true,  desc: 'Display name — used to generate initials when no image is provided.' },
  { name: 'avatarUrl', type: 'string',        req: false, desc: 'Image URL. Falls back to initials.' },
  { name: 'className', type: 'string',        req: false, desc: 'Extra class on the root element.' },
  { name: 'style',     type: 'CSSProperties', req: false, desc: 'Inline styles. Use to override --canopy-avatar-size.' },
];

const HEADER_PROPS: PropRow[] = [
  { name: 'author',    type: 'string',                 req: true,  desc: 'Author display name.' },
  { name: 'timestamp', type: 'string | number | Date', req: true,  desc: 'Accepts ISO strings, Unix ms, or Date objects. Shown as relative time.' },
  { name: 'className', type: 'string',                 req: false, desc: 'Extra class on the root element.' },
];

const BODY_PROPS: PropRow[] = [
  { name: 'children',  type: 'ReactNode', req: true,  desc: 'Comment content. Accepts any ReactNode — pass a markdown renderer as children.' },
  { name: 'className', type: 'string',    req: false, desc: 'Extra class on the paragraph element.' },
];

const ACTIONS_PROPS: PropRow[] = [
  { name: 'commentId',    type: 'string',                  req: true,  desc: 'Passed through to all callbacks.' },
  { name: 'isLiked',      type: 'boolean',                 req: false, desc: 'Whether the current user has liked this comment.' },
  { name: 'likeCount',    type: 'number',                  req: false, desc: 'Number of likes shown next to the heart.' },
  { name: 'hasChildren',  type: 'boolean',                 req: false, desc: 'Shows the collapse toggle when true.' },
  { name: 'isCollapsed',  type: 'boolean',                 req: false, desc: 'State of the collapse toggle.' },
  { name: 'childCount',   type: 'number',                  req: false, desc: 'Shown in the collapse button label.' },
  { name: 'onLike',       type: '(id, isLiked) => void',   req: false, desc: 'Omit to hide the like button.' },
  { name: 'onReplyClick', type: '() => void',              req: false, desc: 'Omit to hide the reply button.' },
  { name: 'onCollapse',   type: '(id, collapsed) => void', req: false, desc: 'Omit to hide the collapse toggle.' },
  { name: 'className',    type: 'string',                  req: false, desc: 'Extra class on the root element.' },
];

const REPLY_FORM_PROPS: PropRow[] = [
  { name: 'replyingTo', type: 'string',                        req: false, desc: 'Name shown in the textarea placeholder.' },
  { name: 'onSubmit',   type: '(body: string) => void|Promise', req: true,  desc: 'Called with the textarea value. Awaited if async.' },
  { name: 'onCancel',   type: '() => void',                    req: false, desc: 'Called when user presses Escape or Cancel.' },
  { name: 'className',  type: 'string',                        req: false, desc: 'Extra class on the root element.' },
];

const RAW_COMMENT_FIELDS: PropRow[] = [
  { name: 'id',        type: 'string',                    req: true,  desc: 'Unique identifier for this comment.' },
  { name: 'parentId',  type: 'string | null | undefined', req: false, desc: 'Parent comment ID. Null or undefined for root-level.' },
  { name: 'author',    type: 'string',                    req: true,  desc: 'Display name shown in the header.' },
  { name: 'body',      type: 'string',                    req: true,  desc: 'Comment text content.' },
  { name: 'timestamp', type: 'string | number | Date',    req: true,  desc: 'ISO string, Unix ms, or Date object.' },
  { name: 'avatarUrl', type: 'string',                    req: false, desc: 'Avatar image URL. Falls back to initials.' },
  { name: 'likeCount', type: 'number',                    req: false, desc: 'Number of likes displayed.' },
  { name: 'isLiked',   type: 'boolean',                   req: false, desc: 'Whether the current user has liked this.' },
  { name: '[key]',     type: 'unknown',                   req: false, desc: 'Any extra fields are preserved and passed through.' },
];

const FLAT_ITEM_FIELDS: PropRow[] = [
  { name: 'comment',     type: 'RawComment', req: true, desc: 'The original comment object.' },
  { name: 'depth',       type: 'number',     req: true, desc: '0 for root-level, +1 for each nested level.' },
  { name: 'hasChildren', type: 'boolean',    req: true, desc: 'Whether this comment has at least one child.' },
  { name: 'isCollapsed', type: 'boolean',    req: true, desc: "Whether this comment's children are collapsed." },
  { name: 'childCount',  type: 'number',     req: true, desc: 'Total number of direct children.' },
];

const CSS_VAR_ROWS: [string, string, string][] = [
  ['--canopy-indent-width',      '24px',             'Width of each nesting level'],
  ['--canopy-avatar-size',        '32px',             'Avatar diameter'],
  ['--canopy-avatar-radius',      '50%',              'Avatar border radius'],
  ['--canopy-line-color',         'currentColor 15%', 'Thread connector line colour'],
  ['--canopy-line-width',         '2px',              'Thread connector line thickness'],
  ['--canopy-font-family',        'inherit',          'Inherits from your page by default'],
  ['--canopy-font-size',          '14px',             'Base font size for all comment text'],
  ['--canopy-liked-color',        '#e5484d',          'Heart icon colour when active'],
  ['--canopy-input-bg',           'currentColor 5%',  'Reply textarea background'],
  ['--canopy-input-border',       'currentColor 15%', 'Reply textarea border'],
  ['--canopy-input-border-focus', 'currentColor 40%', 'Reply textarea focus ring'],
  ['--canopy-submit-bg',          'currentColor 90%', 'Submit button background'],
  ['--canopy-submit-color',       'canvas',           'Submit button text colour'],
  ['--canopy-meta-color',         'currentColor 50%', 'Timestamps and muted labels'],
  ['--canopy-action-color',       'currentColor 45%', 'Action button default colour'],
  ['--canopy-row-gap',            '12px',             'Vertical gap between rows'],
];

// ─── playground state ─────────────────────────────────────────────
let nextId = 300;

// ─── main page ────────────────────────────────────────────────────
export function Docs() {
  const mobile = useIsMobile();
  const { isDark } = useTheme(); // isDark only — toggle lives in main.tsx
  const [installTab, setInstallTab] = useState<'react'|'svelte'|'vue'|'core'>('react');
  const [activeNav, setActiveNav]   = useState('installation');
  const [playComments, setPlayComments] = useState<RawComment[]>(SEED_COMMENTS.slice(0, 8));

  // ref to the scrollable main container
  const mainRef = useRef<HTMLElement>(null);

  // scroll to top on every mount (browser may restore scroll on SPA re-navigation)
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, []);

  // highlight active section — observe within the main scroll container
  useEffect(() => {
    const container = mainRef.current;
    const allIds = NAV.flatMap((g) => g.items.map((i) => i.id));
    const obs = allIds.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveNav(id); },
        { root: container, rootMargin: '-20% 0px -60% 0px', threshold: 0 },
      );
      o.observe(el);
      return o;
    });
    return () => obs.forEach((o) => o?.disconnect());
  }, []);

  const handleReply = useCallback(async (parentId: string, body: string) => {
    await new Promise((r) => setTimeout(r, 300));
    setPlayComments((prev) => [
      ...prev,
      { id: String(++nextId), parentId, author: 'You', body, timestamp: new Date().toISOString(), likeCount: 0, isLiked: false },
    ]);
  }, []);

  const handleLike = useCallback((id: string, isLiked: boolean) => {
    setPlayComments((prev) =>
      prev.map((c) => c.id === id ? { ...c, isLiked, likeCount: (c.likeCount ?? 0) + (isLiked ? 1 : -1) } : c),
    );
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveNav(id);
  };

  const installCode = {
    react:  S.installReact,
    svelte: S.installSvelte,
    vue:    S.installVue,
    core:   S.installCore,
  }[installTab];

  // dark-mode aware canopy thread styles
  const threadStyle: React.CSSProperties = isDark ? {
    '--canopy-line-color':          'rgba(255,255,255,0.1)',
    '--canopy-input-bg':            'rgba(255,255,255,0.05)',
    '--canopy-input-border':        'rgba(255,255,255,0.12)',
    '--canopy-input-border-focus':  'rgba(255,255,255,0.35)',
    '--canopy-submit-bg':           '#f5f5f5',
    '--canopy-submit-color':        '#0a0a0a',
    '--canopy-meta-color':          'rgba(245,245,245,0.45)',
    '--canopy-action-color':        'rgba(245,245,245,0.4)',
    '--canopy-action-hover-color':  '#f5f5f5',
    '--canopy-indent-width':        mobile ? '14px' : '24px',
  } as React.CSSProperties : {
    '--canopy-line-color':          'rgba(0,0,0,0.08)',
    '--canopy-input-bg':            'rgba(0,0,0,0.03)',
    '--canopy-input-border':        'rgba(0,0,0,0.1)',
    '--canopy-input-border-focus':  'rgba(0,0,0,0.3)',
    '--canopy-submit-bg':           '#0a0a0a',
    '--canopy-submit-color':        '#fff',
    '--canopy-meta-color':          'rgba(10,10,10,0.45)',
    '--canopy-action-color':        'rgba(10,10,10,0.4)',
    '--canopy-action-hover-color':  '#0a0a0a',
    '--canopy-indent-width':        mobile ? '14px' : '24px',
  } as React.CSSProperties;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: fKarla, background: 'var(--ui-bg)', color: 'var(--ui-text)' }}>

      {/* ── SIDEBAR ──────────────────────────────────────────── */}
      {!mobile && (
        <aside style={{
          width: 220, flexShrink: 0,
          height: '100vh', overflowY: 'auto',
          borderRight: BORDER, padding: '14px 0',
          background: 'var(--ui-sidebar-bg)',
        }}>
          {/* Logo + back */}
          <div style={{ padding: '0 16px 16px', borderBottom: BORDER, marginBottom: 16 }}>
            <div style={{ fontFamily: fInter, fontSize: 15, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--ui-text)', marginBottom: 6 }}>
              Kanopee
            </div>
            <div style={{ fontFamily: fMono, fontSize: 11, color: MUTED, marginBottom: 10 }}>docs</div>
            <button
              onClick={() => navigate('/')}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: fKarla, fontSize: 12.5, color: MUTED,
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              }}
            >
              Back to home
            </button>
          </div>

          {NAV.map((group) => (
            <div key={group.group} style={{ marginBottom: 24, padding: '0 12px' }}>
              <div style={{
                fontFamily: fMono, fontSize: 10, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'var(--ui-faint)',
                padding: '0 8px', marginBottom: 6,
              }}>
                {group.group}
              </div>
              {group.items.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    fontFamily: fKarla, fontSize: 13,
                    fontWeight: activeNav === id ? 600 : 400,
                    color: activeNav === id ? 'var(--ui-text)' : MUTED,
                    background: activeNav === id ? 'var(--ui-active-bg)' : 'none',
                    border: 'none', borderRadius: 6,
                    padding: '6px 8px', cursor: 'pointer',
                    transition: 'background 120ms, color 120ms',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          ))}
        </aside>
      )}

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <main ref={mainRef} style={{ flex: 1, height: '100vh', overflowY: 'auto', overflowX: 'hidden', paddingBottom: 120 }}>

        {/* Mobile top bar */}
        {mobile && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '14px 20px', paddingRight: 60, borderBottom: BORDER,
            background: 'var(--ui-sidebar-bg)',
            position: 'sticky', top: 0, zIndex: 10,
          }}>
            <span style={{ fontFamily: fInter, fontSize: 14, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--ui-text)' }}>
              Kanopee / docs
            </span>
            <button
              onClick={() => navigate('/')}
              style={{
                fontFamily: fKarla, fontSize: 12.5, color: MUTED,
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                flexShrink: 0,
              }}
            >
              · Home
            </button>
          </div>
        )}

        <div style={{ maxWidth: 760, margin: '0 auto', padding: mobile ? '32px 20px' : '48px 48px' }}>

          {/* ── GETTING STARTED ──────────────────────────────── */}
          <Section id="installation" title="Installation" sub="Getting Started">
            <p style={bodyStyle}>Install the adapter for your framework. The core library is included as a peer dependency.</p>

            <TabBar
              tabs={[
                { key: 'react',  label: 'React' },
                { key: 'svelte', label: 'Svelte' },
                { key: 'vue',    label: 'Vue' },
                { key: 'core',   label: 'Core only' },
              ]}
              active={installTab}
              onSelect={(k) => setInstallTab(k as typeof installTab)}
            />
            <CodeBlock code={installCode} />

            {installTab === 'react' && (
              <Callout>Import the stylesheet once in your app entry point: <code style={inlineCode}>import '@kanopee/react/styles.css'</code></Callout>
            )}
          </Section>

          <Divider />

          <Section id="quick-start" title="Quick start">
            <p style={bodyStyle}>
              Pass a flat array of comments with parent IDs. Kanopee builds the tree, virtualises the list, and hands you callbacks for replies, likes, and collapse.
            </p>
            <CodeBlock code={S.quickStart} />
            <Callout>
              The <code style={inlineCode}>timestamp</code> field accepts an ISO string, Unix milliseconds, or a <code style={inlineCode}>Date</code> object — it's displayed as relative time.
            </Callout>
          </Section>

          <Divider />

          {/* ── COMPONENTS ───────────────────────────────────── */}
          <Section id="comment-thread" title="CommentThread" sub="Components">
            <p style={bodyStyle}>
              The top-level component. Pass your flat comment array and callbacks — Kanopee handles tree building, virtualisation, and collapse state internally.
            </p>
            <CodeBlock code={S.commentThread} />
            <PropTable rows={THREAD_PROPS} />

            <h4 style={h4Style}>Live preview</h4>
            <p style={bodyStyle}>The real <code style={inlineCode}>{'<CommentThread />'}</code> — try replying, liking, or collapsing a thread.</p>
            <div style={{ border: BORDER, borderRadius: 10, overflow: 'hidden', marginTop: 16 }}>
              <div style={{ background: SUBTLE, borderBottom: BORDER, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                {['#ffbd44', '#ff605c', '#00ca4e'].map((c) => (
                  <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />
                ))}
                <span style={{ fontFamily: fMono, fontSize: 11, color: MUTED, marginLeft: 8 }}>kanopee · live</span>
              </div>
              <div style={{ padding: mobile ? 14 : 24, background: 'var(--ui-bg)' }}>
                <CommentThread
                  comments={playComments}
                  onReply={handleReply}
                  onLike={handleLike}
                  height={400}
                  style={threadStyle}
                />
              </div>
            </div>

            <h4 style={{ ...h4Style, marginTop: 40 }}>Custom rows with <code style={inlineCode}>renderItem</code></h4>
            <p style={bodyStyle}>
              Pass <code style={inlineCode}>renderItem</code> to swap out the default row with your own composition of primitives. The tree, virtualisation, and collapse state still work exactly as normal.
            </p>
            <CodeBlock code={S.renderItem} />
          </Section>

          <Divider />

          <Section id="comment-row" title="CommentRow">
            <p style={bodyStyle}>
              The default row rendered by <code style={inlineCode}>{'<CommentThread />'}</code>. It composes all five primitives and manages reply-form open/close state internally. You generally don't use this directly — use <code style={inlineCode}>renderItem</code> when you need a custom row.
            </p>
            <PropTable rows={[
              { name: 'item',        type: 'FlatItem',                           req: true,  desc: 'The item from flattenTree — contains comment, depth, hasChildren, isCollapsed, childCount.' },
              { name: 'indentWidth', type: 'number',                             req: true,  desc: 'Passed through from CommentThread.' },
              { name: 'onReply',     type: '(parentId, body) => void|Promise',   req: false, desc: 'Passed through from CommentThread.' },
              { name: 'onLike',      type: '(id, isLiked) => void',              req: false, desc: 'Passed through from CommentThread.' },
              { name: 'onCollapse',  type: '(id, collapsed) => void',            req: false, desc: 'Passed through from CommentThread.' },
            ]} />
          </Section>

          <Divider />

          <Section id="comment-avatar" title="CommentAvatar">
            <p style={bodyStyle}>
              Circular avatar with automatic initials fallback. When no <code style={inlineCode}>avatarUrl</code> is provided, it extracts up to two initials from the author name.
            </p>
            <CodeBlock code={S.commentAvatar} />
            <div style={{ border: BORDER, borderRadius: 8, padding: '20px 16px', background: SUBTLE, marginTop: 16 }}>
              <div className="canopy-thread" style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                <CommentAvatar author="Ada Lovelace" />
                <CommentAvatar author="Alan Turing" />
                <CommentAvatar author="Grace Hopper" />
                <CommentAvatar author="Linus Torvalds" avatarUrl="https://avatars.githubusercontent.com/u/1024025?v=4" />
                <CommentAvatar author="Margaret Hamilton" style={{ '--canopy-avatar-size': '48px' } as React.CSSProperties} />
              </div>
            </div>
            <PropTable rows={AVATAR_PROPS} />
          </Section>

          <Divider />

          <Section id="comment-header" title="CommentHeader">
            <p style={bodyStyle}>
              Author name and a human-readable relative timestamp (e.g. "3 hours ago"). The timestamp accepts an ISO string, Unix ms, or a <code style={inlineCode}>Date</code> object.
            </p>
            <CodeBlock code={S.commentHeader} />
            <div style={{ border: BORDER, borderRadius: 8, padding: '20px 16px', background: SUBTLE, marginTop: 16 }}>
              <div className="canopy-thread" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <CommentHeader author="Ada Lovelace"     timestamp={new Date(Date.now() - 3 * 60 * 60 * 1000)} />
                <CommentHeader author="Alan Turing"      timestamp={new Date(Date.now() - 25 * 60 * 1000)} />
                <CommentHeader author="Grace Hopper"     timestamp={new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)} />
              </div>
            </div>
            <PropTable rows={HEADER_PROPS} />
          </Section>

          <Divider />

          <Section id="comment-body" title="CommentBody">
            <p style={bodyStyle}>
              The comment text paragraph. Accepts any <code style={inlineCode}>ReactNode</code> as children — plug in your own markdown renderer, syntax highlighter, or rich-text display.
            </p>
            <CodeBlock code={S.commentBody} />
            <div style={{ border: BORDER, borderRadius: 8, padding: '20px 16px', background: SUBTLE, marginTop: 16 }}>
              <div className="canopy-thread">
                <CommentBody>
                  The Analytical Engine weaves algebraic patterns, just as the Jacquard loom weaves flowers and leaves. I wonder if we will ever truly understand the implications of what we are building.
                </CommentBody>
              </div>
            </div>
            <PropTable rows={BODY_PROPS} />
          </Section>

          <Divider />

          <Section id="comment-actions" title="CommentActions">
            <p style={bodyStyle}>
              Like, reply, and collapse controls. Every callback is optional — omit any button you don't need and it disappears from the UI.
            </p>
            <CodeBlock code={S.commentActions} />
            <div style={{ border: BORDER, borderRadius: 8, padding: '20px 16px', background: SUBTLE, marginTop: 16 }}>
              <div className="canopy-thread" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <p style={{ fontFamily: fMono, fontSize: 11, color: MUTED, marginBottom: 8 }}>All actions</p>
                  <CommentActions commentId="demo1" likeCount={12} isLiked={false} hasChildren childCount={3} isCollapsed={false} onLike={() => {}} onReplyClick={() => {}} onCollapse={() => {}} />
                </div>
                <div>
                  <p style={{ fontFamily: fMono, fontSize: 11, color: MUTED, marginBottom: 8 }}>Liked state</p>
                  <CommentActions commentId="demo2" likeCount={13} isLiked={true} onLike={() => {}} />
                </div>
                <div>
                  <p style={{ fontFamily: fMono, fontSize: 11, color: MUTED, marginBottom: 8 }}>Collapsed subtree</p>
                  <CommentActions commentId="demo3" likeCount={5} hasChildren childCount={7} isCollapsed={true} onLike={() => {}} onCollapse={() => {}} />
                </div>
              </div>
            </div>
            <PropTable rows={ACTIONS_PROPS} />
          </Section>

          <Divider />

          <Section id="comment-reply-form" title="CommentReplyForm">
            <p style={bodyStyle}>
              Inline textarea for composing a reply. Submits on <kbd style={kbdStyle}>⌘ ↵</kbd> or the button. Calls <code style={inlineCode}>onCancel</code> on <kbd style={kbdStyle}>Escape</kbd>. The submit button shows a loading state while the promise resolves.
            </p>
            <CodeBlock code={S.commentReplyForm} />
            <div style={{ border: BORDER, borderRadius: 8, padding: '20px 16px', background: SUBTLE, marginTop: 16 }}>
              <div className="canopy-thread" style={threadStyle}>
                <CommentReplyForm
                  replyingTo="Ada Lovelace"
                  onSubmit={async () => { await new Promise(r => setTimeout(r, 800)); }}
                  onCancel={() => {}}
                />
              </div>
            </div>
            <PropTable rows={REPLY_FORM_PROPS} />
          </Section>

          <Divider />

          {/* ── API REFERENCE ─────────────────────────────────── */}
          <Section id="raw-comment" title="RawComment" sub="API Reference">
            <p style={bodyStyle}>
              The shape of each element in the <code style={inlineCode}>comments</code> array. Only five fields are required; all others are optional. Any extra fields you add are preserved and accessible via <code style={inlineCode}>item.comment</code> in <code style={inlineCode}>renderItem</code>.
            </p>
            <PropTable rows={RAW_COMMENT_FIELDS} />
          </Section>

          <Divider />

          <Section id="flat-item" title="FlatItem">
            <p style={bodyStyle}>
              Produced by <code style={inlineCode}>flattenTree()</code> and passed to <code style={inlineCode}>renderItem</code>. Contains the original comment plus tree-position metadata computed during flattening.
            </p>
            <PropTable rows={FLAT_ITEM_FIELDS} />
          </Section>

          <Divider />

          <Section id="css-vars" title="CSS variables">
            <p style={bodyStyle}>
              Every visual token is a <code style={inlineCode}>--canopy-*</code> custom property. Override at <code style={inlineCode}>:root</code>, a wrapper element, or inline via the <code style={inlineCode}>style</code> prop on <code style={inlineCode}>{'<CommentThread />'}</code>.
            </p>
            <CodeBlock code={`/* example overrides */
:root {
  --canopy-avatar-size:   40px;
  --canopy-indent-width:  20px;
  --canopy-liked-color:   #f97316;
  --canopy-submit-bg:     #6366f1;
}`} />
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginTop: 20 }}>
              <div style={{ border: BORDER, borderRadius: 8, overflow: 'hidden', minWidth: 500 }}>
                {CSS_VAR_ROWS.map(([name, def, desc], i, arr) => (
                  <div key={name} style={{
                    display: 'grid', gridTemplateColumns: '220px 110px 1fr',
                    background: i % 2 === 0 ? 'var(--ui-bg)' : SUBTLE,
                    borderBottom: i < arr.length - 1 ? BORDER : 'none',
                  }}>
                    <div style={{ fontFamily: fMono, fontSize: 12, padding: '9px 14px', color: 'var(--ui-text)', borderRight: BORDER }}>{name}</div>
                    <div style={{ fontFamily: fMono, fontSize: 12, padding: '9px 14px', color: MUTED, borderRight: BORDER }}>{def}</div>
                    <div style={{ fontFamily: fKarla, fontSize: 12.5, padding: '9px 14px', color: MUTED, lineHeight: 1.5 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Divider />

          <Section id="core-functions" title="Core functions">
            <p style={bodyStyle}>
              <code style={inlineCode}>@kanopee/core</code> is a zero-dependency package with pure TypeScript functions. Use it to build adapters for Svelte, Vue, Angular, or any other renderer.
            </p>
            <CodeBlock code={S.coreFunctions} />
            <PropTable rows={[
              { name: 'buildTree(comments)',                       type: '(RawComment[]) → TreeNode[]',              req: false, desc: 'Builds a forest from a flat array. Two linear passes — O(n).' },
              { name: 'flattenTree(forest, collapsed)',            type: '(TreeNode[], CollapseState) → FlatItem[]', req: false, desc: 'Depth-first walk. Skips children of collapsed nodes.' },
              { name: 'buildNodeMap(forest)',                      type: '(TreeNode[]) → Map<string, TreeNode>',     req: false, desc: 'Flat lookup map for O(1) access by comment ID.' },
              { name: 'collapseSubtree(map, id, state)',           type: '(Map, string, CollapseState) → CollapseState', req: false, desc: 'Returns a new Set with the given subtree fully collapsed.' },
              { name: 'countVisibleDescendants(node, collapsed)',  type: '(TreeNode, CollapseState) → number',      req: false, desc: 'Count of visible descendants (respects collapse state).' },
            ]} />
          </Section>

        </div>
      </main>
    </div>
  );
}

// ─── shared sub-components ────────────────────────────────────────

const bodyStyle: React.CSSProperties = {
  fontFamily: fKarla, fontSize: 14.5, lineHeight: 1.75, color: MUTED, margin: '0 0 16px',
};

const h4Style: React.CSSProperties = {
  fontFamily: fInter, fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em',
  marginTop: 32, marginBottom: 10, color: 'var(--ui-text)',
};

const inlineCode: React.CSSProperties = {
  fontFamily: fMono, fontSize: '0.88em',
  background: 'var(--ui-surface)', border: '1px solid var(--ui-border)',
  borderRadius: 4, padding: '1px 5px', color: 'var(--ui-text)',
};

const kbdStyle: React.CSSProperties = {
  fontFamily: fMono, fontSize: '0.8em',
  background: 'var(--ui-surface)', border: '1px solid var(--ui-border)',
  borderRadius: 4, padding: '1px 5px', color: 'var(--ui-muted)',
};

function Section({ id, title, sub, children }: { id: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: 8, scrollMarginTop: 24 }}>
      {sub && (
        <div style={{ fontFamily: fMono, fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ui-faint)', marginBottom: 8 }}>
          {sub}
        </div>
      )}
      <h2 style={{ fontFamily: fInter, fontSize: 22, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 14, color: 'var(--ui-text)' }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--ui-border)', margin: '52px 0' }} />;
}

function TabBar({ tabs, active, onSelect }: { tabs: { key: string; label: string }[]; active: string; onSelect: (k: string) => void }) {
  return (
    <div style={{ display: 'flex', borderBottom: BORDER, overflowX: 'auto', marginBottom: 16 }}>
      {tabs.map(({ key, label }) => (
        <button key={key} onClick={() => onSelect(key)} style={{
          fontFamily: fKarla, fontSize: 13, fontWeight: active === key ? 600 : 400,
          padding: '8px 14px', background: 'none', border: 'none', whiteSpace: 'nowrap',
          borderBottom: active === key ? '2px solid var(--ui-text)' : '2px solid transparent',
          cursor: 'pointer', color: active === key ? 'var(--ui-text)' : MUTED,
          marginBottom: -1, transition: 'color 120ms', flexShrink: 0,
        }}>
          {label}
        </button>
      ))}
    </div>
  );
}

function PropTable({ rows }: { rows: PropRow[] }) {
  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginTop: 16 }}>
      <div style={{ border: BORDER, borderRadius: 8, overflow: 'hidden', minWidth: 480 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 50px', background: SUBTLE, borderBottom: BORDER }}>
          {['Prop / field', 'Type · description', 'Req'].map((h) => (
            <div key={h} style={{ fontFamily: fMono, fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ui-faint)', padding: '8px 12px' }}>{h}</div>
          ))}
        </div>
        {rows.map((row, i) => (
          <div key={row.name} style={{
            display: 'grid', gridTemplateColumns: '160px 1fr 50px',
            background: i % 2 === 0 ? 'var(--ui-bg)' : SUBTLE,
            borderBottom: i < rows.length - 1 ? BORDER : 'none',
            alignItems: 'start',
          }}>
            <div style={{ fontFamily: fMono, fontSize: 11.5, padding: '10px 12px', color: 'var(--ui-text)', borderRight: BORDER, wordBreak: 'break-all' }}>{row.name}</div>
            <div style={{ padding: '10px 12px', borderRight: BORDER }}>
              <div style={{ fontFamily: fMono, fontSize: 11, color: 'var(--ui-muted)', marginBottom: 3 }}>{row.type}</div>
              <div style={{ fontFamily: fKarla, fontSize: 12.5, color: MUTED, lineHeight: 1.55 }}>{row.desc}</div>
            </div>
            <div style={{ padding: '10px 12px', textAlign: 'center' }}>
              {row.req
                ? <span style={{ fontFamily: fMono, fontSize: 10, background: 'var(--ui-req-bg)', color: 'var(--ui-req-text)', borderRadius: 3, padding: '2px 5px' }}>yes</span>
                : <span style={{ fontFamily: fMono, fontSize: 10, color: 'var(--ui-faint)' }}>—</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--ui-callout-bg)', border: '1px solid var(--ui-callout-bd)',
      borderRadius: 7, padding: '12px 16px', marginTop: 14,
      fontFamily: fKarla, fontSize: 13.5, lineHeight: 1.65, color: 'var(--ui-callout-tx)',
    }}>
      {children}
    </div>
  );
}
