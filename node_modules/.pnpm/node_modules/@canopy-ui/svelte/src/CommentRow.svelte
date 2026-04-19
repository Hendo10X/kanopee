<script lang="ts">
  import type { FlatItem } from '@kanopee/core';
  import { formatTimestamp, getInitials } from './utils.js';

  export let item: FlatItem;
  export let indentWidth: number = 24;
  export let onReply: ((parentId: string, body: string) => void | Promise<void>) | undefined = undefined;
  export let onLike: ((commentId: string, isLiked: boolean) => void) | undefined = undefined;
  export let onCollapse: ((commentId: string, collapsed: boolean) => void) | undefined = undefined;

  $: ({ comment, depth, hasChildren, isCollapsed, childCount } = item);

  let replyOpen = false;
  let replyBody = '';
  let isSubmitting = false;

  function handleLike() {
    onLike?.(comment.id, !comment.isLiked);
  }

  function handleCollapseToggle() {
    onCollapse?.(comment.id, !isCollapsed);
  }

  function openReply() {
    replyOpen = true;
  }

  function cancelReply() {
    replyOpen = false;
    replyBody = '';
  }

  async function submitReply() {
    const trimmed = replyBody.trim();
    if (!trimmed || !onReply) return;
    isSubmitting = true;
    try {
      await onReply(comment.id, trimmed);
      replyBody = '';
      replyOpen = false;
    } finally {
      isSubmitting = false;
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      submitReply();
    }
    if (e.key === 'Escape') {
      cancelReply();
    }
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    submitReply();
  }
</script>

<div
  class="canopy-row"
  style="padding-left: {depth * indentWidth}px"
  data-depth={depth}
  data-comment-id={comment.id}
>
  <div
    class="canopy-comment"
    data-has-children={hasChildren ? '' : undefined}
    data-collapsed={isCollapsed ? '' : undefined}
  >
    <!-- Avatar -->
    <div class="canopy-avatar" aria-hidden="true">
      {#if comment.avatarUrl}
        <img src={comment.avatarUrl} alt={comment.author} loading="lazy" />
      {:else}
        {getInitials(comment.author)}
      {/if}
    </div>

    <!-- Content -->
    <div class="canopy-content">
      <div class="canopy-header">
        <span class="canopy-author">{comment.author}</span>
        <time
          class="canopy-timestamp"
          datetime={comment.timestamp instanceof Date
            ? comment.timestamp.toISOString()
            : String(comment.timestamp)}
          title={new Date(comment.timestamp).toLocaleString()}
        >
          {formatTimestamp(comment.timestamp)}
        </time>
      </div>

      <p class="canopy-body">{comment.body}</p>

      <!-- Actions -->
      <div class="canopy-actions" role="group" aria-label="Comment actions">
        {#if onLike}
          <button
            class="canopy-action canopy-action--like"
            on:click={handleLike}
            aria-pressed={comment.isLiked ?? false}
            aria-label={comment.isLiked ? 'Unlike' : 'Like'}
          >
            <svg
              width="14" height="14" viewBox="0 0 24 24"
              fill={comment.isLiked ? 'currentColor' : 'none'}
              stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {#if (comment.likeCount ?? 0) > 0}
              <span>{comment.likeCount}</span>
            {/if}
          </button>
        {/if}

        {#if onReply}
          <button class="canopy-action canopy-action--reply" on:click={openReply} aria-label="Reply">
            <svg
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 17 4 12 9 7" />
              <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
            </svg>
            Reply
          </button>
        {/if}

        {#if hasChildren && onCollapse}
          <button
            class="canopy-action canopy-action--collapse"
            on:click={handleCollapseToggle}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed
              ? `Show ${childCount} ${childCount === 1 ? 'reply' : 'replies'}`
              : 'Collapse replies'}
          >
            {#if isCollapsed}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              <span class="canopy-collapsed-hint">{childCount} {childCount === 1 ? 'reply' : 'replies'}</span>
            {:else}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="18 15 12 9 6 15" />
              </svg>
              <span>Collapse</span>
            {/if}
          </button>
        {/if}
      </div>

      <!-- Inline reply form -->
      {#if replyOpen}
        <form class="canopy-reply-form" on:submit={handleSubmit} aria-label="Reply to {comment.author}">
          <textarea
            class="canopy-reply-input"
            bind:value={replyBody}
            on:keydown={handleKeyDown}
            placeholder="Reply to {comment.author}… (⌘↵ to submit)"
            rows={3}
            disabled={isSubmitting}
          ></textarea>
          <div class="canopy-reply-actions">
            <button
              type="button"
              class="canopy-reply-cancel"
              on:click={cancelReply}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              class="canopy-reply-submit"
              disabled={!replyBody.trim() || isSubmitting}
            >
              {isSubmitting ? 'Posting…' : 'Reply'}
            </button>
          </div>
        </form>
      {/if}
    </div>
  </div>
</div>
