import { clone } from '@/core/utils/clone';
import { createId } from '@/core/utils/id';
import type { Task, TaskDraft } from '../types';

export function createEmptyDraft(boardId: string, columnId: string): TaskDraft {
  return {
    boardId,
    columnId,
    title: '',
    description: '',
    assigneeIds: [],
    dueDate: null,
    label: null,
    priority: null,
    coverImage: null,
    subtasks: [],
    attachments: [],
    completed: false,
  };
}

export function draftFromTask(task: Task): TaskDraft {
  return clone({
    boardId: task.boardId,
    columnId: task.columnId,
    title: task.title,
    description: task.description,
    assigneeIds: task.assigneeIds,
    dueDate: task.dueDate,
    label: task.label,
    priority: task.priority,
    coverImage: task.coverImage,
    subtasks: task.subtasks,
    attachments: task.attachments,
    completed: task.completed,
  });
}

export function createTask(draft: TaskDraft, position: number, now = Date.now()): Task {
  return {
    ...clone(draft),
    id: createId('t_'),
    title: draft.title.trim() || 'Untitled task',
    position,
    activity: [],
    createdAt: now,
    updatedAt: now,
  };
}
