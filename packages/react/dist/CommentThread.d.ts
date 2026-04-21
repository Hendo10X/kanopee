import React, { CSSProperties } from 'react';
import { type RawComment, type FlatItem } from '@kanopee/core';
import { type CommentRowCallbacks } from './CommentRow.js';
import './styles.css';
export interface CommentThreadProps extends CommentRowCallbacks {
    /**
     * Custom row renderer. When provided, called instead of the default `<CommentRow>` for every item.
     * Use this to compose your own row from Kanopee primitives.
     *
     * @example
     * renderItem={(item) => <MyCustomRow item={item} />}
     */
    renderItem?: (item: FlatItem) => React.ReactNode;
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
export declare function CommentThread({ comments, indentWidth, height, estimatedRowHeight, emptyState, className, style, defaultCollapsed, collapsed: collapsedProp, onReply, onLike, onCollapse: onCollapseProp, onScrollEnd, renderItem, }: CommentThreadProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CommentThread.d.ts.map