<script setup lang="ts">
import { computed, ref } from 'vue';
import Draggable from 'vuedraggable';
import { useFilterStore } from '@/features/filter/stores/filter.store';
import TaskCard from '@/features/task/components/TaskCard.vue';
import { useTaskModal } from '@/features/task/composables/useTaskModal';
import { useTaskStore } from '@/features/task/stores/task.store';
import type { Task } from '@/features/task/types';
import ActionMenu, { type ActionMenuItem } from '@/shared/components/ActionMenu.vue';
import IconButton from '@/shared/components/IconButton.vue';
import InlineInput from '@/shared/components/InlineInput.vue';
import { addIcon, collapseIcon, editIcon, expandIcon, moreIcon, trashIcon } from '@/shared/icons';
import { useBoardActions } from '../composables/useBoardActions';
import { useBoardStore } from '../stores/board.store';
import type { Column } from '../types';

const props = defineProps<{ column: Column }>();

const tasks = useTaskStore();
const boards = useBoardStore();
const filters = useFilterStore();
const { openTask, openCreate } = useTaskModal();
const { deleteColumn } = useBoardActions();

const renaming = ref(false);
const menuId = computed(() => `column-menu-${props.column.id}`);

const allTasks = computed(() => tasks.tasksInColumn(props.column.id));
const visibleTasks = computed(() => allTasks.value.filter((t) => filters.matches(t)));
const hiddenCount = computed(() => allTasks.value.length - visibleTasks.value.length);

const menuItems: ActionMenuItem[] = [
  { key: 'add', text: 'Add task', icon: addIcon },
  { key: 'rename', text: 'Rename list', icon: editIcon },
  { key: 'delete', text: 'Delete list', icon: trashIcon, danger: true },
];

function onMenu(key: string) {
  if (key === 'add') openCreate(props.column.id);
  if (key === 'rename') renaming.value = true;
  if (key === 'delete') deleteColumn(props.column.id);
}

function rename(title: string) {
  boards.renameColumn(props.column.id, title);
  renaming.value = false;
}

interface DragChange {
  added?: { element: Task; newIndex: number };
  moved?: { element: Task; newIndex: number };
}

/**
 * vuedraggable reports indexes relative to the *visible* (possibly filtered) list.
 * We translate that into "place before task X", which stays correct with filters on.
 */
function onDragChange(change: DragChange) {
  const event = change.added ?? change.moved;
  if (!event) return;
  const siblings = visibleTasks.value.filter((t) => t.id !== event.element.id);
  const before = siblings[event.newIndex]?.id ?? null;
  tasks.moveTask(event.element.id, props.column.id, before);
}

/** Small haptic tick on phones so the user feels the card being picked up. */
function onDragStart() {
  if (window.matchMedia('(pointer: coarse)').matches) navigator.vibrate?.(12);
}
</script>

<template>
  <section v-if="column.collapsed" class="column is-collapsed" :aria-label="column.title" data-page>
    <IconButton :icon="expandIcon" label="Expand list" @click="boards.toggleCollapse(column.id)" />
    <h2 class="collapsed-title">{{ column.title }}</h2>
    <span class="count">{{ allTasks.length }}</span>
  </section>

  <section v-else class="column" :aria-label="column.title" data-page>
    <header class="column-header">
      <InlineInput
        v-if="renaming"
        :initial="column.title"
        label="List name"
        @commit="rename"
        @cancel="renaming = false"
      />
      <template v-else>
        <h2 class="title" @dblclick="renaming = true">{{ column.title }}</h2>
        <IconButton
          :icon="addIcon"
          label="Add task"
          variant="primary-soft"
          :size="29"
          @click="openCreate(column.id)"
        />
        <IconButton :id="menuId" :icon="moreIcon" label="List actions" :size="29" />
        <ActionMenu :trigger="menuId" :items="menuItems" @select="onMenu" />
        <IconButton
          class="collapse"
          :icon="collapseIcon"
          label="Collapse list"
          :size="29"
          @click="boards.toggleCollapse(column.id)"
        />
      </template>
    </header>

    <Draggable
      :model-value="visibleTasks"
      item-key="id"
      group="tasks"
      class="card-list"
      ghost-class="card-ghost"
      chosen-class="card-chosen"
      drag-class="card-drag"
      :animation="180"
      :delay="300"
      :delay-on-touch-only="true"
      :touch-start-threshold="6"
      :force-fallback="true"
      :fallback-tolerance="4"
      :scroll-sensitivity="80"
      @start="onDragStart"
      @change="onDragChange"
    >
      <template #item="{ element }">
        <TaskCard :task="element" @open="openTask(element.id)" />
      </template>
      <template #footer>
        <p v-if="filters.isFiltering && hiddenCount > 0" class="hint">
          {{ hiddenCount }} task{{ hiddenCount > 1 ? 's' : '' }} hidden by filters
        </p>
      </template>
    </Draggable>
  </section>
</template>

<style scoped>
.column {
  display: flex;
  flex-direction: column;
  flex: none;
  width: var(--column-w);
  max-height: 100%;
  min-height: 0;
}

.column-header {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 40px;
  margin-bottom: 20px;
  padding: 0 22px 0 16px;
}

.title {
  margin: 0 2px 0 0;
  font-size: var(--fs-2xl);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--c-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: text;
}

.collapse {
  margin-left: auto;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex: 1;
  min-height: 120px;
  padding: 0 0 24px;
  overflow-y: auto;
  /* Only contain vertical overscroll so horizontal swipes still reach the board. */
  overscroll-behavior-y: contain;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.card-list:hover {
  scrollbar-color: var(--c-border) transparent;
}

.hint {
  margin: 0;
  padding: 10px;
  border: 1px dashed var(--c-border);
  border-radius: var(--r-md);
  color: var(--c-text-subtle);
  font-size: var(--fs-sm);
  text-align: center;
}

/* ---- collapsed state ---- */
.is-collapsed {
  align-items: center;
  gap: 14px;
  width: 52px;
  padding: 6px 0 16px;
  border-radius: var(--r-lg);
  background: var(--c-surface);
  align-self: flex-start;
  animation: fade-in 0.2s var(--ease);
}

.collapsed-title {
  margin: 0;
  writing-mode: vertical-rl;
  font-size: var(--fs-xl);
  font-weight: 700;
  color: var(--c-text);
}

.count {
  display: grid;
  place-items: center;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  border-radius: var(--r-pill);
  background: var(--c-primary-soft);
  color: var(--c-primary-ink);
  font-size: var(--fs-sm);
  font-weight: 600;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
}
</style>
