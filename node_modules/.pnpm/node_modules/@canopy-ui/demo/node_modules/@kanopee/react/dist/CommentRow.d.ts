import React from 'react';
import type { FlatItem } from '@kanopee/core';
export interface CommentRowCallbacks {
    onReply?: (parentId: string, body: string) => void;
    onLike?: (commentId: string, isLiked: boolean) => void;
    onCollapse?: (commentId: string, collapsed: boolean) => void;
}
interface CommentRowProps extends CommentRowCallbacks {
    item: FlatItem;
    indentWidth: number;
}
export declare const CommentRow: React.NamedExoticComponent<CommentRowProps>;
export {};
//# sourceMappingURL=CommentRow.d.ts.map