import { formatLongDate } from '@/core/utils/date';
import { labelText, priorityText } from '../constants';
import type { TaskDraft } from '../types';
import { getChecklistProgress } from './progress';

export interface ActivityContext {
  memberName: (id: string) => string;
  columnTitle: (id: string) => string;
  boardName: (id: string) => string;
}

const added = <T>(before: T[], after: T[]) => after.filter((x) => !before.includes(x));
const removed = <T>(before: T[], after: T[]) => before.filter((x) => !after.includes(x));

/** Turns the difference between two drafts into human readable activity lines. */
export function describeChanges(
  before: TaskDraft,
  after: TaskDraft,
  ctx: ActivityContext,
): string[] {
  const lines: string[] = [];

  if (before.title !== after.title) lines.push(`renamed this task to "${after.title}"`);

  if (before.boardId !== after.boardId) {
    lines.push(`moved this task to board ${ctx.boardName(after.boardId)}`);
  } else if (before.columnId !== after.columnId) {
    lines.push(
      `moved this task from ${ctx.columnTitle(before.columnId)} to ${ctx.columnTitle(after.columnId)}`,
    );
  }

  if (before.description !== after.description) lines.push('updated the description');

  for (const id of added(before.assigneeIds, after.assigneeIds))
    lines.push(`assigned ${ctx.memberName(id)}`);
  for (const id of removed(before.assigneeIds, after.assigneeIds))
    lines.push(`unassigned ${ctx.memberName(id)}`);

  if (before.dueDate !== after.dueDate) {
    lines.push(
      after.dueDate
        ? `set the due date to ${formatLongDate(after.dueDate)}`
        : 'removed the due date',
    );
  }
  if (before.label !== after.label) {
    lines.push(
      after.label ? `changed the label to ${labelText(after.label)}` : 'removed the label',
    );
  }
  if (before.priority !== after.priority) {
    lines.push(
      after.priority
        ? `set the priority to ${priorityText(after.priority)}`
        : 'removed the priority',
    );
  }
  if (before.coverImage !== after.coverImage) {
    lines.push(after.coverImage ? 'changed the cover image' : 'removed the cover image');
  }

  const beforeFiles = before.attachments.map((a) => a.id);
  const afterFiles = after.attachments.map((a) => a.id);
  for (const a of after.attachments.filter((f) => !beforeFiles.includes(f.id)))
    lines.push(`attached ${a.name}`);
  for (const a of before.attachments.filter((f) => !afterFiles.includes(f.id)))
    lines.push(`removed attachment ${a.name}`);

  if (JSON.stringify(before.subtasks) !== JSON.stringify(after.subtasks)) {
    const { done, total } = getChecklistProgress(after.subtasks);
    lines.push(`updated the checklist (${done}/${total})`);
  }

  if (before.completed !== after.completed) {
    lines.push(after.completed ? 'marked this task as complete' : 'marked this task as incomplete');
  }

  return lines;
}
