export interface CommentActionsProps {
    commentId: string;
    isLiked?: boolean;
    likeCount?: number;
    /** True if this comment has at least one direct reply. */
    hasChildren?: boolean;
    isCollapsed?: boolean;
    childCount?: number;
    onLike?: (id: string, isLiked: boolean) => void;
    /** Called when the Reply button is clicked. Open your own reply form in response. */
    onReplyClick?: () => void;
    onCollapse?: (id: string, collapsed: boolean) => void;
    className?: string;
}
export declare function CommentActions({ commentId, isLiked, likeCount, hasChildren, isCollapsed, childCount, onLike, onReplyClick, onCollapse, className, }: CommentActionsProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CommentActions.d.ts.map