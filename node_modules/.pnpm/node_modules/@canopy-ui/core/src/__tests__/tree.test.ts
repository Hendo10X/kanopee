import { describe, it, expect } from 'vitest';
import { buildTree } from '../tree.js';
import type { RawComment } from '../types.js';

// ── helpers ──────────────────────────────────────────────────────
const c = (
  partial: Partial<RawComment> & Pick<RawComment, 'id'>,
): RawComment => ({
  author: 'Test User',
  body: 'Test body',
  timestamp: '2024-01-01T00:00:00Z',
  ...partial,
});

// ── tests ─────────────────────────────────────────────────────────
describe('buildTree', () => {
  it('returns an empty array for empty input', () => {
    expect(buildTree([])).toEqual([]);
  });

  it('makes every comment a root when no parentIds are set', () => {
    const result = buildTree([c({ id: '1' }), c({ id: '2' })]);
    expect(result).toHaveLength(2);
    expect(result[0].children).toHaveLength(0);
    expect(result[1].children).toHaveLength(0);
  });

  it('nests a child under its parent', () => {
    const result = buildTree([
      c({ id: '1', parentId: null }),
      c({ id: '2', parentId: '1' }),
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
    expect(result[0].children).toHaveLength(1);
    expect(result[0].children[0].id).toBe('2');
  });

  it('promotes a comment with a non-existent parentId to root', () => {
    const result = buildTree([c({ id: '1', parentId: 'ghost' })]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('promotes a comment with undefined parentId to root', () => {
    const result = buildTree([c({ id: '1', parentId: undefined })]);
    expect(result).toHaveLength(1);
  });

  it('builds three levels of nesting', () => {
    const result = buildTree([
      c({ id: '1' }),
      c({ id: '2', parentId: '1' }),
      c({ id: '3', parentId: '2' }),
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].children[0].children[0].id).toBe('3');
  });

  it('preserves sibling order from the input array', () => {
    const result = buildTree([
      c({ id: 'root' }),
      c({ id: 'a', parentId: 'root' }),
      c({ id: 'b', parentId: 'root' }),
      c({ id: 'c', parentId: 'root' }),
    ]);
    expect(result[0].children.map((n) => n.id)).toEqual(['a', 'b', 'c']);
  });

  it('handles multiple independent roots each with children', () => {
    const result = buildTree([
      c({ id: 'r1' }),
      c({ id: 'r2' }),
      c({ id: 'c1', parentId: 'r1' }),
      c({ id: 'c2', parentId: 'r2' }),
    ]);
    expect(result).toHaveLength(2);
    expect(result[0].children[0].id).toBe('c1');
    expect(result[1].children[0].id).toBe('c2');
  });

  it('does not mutate the original comment objects', () => {
    const original = c({ id: '1' });
    buildTree([original]);
    expect((original as Record<string, unknown>).children).toBeUndefined();
  });

  it('copies all original fields onto the tree node', () => {
    const result = buildTree([c({ id: '1', author: 'Ada', body: 'Hello' })]);
    expect(result[0].author).toBe('Ada');
    expect(result[0].body).toBe('Hello');
  });

  it('handles a large flat list efficiently (smoke test)', () => {
    const N = 1000;
    const comments: RawComment[] = Array.from({ length: N }, (_, i) => ({
      id: String(i),
      parentId: i === 0 ? null : String(i - 1),
      author: 'User',
      body: 'Body',
      timestamp: '2024-01-01',
    }));
    const result = buildTree(comments);
    expect(result).toHaveLength(1);
  });
});
