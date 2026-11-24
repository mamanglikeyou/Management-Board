import { describe, expect, it } from 'vitest';
import { createEmptyFilter, type TaskFilter } from '@/features/filter/types';
import { countActiveFilters, matchTask } from '@/features/filter/utils/matchTask';
import type { Task } from '@/features/task/types';

const names: Record<string, string> = { m1: 'Andi Saputra', m2: 'Bella Rahma' };
const ctx = { memberName: (id: string) => names[id], today: new Date(2026, 7, 10) }; // 10 Aug 2026

function task(overrides: Partial<Task> = {}): Task {
  return {
    id: 't1',
    boardId: 'b1',
    columnId: 'c1',
    position: 1,
    title: 'Design landing page',
    description: 'Hero section and pricing table',
    assigneeIds: ['m1'],
    dueDate: '2026-08-12',
    label: 'feature',
    priority: null,
    coverImage: null,
    subtasks: [{ id: 's1', title: 'Collect references', done: false }],
    attachments: [],
    activity: [],
    completed: false,
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}

const filter = (overrides: Partial<TaskFilter>): TaskFilter => ({
  ...createEmptyFilter(),
  ...overrides,
});

describe('matchTask — search', () => {
  it('matches everything with an empty filter', () => {
    expect(matchTask(task(), createEmptyFilter(), ctx)).toBe(true);
  });

  it.each([
    ['title', 'landing'],
    ['description', 'pricing'],
    ['assignee name', 'andi'],
    ['label', 'FEATURE'],
    ['subtask', 'references'],
  ])('finds tasks by %s', (_, query) => {
    expect(matchTask(task(), filter({ query }), ctx)).toBe(true);
  });

  it('requires every search term to match', () => {
    expect(matchTask(task(), filter({ query: 'landing bella' }), ctx)).toBe(false);
  });
});

describe('matchTask — filters', () => {
  it('filters by assignee (any of the selected)', () => {
    expect(matchTask(task(), filter({ assigneeIds: ['m2', 'm1'] }), ctx)).toBe(true);
    expect(matchTask(task(), filter({ assigneeIds: ['m2'] }), ctx)).toBe(false);
  });

  it('treats a missing label as "undefined"', () => {
    expect(matchTask(task({ label: null }), filter({ labels: ['undefined'] }), ctx)).toBe(true);
    expect(matchTask(task(), filter({ labels: ['bug'] }), ctx)).toBe(false);
  });

  it('filters by due date presets', () => {
    expect(matchTask(task({ dueDate: '2026-08-09' }), filter({ due: 'overdue' }), ctx)).toBe(true);
    expect(
      matchTask(task({ dueDate: '2026-08-09', completed: true }), filter({ due: 'overdue' }), ctx),
    ).toBe(false);
    expect(matchTask(task({ dueDate: '2026-08-10' }), filter({ due: 'today' }), ctx)).toBe(true);
    expect(matchTask(task({ dueDate: '2026-08-17' }), filter({ due: 'week' }), ctx)).toBe(true);
    expect(matchTask(task({ dueDate: '2026-08-18' }), filter({ due: 'week' }), ctx)).toBe(false);
    expect(matchTask(task({ dueDate: null }), filter({ due: 'none' }), ctx)).toBe(true);
    expect(matchTask(task(), filter({ due: 'date', dueDate: '2026-08-12' }), ctx)).toBe(true);
  });

  it('counts active filter groups (search excluded)', () => {
    expect(countActiveFilters(filter({ query: 'x' }))).toBe(0);
    expect(countActiveFilters(filter({ labels: ['bug', 'issue'], due: 'today' }))).toBe(2);
  });
});
