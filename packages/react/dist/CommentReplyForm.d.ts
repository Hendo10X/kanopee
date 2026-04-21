export interface CommentReplyFormProps {
    /** Author name used in the placeholder text. */
    replyingTo: string;
    /** Called on submit. Awaited if it returns a Promise — button shows loading state. */
    onSubmit: (body: string) => void | Promise<void>;
    onCancel: () => void;
    className?: string;
}
export declare function CommentReplyForm({ replyingTo, onSubmit, onCancel, className, }: CommentReplyFormProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=CommentReplyForm.d.ts.map