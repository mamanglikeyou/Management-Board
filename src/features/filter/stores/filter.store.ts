import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useMemberStore } from '@/features/members/stores/member.store';
import type { Task } from '@/features/task/types';
import { createEmptyFilter, type TaskFilter } from '../types';
import { countActiveFilters, matchTask } from '../utils/matchTask';

export const useFilterStore = defineStore('filter', () => {
  const filter = ref<TaskFilter>(createEmptyFilter());
  const members = useMemberStore();

  const activeCount = computed(() => countActiveFilters(filter.value));
  const isFiltering = computed(() => activeCount.value > 0 || filter.value.query.trim() !== '');

  function matches(task: Task): boolean {
    return matchTask(task, filter.value, { memberName: (id) => members.byId(id)?.name });
  }

  function setQuery(query: string) {
    filter.value.query = query;
  }

  function toggleAssignee(id: string) {
    const list = filter.value.assigneeIds;
    filter.value.assigneeIds = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  }

  function toggleLabel(label: TaskFilter['labels'][number]) {
    const list = filter.value.labels;
    filter.value.labels = list.includes(label) ? list.filter((x) => x !== label) : [...list, label];
  }

  function setDue(due: TaskFilter['due'], dueDate: string | null = null) {
    filter.value.due = due;
    filter.value.dueDate = due === 'date' ? dueDate : null;
  }

  function clearFilters() {
    filter.value = { ...createEmptyFilter(), query: filter.value.query };
  }

  return {
    filter,
    activeCount,
    isFiltering,
    matches,
    setQuery,
    toggleAssignee,
    toggleLabel,
    setDue,
    clearFilters,
  };
});
