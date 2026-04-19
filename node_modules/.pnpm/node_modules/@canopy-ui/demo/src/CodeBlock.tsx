import { useState } from 'react';

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

  return (
    <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
      <pre style={{
        fontFamily: "'Geist Mono', monospace",
        fontSize: 13,
        lineHeight: 1.7,
        background: '#f7f7f7',
        border: '1px solid #e8e8e8',
        borderRadius: 8,
        padding: '16px 20px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        color: '#1a1a1a',
        whiteSpace: 'pre',
        margin: 0,
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <code>{code.trim()}</code>
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
            background: '#fff',
            border: '1px solid #e8e8e8',
            borderRadius: 4,
            cursor: 'pointer',
            color: copied ? '#16a34a' : '#888',
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
