import { CSSProperties } from 'react';
export interface CommentAvatarProps {
    /** Author display name — used for initials fallback. */
    author: string;
    /** Optional avatar image URL. */
    avatarUrl?: string;
    className?: string;
    style?: CSSProperties;
}
export declare function CommentAvatar({ author, avatarUrl, className, style }: CommentAvatarProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CommentAvatar.d.ts.map