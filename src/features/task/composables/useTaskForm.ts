import { computed, ref, watch } from 'vue';
import { clone } from '@/core/utils/clone';
import { createId } from '@/core/utils/id';
import { useBoardStore } from '@/features/board/stores/board.store';
import { useToast } from '@/shared/composables/useToast';
import { useConfirm } from '@/shared/composables/useConfirm';
import { useTaskStore } from '../stores/task.store';
import type { Attachment, TaskDraft } from '../types';
import { createEmptyDraft, draftFromTask } from '../utils/task.factory';
import { getChecklistProgress } from '../utils/progress';

interface Options {
  taskId?: string;
  columnId?: string;
}

/**
 * Draft-based editing: the form edits a copy, nothing touches the store
 * until the user presses Save. Discard simply drops the copy.
 */
export function useTaskForm(options: Options) {
  const tasks = useTaskStore();
  const boards = useBoardStore();
  const toast = useToast();
  const confirm = useConfirm();

  const existing = options.taskId ? tasks.byId(options.taskId) : undefined;
  const isNew = !existing;

  const initial: TaskDraft = existing
    ? draftFromTask(existing)
    : createEmptyDraft(
        boards.activeBoard.id,
        options.columnId ?? boards.activeBoard.columns[0]?.id ?? '',
      );

  const draft = ref<TaskDraft>(clone(initial));
  const snapshot = JSON.stringify(initial);
  const isDirty = computed(() => JSON.stringify(draft.value) !== snapshot);
  const progress = computed(() => getChecklistProgress(draft.value.subtasks));
  const activity = computed(() => (existing ? (tasks.byId(existing.id)?.activity ?? []) : []));

  const boardColumns = computed(() => boards.boardById(draft.value.boardId)?.columns ?? []);

  // Keep the column valid when the board changes.
  watch(
    () => draft.value.boardId,
    () => {
      if (!boardColumns.value.some((c) => c.id === draft.value.columnId)) {
        draft.value.columnId = boardColumns.value[0]?.id ?? '';
      }
    },
  );

  /* ---- checklist ---- */
  function addSubtask(title: string) {
    if (!title.trim()) return;
    draft.value.subtasks.push({ id: createId('s_'), title: title.trim(), done: false });
  }
  function toggleSubtask(id: string) {
    const item = draft.value.subtasks.find((s) => s.id === id);
    if (item) item.done = !item.done;
  }
  function removeSubtask(id: string) {
    draft.value.subtasks = draft.value.subtasks.filter((s) => s.id !== id);
  }

  /* ---- attachments (dummy: metadata only) ---- */
  function addFiles(files: FileList | File[]) {
    const items: Attachment[] = Array.from(files).map((f) => ({
      id: createId('a_'),
      name: f.name,
      size: f.size,
      type: f.type || 'application/octet-stream',
    }));
    draft.value.attachments.push(...items);
  }
  function removeAttachment(id: string) {
    draft.value.attachments = draft.value.attachments.filter((a) => a.id !== id);
  }

  /* ---- persistence ---- */
  function validate(): string | null {
    if (!draft.value.title.trim()) return 'Please give the task a title';
    if (!draft.value.columnId) return 'Please choose a column';
    return null;
  }

  /** Returns true when the modal can close. */
  function save(): boolean {
    const error = validate();
    if (error) {
      toast.error(error);
      return false;
    }
    if (isNew) {
      tasks.createTask(draft.value);
      toast.success('Task created');
    } else if (isDirty.value) {
      tasks.updateTask(existing!.id, draft.value);
      toast.success('Task updated');
    }
    return true;
  }

  async function remove(): Promise<boolean> {
    if (!existing) return true;
    const ok = await confirm({
      header: 'Delete task?',
      message: `"${existing.title}" will be permanently removed.`,
      confirmText: 'Delete',
      destructive: true,
    });
    if (!ok) return false;
    tasks.deleteTask(existing.id);
    toast.success('Task deleted');
    return true;
  }

  async function confirmDiscard(): Promise<boolean> {
    if (!isDirty.value) return true;
    return confirm({
      header: 'Discard changes?',
      message: 'Your unsaved changes will be lost.',
      confirmText: 'Discard',
      destructive: true,
    });
  }

  return {
    draft,
    isNew,
    isDirty,
    progress,
    activity,
    boardColumns,
    addSubtask,
    toggleSubtask,
    removeSubtask,
    addFiles,
    removeAttachment,
    save,
    remove,
    confirmDiscard,
  };
}
