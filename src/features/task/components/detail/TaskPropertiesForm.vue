<script setup lang="ts">
import { computed } from 'vue';
import type { Column } from '@/features/board/types';
import { useBoardStore } from '@/features/board/stores/board.store';
import FieldSelect from '@/shared/components/FieldSelect.vue';
import { LABEL_OPTIONS, PRIORITY_OPTIONS } from '../../constants';
import type { TaskDraft } from '../../types';
import AssigneeField from './AssigneeField.vue';
import DueDateField from './DueDateField.vue';

const props = defineProps<{ columns: Column[] }>();
const draft = defineModel<TaskDraft>({ required: true });

const boards = useBoardStore();
const boardOptions = computed(() => boards.boards.map((b) => ({ value: b.id, text: b.name })));
const columnOptions = computed(() => props.columns.map((c) => ({ value: c.id, text: c.title })));

/* Selects emit `string | null`; required fields simply ignore a null. */
const boardId = computed<string | null>({
  get: () => draft.value.boardId,
  set: (v) => {
    if (v) draft.value.boardId = v;
  },
});
const columnId = computed<string | null>({
  get: () => draft.value.columnId,
  set: (v) => {
    if (v) draft.value.columnId = v;
  },
});
</script>

<template>
  <div class="grid">
    <div class="field">
      <span class="label">Assignee</span>
      <AssigneeField v-model="draft.assigneeIds" />
    </div>
    <div class="field">
      <span class="label">Due Date</span>
      <DueDateField v-model="draft.dueDate" />
    </div>
    <div class="field">
      <span class="label">Board</span>
      <FieldSelect v-model="boardId" :options="boardOptions" label="Board" />
    </div>
    <div class="field">
      <span class="label">Column</span>
      <FieldSelect v-model="columnId" :options="columnOptions" label="Column" />
    </div>
    <div class="field">
      <span class="label">Label</span>
      <FieldSelect v-model="draft.label" :options="LABEL_OPTIONS" label="Label" clearable />
    </div>
    <div class="field">
      <span class="label">Priority</span>
      <FieldSelect
        v-model="draft.priority"
        :options="PRIORITY_OPTIONS"
        label="Priority"
        clearable
      />
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 16px;
  row-gap: 16px;
}

.field {
  display: grid;
  align-content: start;
  gap: 8px;
}

.label {
  color: var(--c-text-body);
  font-size: var(--fs-lg);
  font-weight: 600;
}

@media (max-width: 479px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
