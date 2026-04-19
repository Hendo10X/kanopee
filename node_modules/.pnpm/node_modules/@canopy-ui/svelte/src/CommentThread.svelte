<script lang="ts">
  import {
    buildTree,
    flattenTree,
    buildNodeMap,
    type RawComment,
    type CollapseState,
  } from '@kanopee/core';
  import CommentRow from './CommentRow.svelte';
  import './styles.css';

  // ── Props ───────────────────────────────────────────────────────
  export let comments: RawComment[] = [];
  export let indentWidth: number = 24;
  export let height: number | undefined = undefined;
  export let estimatedRowHeight: number = 80;
  export let emptyStateText: string = 'No comments yet. Be the first!';
  export let className: string = '';
  export let defaultCollapsed: string[] = [];

  /** Controlled collapse state. Supply onCollapse to update. */
  export let collapsed: string[] | undefined = undefined;

  export let onReply: ((parentId: string, body: string) => void | Promise<void>) | undefined = undefined;
  export let onLike: ((commentId: string, isLiked: boolean) => void) | undefined = undefined;
  export let onCollapse: ((commentId: string, collapsed: boolean) => void) | undefined = undefined;
  export let onScrollEnd: (() => void) | undefined = undefined;

  // ── Collapse state ───────────────────────────────────────────────
  let internalCollapsed: CollapseState = new Set(defaultCollapsed);

  $: isControlled = collapsed !== undefined;
  $: activeCollapsed = isControlled ? new Set(collapsed!) : internalCollapsed;

  function handleCollapse(commentId: string, shouldCollapse: boolean) {
    if (!isControlled) {
      const next = new Set(internalCollapsed);
      if (shouldCollapse) next.add(commentId);
      else next.delete(commentId);
      internalCollapsed = next;
    }
    onCollapse?.(commentId, shouldCollapse);
  }

  // ── Tree / flatten ───────────────────────────────────────────────
  $: forest = buildTree(comments);
  $: nodeMap = buildNodeMap(forest);
  $: flatItems = flattenTree(forest, activeCollapsed);

  // ── Simple scroll-window virtualizer ────────────────────────────
  const OVERSCAN = 5;

  let scrollEl: HTMLDivElement;
  let scrollTop = 0;
  let containerHeight = 0;

  $: startIdx = Math.max(0, Math.floor(scrollTop / estimatedRowHeight) - OVERSCAN);
  $: endIdx = Math.min(
    flatItems.length,
    Math.ceil((scrollTop + containerHeight) / estimatedRowHeight) + OVERSCAN,
  );
  $: visibleItems = flatItems.slice(startIdx, endIdx);
  $: paddingTop = startIdx * estimatedRowHeight;
  $: paddingBottom = Math.max(0, (flatItems.length - endIdx) * estimatedRowHeight);

  function handleScroll(e: Event) {
    const el = e.currentTarget as HTMLDivElement;
    scrollTop = el.scrollTop;
    containerHeight = el.clientHeight;
    if (onScrollEnd && el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      onScrollEnd();
    }
  }

  import { onMount } from 'svelte';

  onMount(() => {
    if (scrollEl) {
      containerHeight = scrollEl.clientHeight;
    }
  });
</script>

<div
  class="canopy-thread {className}"
  role="region"
  aria-label="Comments"
>
  {#if comments.length === 0}
    <div class="canopy-empty">{emptyStateText}</div>
  {:else}
    <div
      bind:this={scrollEl}
      class="canopy-scroll"
      style={height !== undefined ? `height: ${height}px` : undefined}
      on:scroll={handleScroll}
      tabindex="-1"
    >
      <div style="padding-top: {paddingTop}px; padding-bottom: {paddingBottom}px;">
        {#each visibleItems as item (item.comment.id)}
          <CommentRow
            {item}
            {indentWidth}
            {onReply}
            {onLike}
            onCollapse={handleCollapse}
          />
        {/each}
      </div>
    </div>
  {/if}
</div>
