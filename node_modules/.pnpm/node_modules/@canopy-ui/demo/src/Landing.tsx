import { useState, useCallback, useEffect } from 'react';
import { Lightning }  from '@phosphor-icons/react/dist/csr/Lightning';
import { PaintBrush } from '@phosphor-icons/react/dist/csr/PaintBrush';
import { Tree }       from '@phosphor-icons/react/dist/csr/Tree';
import { Package }    from '@phosphor-icons/react/dist/csr/Package';
import { HandHeart }  from '@phosphor-icons/react/dist/csr/HandHeart';
import { Sliders }    from '@phosphor-icons/react/dist/csr/Sliders';
import { CommentThread } from '@kanopee/react';
import type { RawComment } from '@kanopee/react';
import { CodeBlock } from './CodeBlock.js';
import { SEED_COMMENTS } from './seed.js';

// ─── fonts ────────────────────────────────────────────────────────
const fInter = "'Inter', sans-serif";
const fKarla = "'Karla', sans-serif";
const fMono  = "'Geist Mono', monospace";

const BORDER = '1px solid #ebebeb';
const MUTED  = '#666';
const SUBTLE = '#f7f7f7';

// ─── responsive hook ──────────────────────────────────────────────
function useIsMobile(bp = 640) {
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

// ─── snippets ─────────────────────────────────────────────────────
const INSTALL_REACT = 'npm install @kanopee/react';
const INSTALL_CORE  = 'npm install @kanopee/core';

const USAGE_REACT = `import { CommentThread } from '@kanopee/react';
import '@kanopee/react/styles.css';

function App() {
  return (
    <CommentThread
      comments={comments}
      onReply={(parentId, body) => postReply(parentId, body)}
      onLike={(id, liked) => toggleLike(id, liked)}
    />
  );
}`;

const USAGE_CORE = `import { buildTree, flattenTree } from '@kanopee/core';

// Build the tree once
const forest = buildTree(flatComments);

// Flatten with depth metadata (respects collapse state)
const items = flattenTree(forest, collapsedSet);
// items[n] = { comment, depth, hasChildren, isCollapsed, childCount }`;

const CSS_VARS = `/* Drop into your :root or any wrapper */
:root {
  --canopy-indent-width:   24px;
  --canopy-avatar-size:    32px;
  --canopy-line-color:     rgba(0,0,0,0.1);
  --canopy-font-family:    inherit;
  --canopy-font-size:      14px;
  --canopy-author-color:   inherit;
  --canopy-liked-color:    #e5484d;
  --canopy-input-bg:       rgba(0,0,0,0.04);
  --canopy-submit-bg:      #111;
  --canopy-submit-color:   #fff;
}`;

// ─── features ─────────────────────────────────────────────────────
const FEATURES = [
  { Icon: Lightning,  color: '#3b82f6', title: 'Virtualised by default',    desc: 'Powered by @tanstack/virtual. Render 10,000 comments at the same cost as 10 — only visible rows are in the DOM.' },
  { Icon: PaintBrush, color: '#f97316', title: 'CSS custom properties',     desc: 'Every visual token is a --canopy-* variable. Override a handful and it feels native to any design system, zero conflicts.' },
  { Icon: Tree,       color: '#22c55e', title: 'O(n) tree building',        desc: 'buildTree processes your flat array in two linear passes. flattenTree depth-first walks the result, skipping collapsed subtrees.' },
  { Icon: Package,    color: '#a855f7', title: 'Framework-agnostic core',   desc: '@kanopee/core has zero runtime deps. The React adapter is ~3 kB gzipped; the core is under 1 kB.' },
  { Icon: HandHeart,  color: '#6366f1', title: 'Accessible markup',         desc: 'role="region", aria-label, aria-pressed, aria-expanded, and focus-visible styles are wired up out of the box.' },
  { Icon: Sliders,    color: '#14b8a6', title: 'Controlled or uncontrolled', desc: 'Pass collapsed + onCollapse to own state yourself, or omit both and Kanopee manages it internally.' },
] as const;

// ─── docs data ────────────────────────────────────────────────────
const PROPS = [
  { name: 'comments',           type: 'RawComment[]',                     req: true,  desc: 'Flat array of comments. Only id, parentId, author, body, and timestamp are required.' },
  { name: 'onReply',            type: '(parentId, body) => void|Promise', req: false, desc: 'Called on submit. Awaited if it returns a Promise — submit shows a loading state.' },
  { name: 'onLike',             type: '(id, isLiked) => void',            req: false, desc: 'Toggle like. Update isLiked / likeCount in your state.' },
  { name: 'onCollapse',         type: '(id, collapsed) => void',          req: false, desc: 'Called on collapse/expand. Omit to use internal uncontrolled state.' },
  { name: 'height',             type: 'number',                           req: false, desc: 'Fixed height (px) for the scroll container. Enables virtualisation.' },
  { name: 'indentWidth',        type: 'number',                           req: false, desc: 'Pixel width per indent level. Default: 24.' },
  { name: 'estimatedRowHeight', type: 'number',                           req: false, desc: 'Virtualiser size estimate per row. Auto-measured. Default: 80.' },
  { name: 'defaultCollapsed',   type: 'string[]',                         req: false, desc: 'IDs whose subtrees start collapsed (uncontrolled).' },
  { name: 'collapsed',          type: 'string[]',                         req: false, desc: 'Controlled collapse state. Pair with onCollapse.' },
  { name: 'emptyState',         type: 'ReactNode',                        req: false, desc: 'Custom content when comments is empty.' },
  { name: 'onScrollEnd',        type: '() => void',                       req: false, desc: 'Fires near the bottom. Use for pagination.' },
  { name: 'className / style',  type: 'string / CSSProperties',           req: false, desc: 'Root element. Use style to pass CSS custom properties inline.' },
];

const RAW_COMMENT = [
  { name: 'id',        type: 'string',                    req: true,  desc: 'Unique identifier.' },
  { name: 'parentId',  type: 'string | null | undefined', req: false, desc: 'ID of parent. Null / undefined for root-level.' },
  { name: 'author',    type: 'string',                    req: true,  desc: 'Display name shown in the header.' },
  { name: 'body',      type: 'string',                    req: true,  desc: 'Comment text.' },
  { name: 'timestamp', type: 'string | number | Date',    req: true,  desc: 'Relative time. Accepts ISO strings, Unix ms, or Date.' },
  { name: 'avatarUrl', type: 'string',                    req: false, desc: 'Avatar URL. Falls back to initials.' },
  { name: 'likeCount', type: 'number',                    req: false, desc: 'Total likes shown next to the heart.' },
  { name: 'isLiked',   type: 'boolean',                   req: false, desc: 'Whether the current user has liked this.' },
  { name: '[key]',     type: 'unknown',                   req: false, desc: 'Any extra fields are preserved and passed through.' },
];

let nextId = 200;

// ─── page ─────────────────────────────────────────────────────────
export function Landing() {
  const mobile = useIsMobile();
  const [activeSection, setActiveSection] = useState('hero');
  const [installTab, setInstallTab]       = useState<'react' | 'core'>('react');
  const [usageTab, setUsageTab]           = useState<'component' | 'core' | 'css'>('component');
  const [docsTab, setDocsTab]             = useState<'props' | 'type'>('props');
  const [playComments, setPlayComments]   = useState<RawComment[]>(SEED_COMMENTS);

  useEffect(() => {
    const ids = ['hero', 'how-to-use', 'playground', 'docs'];
    const obs = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveSection(id); },
        { threshold: 0.2 },
      );
      o.observe(el);
      return o;
    });
    return () => obs.forEach((o) => o?.disconnect());
  }, []);

  const handleReply = useCallback(async (parentId: string, body: string) => {
    await new Promise((r) => setTimeout(r, 250));
    setPlayComments((prev) => [
      ...prev,
      { id: String(++nextId), parentId, author: 'You', body, timestamp: new Date().toISOString(), likeCount: 0, isLiked: false },
    ]);
  }, []);

  const handleLike = useCallback((id: string, isLiked: boolean) => {
    setPlayComments((prev) =>
      prev.map((c) => c.id === id ? { ...c, isLiked, likeCount: (c.likeCount ?? 0) + (isLiked ? 1 : -1) } : c)
    );
  }, []);

  const sp = mobile ? '44px 20px' : '80px 24px'; // section padding
  const sectionStyle = { padding: sp, maxWidth: 820, margin: '0 auto', width: '100%', boxSizing: 'border-box' as const };

  return (
    <div style={{ paddingBottom: 100, overflowX: 'hidden', width: '100%' }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section id="hero" style={{
        minHeight: mobile ? 'auto' : '100vh',
        display: 'flex', alignItems: 'center', justifyContent: mobile ? 'flex-start' : 'center',
        padding: mobile ? '36px 20px 48px' : '72px 24px',
        width: '100%', boxSizing: 'border-box',
      }}>
        <div style={{ maxWidth: 380, width: '100%' }}>
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontFamily: fInter, fontSize: 18, fontWeight: 700, letterSpacing: '-0.04em' }}>Kanopee</span>
          </div>

          <h1 style={{ fontFamily: fInter, fontSize: mobile ? 34 : 42, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1.05, marginBottom: 16 }}>
            Nested comment<br />threads, done.
          </h1>

          <p style={{ fontFamily: fKarla, fontSize: 15, lineHeight: 1.65, color: MUTED, marginBottom: 28 }}>
            Pass a flat array of comments with parent IDs. Kanopee builds the tree, virtualises the list, and hands you callbacks for replies, likes, and collapse — drop it into React, Svelte, or Vue without touching your design system.
          </p>

          {/* Install tabs */}
          <div style={{ display: 'flex', borderBottom: BORDER, marginBottom: 12 }}>
            {(['react', 'core'] as const).map((t) => (
              <button key={t} onClick={() => setInstallTab(t)} style={{
                fontFamily: fMono, fontSize: 12, padding: '6px 12px', background: 'none', border: 'none',
                borderBottom: installTab === t ? '2px solid #0a0a0a' : '2px solid transparent',
                cursor: 'pointer', color: installTab === t ? '#0a0a0a' : MUTED,
                fontWeight: installTab === t ? 500 : 400, marginBottom: -1,
              }}>
                {t === 'react' ? '@kanopee/react' : '@kanopee/core'}
              </button>
            ))}
          </div>
          <CodeBlock code={installTab === 'react' ? INSTALL_REACT : INSTALL_CORE} />

          <div style={{ display: 'flex', gap: 20, marginTop: 20, flexWrap: 'wrap' }}>
            {[{ label: 'Read the docs', href: '#docs' }, { label: 'Try the playground', href: '#playground' }].map(({ label, href }) => (
              <a key={href} href={href} style={{ fontFamily: fKarla, fontSize: 13, color: MUTED, textDecoration: 'none', borderBottom: '1px solid #d0d0d0', paddingBottom: 1 }}>
                {label}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 32, flexWrap: 'wrap' }}>
            {[
              { label: 'React',      color: '#0ea5e9' },
              { label: 'Svelte',     color: '#f43f5e' },
              { label: 'Vue',        color: '#10b981' },
              { label: 'Vanilla JS', color: '#d97706' },
            ].map(({ label }) => (
              <span key={label} style={{ fontFamily: fMono, fontSize: 11, padding: '4px 10px', border: '1px solid #d1d5db', borderRadius: 4, color: '#000' }}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section style={sectionStyle}>
        <h2 style={{ fontFamily: fInter, fontSize: mobile ? 24 : 28, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: mobile ? 32 : 48 }}>
          Everything you need.<br />Nothing you don't.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: mobile ? 28 : 36 }}>
          {FEATURES.map(({ Icon, color, title, desc }) => (
            <div key={title}>
              <Icon size={22} weight="duotone" color={color} style={{ display: 'block', marginBottom: 10 }} />
              <h3 style={{ fontFamily: fInter, fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 5 }}>{title}</h3>
              <p style={{ fontFamily: fKarla, fontSize: 13, lineHeight: 1.65, color: MUTED }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── HOW TO USE ───────────────────────────────────────── */}
      <section id="how-to-use" style={sectionStyle}>
        <h2 style={{ fontFamily: fInter, fontSize: mobile ? 24 : 28, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 10 }}>
          Three lines of code.
        </h2>
        <p style={{ fontFamily: fKarla, fontSize: 15, color: MUTED, lineHeight: 1.65, marginBottom: 28, maxWidth: 520 }}>
          Import the component, pass your flat comment array, wire up callbacks.
        </p>

        <TabBar
          tabs={[{ key: 'component', label: 'React' }, { key: 'core', label: 'Core API' }, { key: 'css', label: 'CSS vars' }]}
          active={usageTab}
          onSelect={(k) => setUsageTab(k as typeof usageTab)}
        />

        <div style={{ marginTop: 20 }}>
          {usageTab === 'component' && (
            <TwoCol mobile={mobile}
              left={<CodeBlock code={USAGE_REACT} />}
              right={
                <>
                  <p style={{ fontFamily: fKarla, fontSize: 13.5, lineHeight: 1.7, color: MUTED, marginBottom: 14 }}>
                    The component handles all internal state — tree building, virtualisation, and collapse. You only manage your own data.
                  </p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      'onReply can return a Promise; the submit button shows a loading state.',
                      'onLike fires immediately for optimistic updates.',
                      'Omit onCollapse to let Kanopee manage collapse state.',
                    ].map((tip) => (
                      <li key={tip} style={{ display: 'flex', gap: 8 }}>
                        <span style={{ color: '#ccc', flexShrink: 0 }}>—</span>
                        <span style={{ fontFamily: fKarla, fontSize: 13, lineHeight: 1.6, color: MUTED }}>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </>
              }
            />
          )}
          {usageTab === 'core' && (
            <TwoCol mobile={mobile}
              left={<CodeBlock code={USAGE_CORE} />}
              right={
                <p style={{ fontFamily: fKarla, fontSize: 13.5, lineHeight: 1.7, color: MUTED }}>
                  Use <code style={{ fontFamily: fMono }}>@kanopee/core</code> to build adapters for Svelte, Vue, Angular, or your own renderer — no React required. Pure functions, no side-effects, no DOM dependency.
                </p>
              }
            />
          )}
          {usageTab === 'css' && (
            <TwoCol mobile={mobile}
              left={<CodeBlock code={CSS_VARS} />}
              right={
                <p style={{ fontFamily: fKarla, fontSize: 13.5, lineHeight: 1.7, color: MUTED }}>
                  Every visual decision is a <code style={{ fontFamily: fMono }}>--canopy-*</code> custom property. Override at <code style={{ fontFamily: fMono }}>:root</code>, a wrapper, or inline via the <code style={{ fontFamily: fMono }}>style</code> prop. No Tailwind, no CSS-in-JS.
                </p>
              }
            />
          )}
        </div>
      </section>

      <Divider />

      {/* ── PLAYGROUND ───────────────────────────────────────── */}
      <section id="playground" style={sectionStyle}>
        <h2 style={{ fontFamily: fInter, fontSize: mobile ? 24 : 28, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 10 }}>
          Live and interactive.
        </h2>
        <p style={{ fontFamily: fKarla, fontSize: 15, color: MUTED, lineHeight: 1.65, marginBottom: 28, maxWidth: 520 }}>
          Click Reply on any comment, like a few, collapse a thread. The real{' '}
          <code style={{ fontFamily: fMono, fontSize: 13 }}>{'<CommentThread />'}</code> — no mock.
        </p>

        <div style={{ border: BORDER, borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ background: SUBTLE, borderBottom: BORDER, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
            {['#ffbd44', '#ff605c', '#00ca4e'].map((c) => (
              <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />
            ))}
            <span style={{ fontFamily: fMono, fontSize: 11, color: MUTED, marginLeft: 8 }}>canopy · live</span>
          </div>
          <div style={{ padding: mobile ? 14 : 24, background: '#fff' }}>
            <CommentThread
              comments={playComments}
              onReply={handleReply}
              onLike={handleLike}
              height={mobile ? 400 : 500}
              style={{
                '--canopy-line-color': 'rgba(0,0,0,0.08)',
                '--canopy-input-bg': 'rgba(0,0,0,0.03)',
                '--canopy-input-border': 'rgba(0,0,0,0.1)',
                '--canopy-input-border-focus': 'rgba(0,0,0,0.3)',
                '--canopy-submit-bg': '#0a0a0a',
                '--canopy-submit-color': '#fff',
                '--canopy-meta-color': 'rgba(10,10,10,0.45)',
                '--canopy-action-color': 'rgba(10,10,10,0.4)',
                '--canopy-action-hover-color': '#0a0a0a',
                '--canopy-font-family': fKarla,
                '--canopy-indent-width': mobile ? '16px' : '24px',
              } as React.CSSProperties}
            />
          </div>
        </div>
      </section>

      <Divider />

      {/* ── DOCS ─────────────────────────────────────────────── */}
      <section id="docs" style={sectionStyle}>
        <h2 style={{ fontFamily: fInter, fontSize: mobile ? 24 : 28, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 10 }}>
          Full API.
        </h2>
        <p style={{ fontFamily: fKarla, fontSize: 15, color: MUTED, lineHeight: 1.65, marginBottom: 28, maxWidth: 520 }}>
          TypeScript-first throughout. Every prop and type documented below.
        </p>

        <TabBar
          tabs={[{ key: 'props', label: 'CommentThread props' }, { key: 'type', label: 'RawComment type' }]}
          active={docsTab}
          onSelect={(k) => setDocsTab(k as typeof docsTab)}
        />
        <div style={{ marginTop: 16 }}>
          <PropTable rows={docsTab === 'props' ? PROPS : RAW_COMMENT} mobile={mobile} />
        </div>

        <h3 style={{ fontFamily: fInter, fontSize: 16, fontWeight: 600, letterSpacing: '-0.03em', marginTop: 48, marginBottom: 14 }}>
          CSS custom properties
        </h3>
        {/* Scrollable on mobile */}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
          <div style={{ border: BORDER, borderRadius: 8, overflow: 'hidden', minWidth: 540 }}>
            {[
              ['--canopy-indent-width',       '24px',             'Width of each nesting level'],
              ['--canopy-avatar-size',         '32px',             'Avatar diameter'],
              ['--canopy-avatar-radius',       '50%',              'Avatar border radius'],
              ['--canopy-line-color',          'currentColor 15%', 'Thread connector line colour'],
              ['--canopy-line-width',          '2px',              'Thread connector line thickness'],
              ['--canopy-font-family',         'inherit',          'Inherits from your page by default'],
              ['--canopy-font-size',           '14px',             'Base font size for all comment text'],
              ['--canopy-liked-color',         '#e5484d',          'Heart icon colour when active'],
              ['--canopy-input-bg',            'currentColor 5%',  'Reply textarea background'],
              ['--canopy-input-border',        'currentColor 15%', 'Reply textarea border'],
              ['--canopy-input-border-focus',  'currentColor 40%', 'Reply textarea focus ring'],
              ['--canopy-submit-bg',           'currentColor 90%', 'Submit button background'],
              ['--canopy-submit-color',        'canvas',           'Submit button text colour'],
              ['--canopy-meta-color',          'currentColor 50%', 'Timestamps and muted labels'],
              ['--canopy-action-color',        'currentColor 45%', 'Action button default colour'],
              ['--canopy-row-gap',             '12px',             'Vertical gap between rows'],
            ].map(([name, def, desc], i, arr) => (
              <div key={name} style={{
                display: 'grid', gridTemplateColumns: '220px 110px 1fr',
                background: i % 2 === 0 ? '#fff' : SUBTLE,
                borderBottom: i < arr.length - 1 ? BORDER : 'none',
              }}>
                <div style={{ fontFamily: fMono, fontSize: 12, padding: '9px 14px', color: '#1a1a1a', borderRight: BORDER }}>{name}</div>
                <div style={{ fontFamily: fMono, fontSize: 12, padding: '9px 14px', color: MUTED, borderRight: BORDER }}>{def}</div>
                <div style={{ fontFamily: fKarla, fontSize: 12.5, padding: '9px 14px', color: MUTED, lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dock active={activeSection} mobile={mobile} />
    </div>
  );
}

// ─── primitives ───────────────────────────────────────────────────

function Divider() {
  return <div style={{ height: 1, background: '#ebebeb', maxWidth: 820, margin: '0 auto' }} />;
}

function TwoCol({ left, right, mobile }: { left: React.ReactNode; right: React.ReactNode; mobile: boolean }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
      gap: mobile ? 20 : 32,
      alignItems: 'start',
    }}>
      <div>{left}</div>
      <div style={{ paddingTop: mobile ? 0 : 4 }}>{right}</div>
    </div>
  );
}

function TabBar({ tabs, active, onSelect }: { tabs: { key: string; label: string }[]; active: string; onSelect: (k: string) => void }) {
  return (
    <div style={{ display: 'flex', borderBottom: BORDER, overflowX: 'auto' }}>
      {tabs.map(({ key, label }) => (
        <button key={key} onClick={() => onSelect(key)} style={{
          fontFamily: fKarla, fontSize: 13, fontWeight: active === key ? 600 : 400,
          padding: '8px 14px', background: 'none', border: 'none', whiteSpace: 'nowrap',
          borderBottom: active === key ? '2px solid #0a0a0a' : '2px solid transparent',
          cursor: 'pointer', color: active === key ? '#0a0a0a' : MUTED,
          marginBottom: -1, transition: 'color 120ms', flexShrink: 0,
        }}>
          {label}
        </button>
      ))}
    </div>
  );
}

function PropTable({ rows, mobile }: { rows: { name: string; type: string; req: boolean; desc: string }[]; mobile: boolean }) {
  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
      <div style={{ border: BORDER, borderRadius: 8, overflow: 'hidden', minWidth: mobile ? 520 : 'auto' }}>
        {/* header */}
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 50px', background: SUBTLE, borderBottom: BORDER }}>
          {['Prop', 'Type / description', 'Req'].map((h) => (
            <div key={h} style={{ fontFamily: fMono, fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#aaa', padding: '8px 12px' }}>{h}</div>
          ))}
        </div>
        {rows.map((row, i) => (
          <div key={row.name} style={{
            display: 'grid', gridTemplateColumns: '160px 1fr 50px',
            background: i % 2 === 0 ? '#fff' : SUBTLE,
            borderBottom: i < rows.length - 1 ? BORDER : 'none',
            alignItems: 'start',
          }}>
            <div style={{ fontFamily: fMono, fontSize: 12, padding: '10px 12px', color: '#1a1a1a', borderRight: BORDER }}>{row.name}</div>
            <div style={{ padding: '10px 12px', borderRight: BORDER }}>
              <div style={{ fontFamily: fMono, fontSize: 11, color: '#555', marginBottom: 3 }}>{row.type}</div>
              <div style={{ fontFamily: fKarla, fontSize: 12.5, color: MUTED, lineHeight: 1.55 }}>{row.desc}</div>
            </div>
            <div style={{ padding: '10px 12px', textAlign: 'center' }}>
              {row.req
                ? <span style={{ fontFamily: fMono, fontSize: 10, background: '#dbeafe', color: '#2563eb', borderRadius: 3, padding: '2px 5px', whiteSpace: 'nowrap' }}>yes</span>
                : <span style={{ fontFamily: fMono, fontSize: 10, color: '#ccc' }}>—</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dock({ active, mobile }: { active: string; mobile: boolean }) {
  const items = [
    { key: 'hero',       label: 'Home',       href: '#hero' },
    { key: 'how-to-use', label: 'How to use', href: '#how-to-use' },
    { key: 'playground', label: 'Playground',  href: '#playground' },
    { key: 'docs',       label: 'Docs',        href: '#docs' },
    { key: 'github',     label: 'GitHub',      href: 'https://github.com', target: '_blank' as const },
  ];
  // On mobile hide "How to use" label, shorten
  const visibleItems = mobile
    ? items.filter(i => i.key !== 'how-to-use').concat()
    : items;

  return (
    <nav style={{
      position: 'fixed', bottom: mobile ? 16 : 28,
      left: '50%', transform: 'translateX(-50%)',
      display: 'flex', alignItems: 'center', gap: 2,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      border: BORDER, borderRadius: 100,
      padding: mobile ? '5px 6px' : '6px 8px',
      zIndex: 100,
      maxWidth: 'calc(100vw - 32px)',
      overflowX: 'auto',
    }}>
      {visibleItems.map(({ key, label, href, target }) => {
        const isActive = active === key;
        return (
          <a key={key} href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} style={{
            fontFamily: fKarla, fontSize: mobile ? 12 : 13,
            fontWeight: isActive ? 600 : 400,
            padding: mobile ? '5px 10px' : '6px 14px',
            borderRadius: 100,
            background: isActive ? '#0a0a0a' : 'transparent',
            color: isActive ? '#fff' : MUTED,
            textDecoration: 'none', whiteSpace: 'nowrap',
            transition: 'background 150ms, color 150ms',
            flexShrink: 0,
          }}>
            {label}
          </a>
        );
      })}
    </nav>
  );
}
