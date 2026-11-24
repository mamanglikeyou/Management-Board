import type { Subtask } from '../types';

export interface ChecklistProgress {
  done: number;
  total: number;
  /** 0..1 */
  ratio: number;
}

export function getChecklistProgress(subtasks: Subtask[]): ChecklistProgress {
  const total = subtasks.length;
  const done = subtasks.filter((s) => s.done).length;
  return { done, total, ratio: total === 0 ? 0 : done / total };
}
