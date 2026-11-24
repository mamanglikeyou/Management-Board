import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useTaskStore } from '@/features/task/stores/task.store';
import { createEmptyDraft, draftFromTask } from '@/features/task/utils/task.factory';
import { getChecklistProgress } from '@/features/task/utils/progress';
import { positionBetween } from '@/features/task/utils/position';

describe('task store', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('creates a task at the end of its column and logs activity', () => {
    const store = useTaskStore();
    const before = store.tasksInColumn('c_todo').length;
    const task = store.createTask({
      ...createEmptyDraft('b_adhivasindo', 'c_todo'),
      title: '  New task ',
    });

    const list = store.tasksInColumn('c_todo');
    expect(list).toHaveLength(before + 1);
    expect(list.at(-1)?.id).toBe(task.id);
    expect(task.title).toBe('New task');
    expect(task.activity[0].message).toBe('created this task');
  });

  it('updates a task and records each change', () => {
    const store = useTaskStore();
    const task = store.tasksInColumn('c_todo')[0];
    const draft = draftFromTask(task);
    draft.title = 'Renamed';
    draft.columnId = 'c_done';

    store.updateTask(task.id, draft);

    const updated = store.byId(task.id)!;
    expect(updated.title).toBe('Renamed');
    expect(updated.columnId).toBe('c_done');
    expect(updated.activity.map((a) => a.message)).toEqual(
      expect.arrayContaining([
        'renamed this task to "Renamed"',
        'moved this task from To do to Done',
      ]),
    );
  });

  it('moves a task before another task (drag & drop)', () => {
    const store = useTaskStore();
    const [first] = store.tasksInColumn('c_doing');
    const moving = store.tasksInColumn('c_todo')[1];

    store.moveTask(moving.id, 'c_doing', first.id);

    const doing = store.tasksInColumn('c_doing');
    expect(doing[0].id).toBe(moving.id);
    expect(doing[1].id).toBe(first.id);
    expect(store.tasksInColumn('c_todo').some((t) => t.id === moving.id)).toBe(false);
  });

  it('moves a task to the end when no anchor is given', () => {
    const store = useTaskStore();
    const moving = store.tasksInColumn('c_todo')[0];
    store.moveTask(moving.id, 'c_review', null);
    expect(store.tasksInColumn('c_review').at(-1)?.id).toBe(moving.id);
  });

  it('deletes a task', () => {
    const store = useTaskStore();
    const task = store.tasks[0];
    store.deleteTask(task.id);
    expect(store.byId(task.id)).toBeUndefined();
  });
});

describe('task utils', () => {
  it('computes checklist progress', () => {
    expect(getChecklistProgress([])).toEqual({ done: 0, total: 0, ratio: 0 });
    expect(
      getChecklistProgress([
        { id: 'a', title: 'a', done: true },
        { id: 'b', title: 'b', done: false },
      ]).ratio,
    ).toBe(0.5);
  });

  it('computes positions between neighbours', () => {
    expect(positionBetween(null, null)).toBe(1024);
    expect(positionBetween(1024, null)).toBe(2048);
    expect(positionBetween(null, 1024)).toBe(0);
    expect(positionBetween(1024, 2048)).toBe(1536);
  });
});
