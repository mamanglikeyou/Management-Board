<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { useTaskStore } from '@/features/task/stores/task.store';
import type { Column } from '../types';

/** Mobile-only tab strip: shows which column is on screen and jumps to one on tap. */
const props = defineProps<{ columns: Column[]; activeIndex: number }>();
const emit = defineEmits<{ select: [index: number] }>();

const tasks = useTaskStore();
const strip = ref<HTMLElement>();

// Keep the active tab visible when the board is swiped.
watch(
  () => props.activeIndex,
  async (index) => {
    await nextTick();
    const tab = strip.value?.children[index] as HTMLElement | undefined;
    tab?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  },
);
</script>

<template>
  <nav ref="strip" class="tabs" aria-label="Columns">
    <button
      v-for="(column, index) in columns"
      :key="column.id"
      type="button"
      class="tab"
      :class="{ 'is-active': index === activeIndex }"
      :aria-current="index === activeIndex ? 'true' : undefined"
      @click="emit('select', index)"
    >
      {{ column.title }}
      <span class="count">{{ tasks.tasksInColumn(column.id).length }}</span>
    </button>
  </nav>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  overflow-x: auto;
  border-bottom: 1px solid var(--c-border-soft);
  background: var(--c-bg);
  scrollbar-width: none;
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border: 0;
  border-radius: var(--r-pill);
  background: var(--c-surface);
  color: var(--c-text-body);
  font-size: var(--fs-md);
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.tab.is-active {
  background: var(--c-primary);
  color: #fff;
  font-weight: 600;
}

.count {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: var(--r-pill);
  background: rgba(255, 255, 255, 0.7);
  color: var(--c-text-body);
  font-size: var(--fs-xs);
  font-weight: 600;
}

.tab.is-active .count {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}
</style>
