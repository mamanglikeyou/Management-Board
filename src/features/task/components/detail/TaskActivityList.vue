<script setup lang="ts">
import { computed } from 'vue';
import { timeAgo } from '@/core/utils/date';
import type { ActivityEntry } from '../../types';

const props = defineProps<{ entries: ActivityEntry[] }>();
const visible = computed(() => props.entries.slice(0, 20));
</script>

<template>
  <ol v-if="visible.length" class="timeline">
    <li v-for="entry in visible" :key="entry.id">
      <span class="dot" aria-hidden="true" />
      <p>
        <strong>You</strong> {{ entry.message }}
        <time :datetime="new Date(entry.createdAt).toISOString()">{{
          timeAgo(entry.createdAt)
        }}</time>
      </p>
    </li>
  </ol>
  <p v-else class="empty">Changes to this task will appear here.</p>
</template>

<style scoped>
.timeline {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  position: relative;
  display: flex;
  gap: 12px;
}

li:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 14px;
  bottom: -14px;
  left: 4px;
  width: 1px;
  background: var(--c-border);
}

.dot {
  flex: none;
  width: 9px;
  height: 9px;
  margin-top: 6px;
  border-radius: 50%;
  background: var(--c-primary-soft);
  box-shadow: 0 0 0 1.5px var(--c-primary) inset;
}

p {
  margin: 0;
  color: var(--c-text-body);
  font-size: var(--fs-md);
  line-height: 1.5;
}

strong {
  color: var(--c-text);
  font-weight: 600;
}

time {
  margin-left: 6px;
  color: var(--c-text-subtle);
  font-size: var(--fs-sm);
}

.empty {
  color: var(--c-text-subtle);
}
</style>
