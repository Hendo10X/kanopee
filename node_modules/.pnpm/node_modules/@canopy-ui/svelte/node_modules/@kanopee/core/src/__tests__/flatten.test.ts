import { describe, it, expect } from 'vitest';
import { buildTree } from '../tree.js';
import {
  flattenTree,
  buildNodeMap,
  collapseSubtree,
  countVisibleDescendants,
} from '../flatten.js';
import type { RawComment } from '../types.js';

// ── helpers ──────────────────────────────────────────────────────
const c = (
  partial: Partial<RawComment> & Pick<RawComment, 'id'>,
): RawComment => ({
  author: 'Test',
  body: 'Body',
  timestamp: '2024-01-01T00:00:00Z',
  ...partial,
});

const tree = (comments: RawComment[]) => buildTree(comments);
const NONE = new Set<string>();

// ── flattenTree ───────────────────────────────────────────────────
describe('flattenTree', () => {
  it('returns an empty array for an empty forest', () => {
    expect(flattenTree([], NONE)).toEqual([]);
  });

  it('assigns depth 0 to root-level comments', () => {
    const items = flattenTree(tree([c({ id: '1' })]), NONE);
    expect(items[0].depth).toBe(0);
  });

  it('increments depth by one per nesting level', () => {
    const items = flattenTree(
      tree([
        c({ id: '1' }),
        c({ id: '2', parentId: '1' }),
        c({ id: '3', parentId: '2' }),
      ]),
      NONE,
    );
    expect(items.map((i) => i.depth)).toEqual([0, 1, 2]);
  });

  it('sets hasChildren=true only for nodes with children', () => {
    const items = flattenTree(
      tree([c({ id: '1' }), c({ id: '2', parentId: '1' })]),
      NONE,
    );
    expect(items[0].hasChildren).toBe(true);
    expect(items[1].hasChildren).toBe(false);
  });

  it('sets childCount to the number of direct children', () => {
    const items = flattenTree(
      tree([
        c({ id: '1' }),
        c({ id: '2', parentId: '1' }),
        c({ id: '3', parentId: '1' }),
      ]),
      NONE,
    );
    expect(items[0].childCount).toBe(2);
    expect(items[1].childCount).toBe(0);
  });

  it('uses depth-first ordering', () => {
    const items = flattenTree(
      tree([
        c({ id: 'r1' }),
        c({ id: 'r2' }),
        c({ id: 'c1', parentId: 'r1' }),
        c({ id: 'c2', parentId: 'r1' }),
      ]),
      NONE,
    );
    expect(items.map((i) => i.comment.id)).toEqual(['r1', 'c1', 'c2', 'r2']);
  });

  it('omits children of a collapsed node', () => {
    const items = flattenTree(
      tree([c({ id: '1' }), c({ id: '2', parentId: '1' })]),
      new Set(['1']),
    );
    expect(items).toHaveLength(1);
    expect(items[0].comment.id).toBe('1');
  });

  it('marks a collapsed node with isCollapsed=true', () => {
    const items = flattenTree(
      tree([c({ id: '1' }), c({ id: '2', parentId: '1' })]),
      new Set(['1']),
    );
    expect(items[0].isCollapsed).toBe(true);
  });

  it('still shows the collapsed node itself, just not its subtree', () => {
    const items = flattenTree(
      tree([
        c({ id: '1' }),
        c({ id: '2', parentId: '1' }),
        c({ id: '3', parentId: '2' }),
      ]),
      new Set(['1']),
    );
    expect(items).toHaveLength(1);
  });

  it('only collapses the specified subtree, siblings stay visible', () => {
    const items = flattenTree(
      tree([
        c({ id: 'r' }),
        c({ id: 'a', parentId: 'r' }),
        c({ id: 'b', parentId: 'r' }),
        c({ id: 'a1', parentId: 'a' }),
      ]),
      new Set(['a']),
    );
    // r, a (collapsed), b — a1 is hidden
    expect(items.map((i) => i.comment.id)).toEqual(['r', 'a', 'b']);
  });

  it('handles multiple independently collapsed subtrees', () => {
    const items = flattenTree(
      tree([
        c({ id: 'r1' }),
        c({ id: 'r2' }),
        c({ id: 'c1', parentId: 'r1' }),
        c({ id: 'c2', parentId: 'r2' }),
      ]),
      new Set(['r1', 'r2']),
    );
    expect(items).toHaveLength(2);
    expect(items[0].isCollapsed).toBe(true);
    expect(items[1].isCollapsed).toBe(true);
  });
});

