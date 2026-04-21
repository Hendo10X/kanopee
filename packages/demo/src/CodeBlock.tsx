import { useState } from 'react';

// ── lightweight syntax tokeniser ──────────────────────────────────
type TT = 'kw' | 'str' | 'cmt' | 'num' | 'type' | 'fn' | 'plain';

const KW = new Set([
  'import','export','from','default','as','const','let','var','function',
  'return','if','else','for','while','do','switch','case','break','continue',
  'class','extends','new','this','super','typeof','instanceof','void','delete',
  'null','undefined','true','false','type','interface','enum','namespace',
  'async','await','try','catch','finally','throw','in','of','static',
  'public','private','protected','readonly','abstract','declare',
]);

const COL: Record<TT, string> = {
  kw:    '#ff7b72', // red    — keywords
  str:   '#a5d6ff', // blue   — strings
  cmt:   '#8b949e', // gray   — comments
  num:   '#79c0ff', // blue   — numbers
  type:  '#ffa657', // orange — PascalCase / components
  fn:    '#d2a8ff', // purple — function calls
  plain: '#e6edf3', // white  — default
};

function tokenize(src: string): { t: TT; v: string }[] {
  const out: { t: TT; v: string }[] = [];
  let i = 0;
  const N = src.length;

  const plain = (ch: string) => {
    const last = out[out.length - 1];
    if (last?.t === 'plain') last.v += ch;
    else out.push({ t: 'plain', v: ch });
  };

  while (i < N) {
    const c = src[i];

    // line comment
    if (c === '/' && src[i + 1] === '/') {
      let j = i;
      while (j < N && src[j] !== '\n') j++;
      out.push({ t: 'cmt', v: src.slice(i, j) });
      i = j; continue;
    }
    // block comment
    if (c === '/' && src[i + 1] === '*') {
      let j = i + 2;
      while (j < N - 1 && !(src[j] === '*' && src[j + 1] === '/')) j++;
      out.push({ t: 'cmt', v: src.slice(i, Math.min(j + 2, N)) });
      i = Math.min(j + 2, N); continue;
    }
    // template literal
    if (c === '`') {
      let j = i + 1;
      while (j < N && src[j] !== '`') { if (src[j] === '\\') j++; j++; }
      out.push({ t: 'str', v: src.slice(i, Math.min(j + 1, N)) });
      i = Math.min(j + 1, N); continue;
    }
    // quoted string
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < N && src[j] !== c && src[j] !== '\n') { if (src[j] === '\\') j++; j++; }
      out.push({ t: 'str', v: src.slice(i, Math.min(j + 1, N)) });
      i = Math.min(j + 1, N); continue;
    }
    // number
    if (/\d/.test(c) && (i === 0 || /[^\w$]/.test(src[i - 1]))) {
      let j = i;
      while (j < N && /[\d._xXa-fA-F]/.test(src[j])) j++;
      out.push({ t: 'num', v: src.slice(i, j) });
      i = j; continue;
    }
    // word
    if (/[a-zA-Z_$]/.test(c)) {
      let j = i;
      while (j < N && /[\w$]/.test(src[j])) j++;
      const w = src.slice(i, j);
      const t: TT = KW.has(w) ? 'kw'
        : /^[A-Z]/.test(w) ? 'type'
        : (j < N && src[j] === '(') ? 'fn'
        : 'plain';
      out.push({ t, v: w });
      i = j; continue;
    }
    plain(c); i++;
  }
  return out;
}

// ── component ─────────────────────────────────────────────────────
interface CodeBlockProps {
  code: string;
  lang?: string;
  copyable?: boolean;
}

export function CodeBlock({ code, copyable = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const tokens = tokenize(code.trim());

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      <pre style={{
        fontFamily: "'Geist Mono', monospace",
        fontSize: 13,
        lineHeight: 1.75,
        background: '#0d1117',
        border: '1px solid #30363d',
        borderRadius: 8,
        padding: '16px 48px 16px 18px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        whiteSpace: 'pre',
        margin: 0,
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <code>
          {tokens.map((tok, i) => (
            <span key={i} style={{ color: COL[tok.t] }}>{tok.v}</span>
          ))}
        </code>
      </pre>
      {copyable && (
        <button
          onClick={copy}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            fontFamily: "'Geist Mono', monospace",
            fontSize: 11,
            padding: '3px 8px',
            background: '#161b22',
            border: '1px solid #30363d',
            borderRadius: 4,
            cursor: 'pointer',
            color: copied ? '#3fb950' : '#8b949e',
            letterSpacing: '0.02em',
            transition: 'color 150ms',
          }}
        >
          {copied ? 'copied' : 'copy'}
        </button>
      )}
    </div>
  );
}
