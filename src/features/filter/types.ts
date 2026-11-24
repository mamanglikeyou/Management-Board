import type { TaskLabel } from '@/features/task/types';

export type DueFilter = 'any' | 'overdue' | 'today' | 'week' | 'none' | 'date';

export interface TaskFilter {
  query: string;
  assigneeIds: string[];
  labels: TaskLabel[];
  due: DueFilter;
  /** Used when `due === 'date'`. */
  dueDate: string | null;
}

export const DUE_FILTER_OPTIONS: { value: DueFilter; text: string }[] = [
  { value: 'any', text: 'Any time' },
  { value: 'overdue', text: 'Overdue' },
  { value: 'today', text: 'Due today' },
  { value: 'week', text: 'Next 7 days' },
  { value: 'none', text: 'No due date' },
  { value: 'date', text: 'Specific date' },
];

export const createEmptyFilter = (): TaskFilter => ({
  query: '',
  assigneeIds: [],
  labels: [],
  due: 'any',
  dueDate: null,
});