// ── buildNodeMap ──────────────────────────────────────────────────
describe('buildNodeMap', () => {
  it('indexes all nodes in a flat tree', () => {
    const forest = tree([c({ id: '1' }), c({ id: '2' })]);
    const map = buildNodeMap(forest);
    expect(map.size).toBe(2);
    expect(map.has('1')).toBe(true);
    expect(map.has('2')).toBe(true);
  });

  it('indexes all descendants, not just roots', () => {
    const forest = tree([
      c({ id: '1' }),
      c({ id: '2', parentId: '1' }),
      c({ id: '3', parentId: '2' }),
    ]);
    const map = buildNodeMap(forest);
    expect(map.size).toBe(3);
    expect(map.has('3')).toBe(true);
  });
});

// ── collapseSubtree ───────────────────────────────────────────────
describe('collapseSubtree', () => {
  it('adds the target node to the collapsed set', () => {
    const forest = tree([c({ id: '1' })]);
    const map = buildNodeMap(forest);
    const result = collapseSubtree('1', map, NONE);
    expect(result.has('1')).toBe(true);
  });

  it('also adds all descendants', () => {
    const forest = tree([
      c({ id: '1' }),
      c({ id: '2', parentId: '1' }),
      c({ id: '3', parentId: '2' }),
    ]);
    const map = buildNodeMap(forest);
    const result = collapseSubtree('1', map, NONE);
    expect(result.has('1')).toBe(true);
    expect(result.has('2')).toBe(true);
    expect(result.has('3')).toBe(true);
  });

  it('does not mutate the original collapsed set', () => {
    const forest = tree([c({ id: '1' })]);
    const map = buildNodeMap(forest);
    const original = new Set<string>();
    collapseSubtree('1', map, original);
    expect(original.size).toBe(0);
  });

  it('preserves pre-existing entries in the collapsed set', () => {
    const forest = tree([c({ id: '1' }), c({ id: '2' })]);
    const map = buildNodeMap(forest);
    const result = collapseSubtree('2', map, new Set(['1']));
    expect(result.has('1')).toBe(true);
    expect(result.has('2')).toBe(true);
  });
});

// ── countVisibleDescendants ───────────────────────────────────────
describe('countVisibleDescendants', () => {
  it('counts all direct children when nothing is collapsed', () => {
    const forest = tree([
      c({ id: '1' }),
      c({ id: '2', parentId: '1' }),
      c({ id: '3', parentId: '1' }),
    ]);
    const map = buildNodeMap(forest);
    expect(countVisibleDescendants('1', map, NONE)).toBe(2);
  });

  it('counts recursive descendants when nothing is collapsed', () => {
    const forest = tree([
      c({ id: '1' }),
      c({ id: '2', parentId: '1' }),
      c({ id: '3', parentId: '2' }),
    ]);
    const map = buildNodeMap(forest);
    expect(countVisibleDescendants('1', map, NONE)).toBe(2);
  });

  it('returns 0 when the node itself is collapsed', () => {
    const forest = tree([
      c({ id: '1' }),
      c({ id: '2', parentId: '1' }),
    ]);
    const map = buildNodeMap(forest);
    expect(countVisibleDescendants('1', map, new Set(['1']))).toBe(0);
  });

  it('stops counting at a collapsed intermediate node', () => {
    const forest = tree([
      c({ id: '1' }),
      c({ id: '2', parentId: '1' }),
      c({ id: '3', parentId: '2' }),
    ]);
    const map = buildNodeMap(forest);
    // Node 2 is collapsed, so 3 is hidden — only 1 visible descendant
    expect(countVisibleDescendants('1', map, new Set(['2']))).toBe(1);
  });

  it('returns 0 for a leaf node', () => {
    const forest = tree([c({ id: '1' })]);
    const map = buildNodeMap(forest);
    expect(countVisibleDescendants('1', map, NONE)).toBe(0);
  });
});
