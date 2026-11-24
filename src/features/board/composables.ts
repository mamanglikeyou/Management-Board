import { useConfirm } from '@/shared/composables/useConfirm';
import { useToast } from '@/shared/composables/useToast';
import { useTaskStore } from '@/features/task/stores/task.store';
import { useBoardStore } from './stores/board.store';

/** Use-cases that span several stores live here, keeping each store single-purpose. */
export function useBoardActions() {
  const boards = useBoardStore();
  const tasks = useTaskStore();
  const toast = useToast();
  const confirm = useConfirm();

  async function deleteColumn(columnId: string) {
    const title = boards.columnTitle(columnId);
    const count = tasks.tasksInColumn(columnId).length;
    const ok = await confirm({
      header: `Delete "${title}"?`,
      message: count
        ? `This list and its ${count} task${count > 1 ? 's' : ''} will be permanently removed.`
        : 'This list will be permanently removed.',
      confirmText: 'Delete',
      destructive: true,
    });
    if (!ok) return;
    tasks.removeByColumn(columnId);
    boards.removeColumn(columnId);
    toast.success(`List "${title}" deleted`);
  }

  function addColumn(title: string) {
    if (!title.trim()) return;
    boards.addColumn(title);
    toast.success(`List "${title.trim()}" added`);
  }

  return { deleteColumn, addColumn };
}
