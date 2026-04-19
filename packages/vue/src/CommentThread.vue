<template>
  <div class="canopy-thread" :class="className" role="region" aria-label="Comments">
    <div v-if="comments.length === 0" class="canopy-empty">
      {{ emptyStateText }}
    </div>
    <div
      v-else
      ref="scrollEl"
      class="canopy-scroll"
      :style="height !== undefined ? { height: `${height}px` } : undefined"
      tabindex="-1"
      @scroll="handleScroll"
    >
      <div :style="{ paddingTop: `${paddingTop}px`, paddingBottom: `${paddingBottom}px` }">
        <CommentRow
          v-for="item in visibleItems"
          :key="item.comment.id"
          :item="item"
          :indent-width="indentWidth"
          :on-reply="onReply"
          :on-like="onLike"
          :on-collapse="handleCollapse"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  buildTree,
  flattenTree,
  buildNodeMap,
  type RawComment,
  type CollapseState,
} from '@kanopee/core';
import CommentRow from './CommentRow.vue';
import './styles.css';

const props = withDefaults(defineProps<{
  comments: RawComment[];
  indentWidth?: number;
  height?: number;
  estimatedRowHeight?: number;
  emptyStateText?: string;
  className?: string;
  defaultCollapsed?: string[];
  /** Controlled collapse state */
  collapsed?: string[];
  onReply?: (parentId: string, body: string) => void | Promise<void>;
  onLike?: (commentId: string, isLiked: boolean) => void;
  onCollapse?: (commentId: string, collapsed: boolean) => void;
  onScrollEnd?: () => void;
}>(), {
  indentWidth: 24,
  estimatedRowHeight: 80,
  emptyStateText: 'No comments yet. Be the first!',
  className: '',
  defaultCollapsed: () => [],
});

// ── Collapse state ────────────────────────────────────────────────
const internalCollapsed = ref<CollapseState>(new Set(props.defaultCollapsed));

const isControlled = computed(() => props.collapsed !== undefined);
const activeCollapsed = computed<CollapseState>(() =>
  isControlled.value ? new Set(props.collapsed!) : internalCollapsed.value,
);

function handleCollapse(commentId: string, shouldCollapse: boolean) {
  if (!isControlled.value) {
    const next = new Set(internalCollapsed.value);
    if (shouldCollapse) next.add(commentId);
    else next.delete(commentId);
    internalCollapsed.value = next;
  }
  props.onCollapse?.(commentId, shouldCollapse);
}

// ── Tree / flatten ────────────────────────────────────────────────
const forest = computed(() => buildTree(props.comments));
const flatItems = computed(() => flattenTree(forest.value, activeCollapsed.value));

// ── Simple scroll-window virtualizer ─────────────────────────────
const OVERSCAN = 5;

const scrollEl = ref<HTMLDivElement>();
const scrollTop = ref(0);
const containerHeight = ref(0);

const startIdx = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / props.estimatedRowHeight!) - OVERSCAN),
);
const endIdx = computed(() =>
  Math.min(
    flatItems.value.length,
    Math.ceil((scrollTop.value + containerHeight.value) / props.estimatedRowHeight!) + OVERSCAN,
  ),
);
const visibleItems = computed(() => flatItems.value.slice(startIdx.value, endIdx.value));
const paddingTop = computed(() => startIdx.value * props.estimatedRowHeight!);
const paddingBottom = computed(() =>
  Math.max(0, (flatItems.value.length - endIdx.value) * props.estimatedRowHeight!),
);

function handleScroll(e: Event) {
  const el = e.currentTarget as HTMLDivElement;
  scrollTop.value = el.scrollTop;
  containerHeight.value = el.clientHeight;
  if (props.onScrollEnd && el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
    props.onScrollEnd();
  }
}

onMounted(() => {
  if (scrollEl.value) {
    containerHeight.value = scrollEl.value.clientHeight;
  }
});
</script>
