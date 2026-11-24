import type { TaskLabel, TaskPriority } from './types';

export interface Option<T extends string> {
  value: T;
  text: string;
}

export const LABEL_OPTIONS: Option<TaskLabel>[] = [
  { value: 'feature', text: 'Feature' },
  { value: 'bug', text: 'Bug' },
  { value: 'issue', text: 'Issue' },
  { value: 'undefined', text: 'Undefined' },
];

export const PRIORITY_OPTIONS: Option<TaskPriority>[] = [
  { value: 'low', text: 'Low' },
  { value: 'medium', text: 'Medium' },
  { value: 'high', text: 'High' },
  { value: 'urgent', text: 'Urgent' },
];

export const labelText = (label: TaskLabel) =>
  LABEL_OPTIONS.find((o) => o.value === label)?.text ?? label;

export const priorityText = (priority: TaskPriority) =>
  PRIORITY_OPTIONS.find((o) => o.value === priority)?.text ?? priority;
