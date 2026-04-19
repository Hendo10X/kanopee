import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  CSSProperties,
} from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  buildTree,
  flattenTree,
  buildNodeMap,
  type RawComment,
  type CollapseState,
} from '@kanopee/core';
import { CommentRow, type CommentRowCallbacks } from './CommentRow.js';
import './styles.css';

export interface CommentThreadProps extends CommentRowCallbacks {
  /** Flat array of comments. Only `id`, `parentId`, `author`, `body`, and `timestamp` are required. */
  comments: RawComment[];

  /**
   * Pixel width of each indent level.
   * @default 24
   */
  indentWidth?: number;

  /**
   * Fixed height of the scroll container in pixels.
   * If omitted the thread expands to its natural height (no virtualization scroll container).
   * @default undefined
   */
  height?: number;

  /**
   * Estimated row height used by the virtualizer for initial layout.
   * Rows are auto-measured; this only affects the initial scroll position estimate.
   * @default 80
   */
  estimatedRowHeight?: number;

  /**
   * Content rendered when `comments` is empty.
   */
  emptyState?: React.ReactNode;

  /**
   * Additional className applied to the root element.
   */
  className?: string;

  /**
   * Additional inline styles on the root element.
   * Use this to set CSS custom properties, e.g. `{ '--canopy-indent-width': '20px' }`.
   */
  style?: CSSProperties;

  /**
   * IDs of comments whose children should start collapsed.
   * Canopy manages collapse state internally; this is the initial value.
   */
  defaultCollapsed?: string[];

  /**
   * Override the full collapse state from outside (controlled mode).
   * You must also supply `onCollapse` to update it.
   */
  collapsed?: string[];

  /** Called when the user scrolls to the bottom (useful for pagination). */
  onScrollEnd?: () => void;
}

export function CommentThread({
  comments,
  indentWidth = 24,
  height,
  estimatedRowHeight = 80,
  emptyState,
  className,
  style,
  defaultCollapsed,
  collapsed: collapsedProp,
  onReply,
  onLike,
  onCollapse: onCollapseProp,
  onScrollEnd,
}: CommentThreadProps) {
  // ── Collapse state (uncontrolled or controlled) ──────────────
  const [internalCollapsed, setInternalCollapsed] = useState<CollapseState>(
    () => new Set(defaultCollapsed ?? []),
  );

  const isControlled = collapsedProp !== undefined;
  const collapsed: CollapseState = isControlled
    ? new Set(collapsedProp)
    : internalCollapsed;

  const handleCollapse = useCallback(
    (commentId: string, shouldCollapse: boolean) => {
      if (!isControlled) {
        setInternalCollapsed((prev) => {
          const next = new Set(prev);
          if (shouldCollapse) next.add(commentId);
          else next.delete(commentId);
          return next;
        });
      }
      onCollapseProp?.(commentId, shouldCollapse);
    },
    [isControlled, onCollapseProp],
  );

  // ── Build + flatten tree ──────────────────────────────────────
  const { forest, nodeMap } = useMemo(() => {
    const forest = buildTree(comments);
    const nodeMap = buildNodeMap(forest);
    return { forest, nodeMap };
  }, [comments]);

  const flatItems = useMemo(
    () => flattenTree(forest, collapsed),
    [forest, collapsed],
  );

  // ── Virtualizer ───────────────────────────────────────────────
  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: flatItems.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimatedRowHeight,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // ── Scroll-end detection ──────────────────────────────────────
  useEffect(() => {
    if (!onScrollEnd) return;
    const el = scrollRef.current;
    if (!el) return;

    function handleScroll() {
      if (!el) return;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
        onScrollEnd?.();
      }
    }

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [onScrollEnd]);

  // ── Empty state ───────────────────────────────────────────────
  if (comments.length === 0) {
    return (
      <div
        className={['canopy-thread', className].filter(Boolean).join(' ')}
        style={style}
        role="region"
        aria-label="Comments"
      >
        {emptyState ?? (
          <div className="canopy-empty">No comments yet. Be the first!</div>
        )}
      </div>
    );
  }

  const totalHeight = virtualizer.getTotalSize();

  return (
    <div
      className={['canopy-thread', className].filter(Boolean).join(' ')}
      style={style}
      role="region"
      aria-label="Comments"
    >
      <div
        ref={scrollRef}
        className="canopy-scroll"
        style={height !== undefined ? { height } : undefined}
        tabIndex={-1}
      >
        {/* Spacer that establishes total scroll height */}
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
            }}
          >
            {virtualItems.map((vItem) => {
              const item = flatItems[vItem.index];
              return (
                <div
                  key={item.comment.id}
                  data-index={vItem.index}
                  ref={virtualizer.measureElement}
                >
                  <CommentRow
                    item={item}
                    indentWidth={indentWidth}
                    onReply={onReply}
                    onLike={onLike}
                    onCollapse={handleCollapse}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
