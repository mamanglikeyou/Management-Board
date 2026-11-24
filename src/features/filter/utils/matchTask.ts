import { diffInDays } from '@/core/utils/date';
import { labelText } from '@/features/task/constants';
import type { Task } from '@/features/task/types';
import type { TaskFilter } from '../types';

export interface MatchContext {
  memberName: (id: string) => string | undefined;
  today?: Date;
}

function matchesQuery(task: Task, query: string, ctx: MatchContext): boolean {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  const haystack = [
    task.title,
    task.description,
    task.label ? labelText(task.label) : '',
    ...task.assigneeIds.map((id) => ctx.memberName(id) ?? ''),
    ...task.subtasks.map((s) => s.title),
  ]
    .join(' ')
    .toLowerCase();

  return terms.every((term) => haystack.includes(term));
}

function matchesDue(task: Task, filter: TaskFilter, today?: Date): boolean {
  switch (filter.due) {
    case 'any':
      return true;
    case 'none':
      return task.dueDate === null;
    case 'date':
      return filter.dueDate === null || task.dueDate === filter.dueDate;
  }
  if (task.dueDate === null) return false;
  const days = diffInDays(task.dueDate, today);
  if (filter.due === 'overdue') return days < 0 && !task.completed;
  if (filter.due === 'today') return days === 0;
  return days >= 0 && days <= 7; // 'week'
}

/** Pure predicate — the single source of truth for search + filtering. */
export function matchTask(task: Task, filter: TaskFilter, ctx: MatchContext): boolean {
  if (
    filter.assigneeIds.length > 0 &&
    !task.assigneeIds.some((id) => filter.assigneeIds.includes(id))
  ) {
    return false;
  }
  if (filter.labels.length > 0 && !filter.labels.includes(task.label ?? 'undefined')) {
    return false;
  }
  return matchesDue(task, filter, ctx.today) && matchesQuery(task, filter.query, ctx);
}

/** Number of active (non-search) filter groups — shown as a badge on the Filter button. */
export function countActiveFilters(filter: TaskFilter): number {
  return (
    (filter.assigneeIds.length > 0 ? 1 : 0) +
    (filter.labels.length > 0 ? 1 : 0) +
    (filter.due !== 'any' ? 1 : 0)
  );
}
