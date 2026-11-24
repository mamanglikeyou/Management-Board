import { clone } from '@/core/utils/clone';
import { downloadJson, readFileAsText } from '@/core/utils/file';
import { SEED_BOARDS, createSeedTasks } from '@/data/seed.board';
import { useBoardStore } from '@/features/board/stores/board.store';
import { useTaskStore } from '@/features/task/stores/task.store';
import { useConfirm } from '@/shared/composables/useConfirm';
import { useToast } from '@/shared/composables/useToast';
import { ImportError, buildExport, parseImport } from './services/transfer.service';

/** Export / import / reset use-cases for the whole workspace. */
export function useTransfer() {
  const boards = useBoardStore();
  const tasks = useTaskStore();
  const toast = useToast();
  const confirm = useConfirm();

  function exportJson() {
    const data = buildExport(boards.boards, boards.activeBoardId, tasks.tasks);
    const date = new Date().toISOString().slice(0, 10);
    downloadJson(`task-board-${date}.json`, data);
    toast.success(`Exported ${data.tasks.length} tasks`);
  }

  async function importFile(file: File) {
    try {
      const data = parseImport(await readFileAsText(file));
      const ok = await confirm({
        header: 'Import board data?',
        message: `This replaces the current boards with ${data.boards.length} board(s) and ${data.tasks.length} task(s).`,
        confirmText: 'Import',
      });
      if (!ok) return;
      boards.replaceAll({ boards: data.boards, activeBoardId: data.activeBoardId });
      tasks.replaceAll(data.tasks);
      toast.success('Board imported');
    } catch (error) {
      toast.error(error instanceof ImportError ? error.message : 'Could not read the file');
    }
  }

  async function resetDemo() {
    const ok = await confirm({
      header: 'Reset demo data?',
      message: 'All boards and tasks will be replaced with the original sample data.',
      confirmText: 'Reset',
      destructive: true,
    });
    if (!ok) return;
    boards.replaceAll({ boards: clone(SEED_BOARDS), activeBoardId: SEED_BOARDS[0].id });
    tasks.replaceAll(createSeedTasks());
    toast.success('Demo data restored');
  }

  return { exportJson, importFile, resetDemo };
}
