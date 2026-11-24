export type TaskLabel = 'feature' | 'bug' | 'issue' | 'undefined';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

/** Dummy attachment: metadata only, file contents are never stored. */
export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface ActivityEntry {
  id: string;
  message: string;
  createdAt: number;
}

export interface Task {
  id: string;
  boardId: string;
  columnId: string;
  /** Sort key inside a column (fractional indexing). */
  position: number;
  title: string;
  description: string;
  assigneeIds: string[];
  /** ISO calendar date, YYYY-MM-DD. */
  dueDate: string | null;
  label: TaskLabel | null;
  priority: TaskPriority | null;
  coverImage: string | null;
  subtasks: Subtask[];
  attachments: Attachment[];
  activity: ActivityEntry[];
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}

/** Editable fields of a task (what the detail form works with). */
export type TaskDraft = Pick<
  Task,
  | 'boardId'
  | 'columnId'
  | 'title'
  | 'description'
  | 'assigneeIds'
  | 'dueDate'
  | 'label'
  | 'priority'
  | 'coverImage'
  | 'subtasks'
  | 'attachments'
  | 'completed'
>;
