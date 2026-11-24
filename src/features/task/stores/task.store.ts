import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { clone } from '@/core/utils/clone';
import { createId } from '@/core/utils/id';
import { createSeedTasks } from '@/data/seed.board';
import { useBoardStore } from '@/features/board/stores/board.store';
import { useMemberStore } from '@/features/members/stores/member.store';
import type { Task, TaskDraft } from '../types';
import { describeChanges, type ActivityContext } from '../utils/activity';
import { positionBetween } from '../utils/position';
import { createTask as buildTask, draftFromTask } from '../utils/task.factory';

const byPosition = (a: Task, b: Task) => a.position - b.position;

export const useTaskStore = defineStore(
  'tasks',
  () => {
    const tasks = ref<Task[]>(createSeedTasks());

    const boards = useBoardStore();
    const members = useMemberStore();

    /** Tasks grouped per column and sorted — recomputed only when tasks change. */
    const byColumn = computed(() => {
      const map = new Map<string, Task[]>();
      for (const task of tasks.value) {
        const list = map.get(task.columnId) ?? [];
        list.push(task);
        map.set(task.columnId, list);
      }
      for (const list of map.values()) list.sort(byPosition);
      return map;
    });

    const activityContext: ActivityContext = {
      memberName: (id) => members.byId(id)?.name ?? 'someone',
      columnTitle: (id) => boards.columnTitle(id),
      boardName: (id) => boards.boardById(id)?.name ?? 'Unknown',
    };

    function tasksInColumn(columnId: string): Task[] {
      return byColumn.value.get(columnId) ?? [];
    }

    function byId(id: string): Task | undefined {
      return tasks.value.find((t) => t.id === id);
    }

    function log(task: Task, messages: string[]) {
      const now = Date.now();
      task.activity.unshift(
        ...messages.map((message) => ({ id: createId('l_'), message, createdAt: now })),
      );
      task.updatedAt = now;
    }

    function endPosition(columnId: string, excludeId?: string): number {
      const list = tasksInColumn(columnId).filter((t) => t.id !== excludeId);
      return positionBetween(list.at(-1)?.position ?? null, null);
    }

    function createTask(draft: TaskDraft): Task {
      const task = buildTask(draft, endPosition(draft.columnId));
      log(task, ['created this task']);
      tasks.value.push(task);
      return task;
    }

    function updateTask(id: string, draft: TaskDraft): Task | undefined {
      const task = byId(id);
      if (!task) return undefined;

      const next = clone(draft);
      next.title = next.title.trim() || task.title;
      const changes = describeChanges(draftFromTask(task), next, activityContext);
      if (changes.length === 0) return task;

      const columnChanged = task.columnId !== next.columnId;
      Object.assign(task, next);
      if (columnChanged) task.position = endPosition(next.columnId, task.id);
      log(task, changes);
      return task;
    }

    function deleteTask(id: string): Task | undefined {
      const task = byId(id);
      if (task) tasks.value = tasks.value.filter((t) => t.id !== id);
      return task;
    }

    /**
     * Moves a task into `toColumnId`, placed right before `beforeTaskId`
     * (or at the end when null). Used by drag & drop.
     */
    function moveTask(id: string, toColumnId: string, beforeTaskId: string | null) {
      const task = byId(id);
      if (!task) return;

      const siblings = tasksInColumn(toColumnId).filter((t) => t.id !== id);
      const index = beforeTaskId ? siblings.findIndex((t) => t.id === beforeTaskId) : -1;
      const after = index >= 0 ? siblings[index] : null;
      const before = index >= 0 ? (siblings[index - 1] ?? null) : (siblings.at(-1) ?? null);

      const fromColumnId = task.columnId;
      task.position = positionBetween(before?.position ?? null, after?.position ?? null);
      if (fromColumnId !== toColumnId) {
        task.columnId = toColumnId;
        log(task, [
          `moved this task from ${boards.columnTitle(fromColumnId)} to ${boards.columnTitle(toColumnId)}`,
        ]);
      }
    }

    function toggleSubtask(taskId: string, subtaskId: string) {
      const task = byId(taskId);
      const subtask = task?.subtasks.find((s) => s.id === subtaskId);
      if (task && subtask) {
        subtask.done = !subtask.done;
        task.updatedAt = Date.now();
      }
    }

    function removeByColumn(columnId: string): number {
      const before = tasks.value.length;
      tasks.value = tasks.value.filter((t) => t.columnId !== columnId);
      return before - tasks.value.length;
    }

    function replaceAll(next: Task[]) {
      tasks.value = next;
    }

    return {
      tasks,
      tasksInColumn,
      byId,
      createTask,
      updateTask,
      deleteTask,
      moveTask,
      toggleSubtask,
      removeByColumn,
      replaceAll,
    };
  },
  { persist: { key: 'tasks', version: 1, paths: ['tasks'] } },
);
