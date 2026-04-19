<template>
  <div
    class="canopy-row"
    :style="{ paddingLeft: `${depth * indentWidth}px` }"
    :data-depth="depth"
    :data-comment-id="comment.id"
  >
    <div
      class="canopy-comment"
      :data-has-children="hasChildren ? '' : undefined"
      :data-collapsed="isCollapsed ? '' : undefined"
    >
      <!-- Avatar -->
      <div class="canopy-avatar" aria-hidden="true">
        <img v-if="comment.avatarUrl" :src="comment.avatarUrl" :alt="comment.author" loading="lazy" />
        <template v-else>{{ getInitials(comment.author) }}</template>
      </div>

      <!-- Content -->
      <div class="canopy-content">
        <div class="canopy-header">
          <span class="canopy-author">{{ comment.author }}</span>
          <time
            class="canopy-timestamp"
            :datetime="timestampIso"
            :title="new Date(comment.timestamp as string).toLocaleString()"
          >{{ formatTimestamp(comment.timestamp) }}</time>
        </div>

        <p class="canopy-body">{{ comment.body }}</p>

        <!-- Actions -->
        <div class="canopy-actions" role="group" aria-label="Comment actions">
          <button
            v-if="onLike"
            class="canopy-action canopy-action--like"
            :aria-pressed="comment.isLiked ?? false"
            :aria-label="comment.isLiked ? 'Unlike' : 'Like'"
            @click="handleLike"
          >
            <svg
              width="14" height="14" viewBox="0 0 24 24"
              :fill="comment.isLiked ? 'currentColor' : 'none'"
              stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span v-if="(comment.likeCount ?? 0) > 0">{{ comment.likeCount }}</span>
          </button>

          <button
            v-if="onReply"
            class="canopy-action canopy-action--reply"
            aria-label="Reply"
            @click="openReply"
          >
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

          <button
            v-if="hasChildren && onCollapse"
            class="canopy-action canopy-action--collapse"
            :aria-expanded="!isCollapsed"
            :aria-label="isCollapsed
              ? `Show ${childCount} ${childCount === 1 ? 'reply' : 'replies'}`
              : 'Collapse replies'"
            @click="handleCollapseToggle"
          >
            <svg v-if="isCollapsed" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
            <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="18 15 12 9 6 15" />
            </svg>
            <span v-if="isCollapsed" class="canopy-collapsed-hint">{{ childCount }} {{ childCount === 1 ? 'reply' : 'replies' }}</span>
            <span v-else>Collapse</span>
          </button>
        </div>

        <!-- Inline reply form -->
        <form
          v-if="replyOpen"
          class="canopy-reply-form"
          :aria-label="`Reply to ${comment.author}`"
          @submit.prevent="submitReply"
        >
          <textarea
            ref="textareaRef"
            class="canopy-reply-input"
            v-model="replyBody"
            :placeholder="`Reply to ${comment.author}… (⌘↵ to submit)`"
            :rows="3"
            :disabled="isSubmitting"
            @keydown="handleKeyDown"
          ></textarea>
          <div class="canopy-reply-actions">
            <button
              type="button"
              class="canopy-reply-cancel"
              :disabled="isSubmitting"
              @click="cancelReply"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="canopy-reply-submit"
              :disabled="!replyBody.trim() || isSubmitting"
            >
              {{ isSubmitting ? 'Posting…' : 'Reply' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import type { FlatItem, RawComment } from '@kanopee/core';
import { formatTimestamp, getInitials } from './utils.js';

const props = withDefaults(defineProps<{
  item: FlatItem;
  indentWidth?: number;
  onReply?: (parentId: string, body: string) => void | Promise<void>;
  onLike?: (commentId: string, isLiked: boolean) => void;
  onCollapse?: (commentId: string, collapsed: boolean) => void;
}>(), {
  indentWidth: 24,
});

const comment = computed(() => props.item.comment as RawComment);
const depth = computed(() => props.item.depth);
const hasChildren = computed(() => props.item.hasChildren);
const isCollapsed = computed(() => props.item.isCollapsed);
const childCount = computed(() => props.item.childCount);

const timestampIso = computed(() => {
  const ts = comment.value.timestamp;
  return ts instanceof Date ? ts.toISOString() : String(ts);
});

const replyOpen = ref(false);
const replyBody = ref('');
const isSubmitting = ref(false);
const textareaRef = ref<HTMLTextAreaElement>();

function handleLike() {
  props.onLike?.(comment.value.id, !comment.value.isLiked);
}

function handleCollapseToggle() {
  props.onCollapse?.(comment.value.id, !isCollapsed.value);
}

async function openReply() {
  replyOpen.value = true;
  await nextTick();
  textareaRef.value?.focus();
}

function cancelReply() {
  replyOpen.value = false;
  replyBody.value = '';
}

async function submitReply() {
  const trimmed = replyBody.value.trim();
  if (!trimmed || !props.onReply) return;
  isSubmitting.value = true;
  try {
    await props.onReply(comment.value.id, trimmed);
    replyBody.value = '';
    replyOpen.value = false;
  } finally {
    isSubmitting.value = false;
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
</script>
