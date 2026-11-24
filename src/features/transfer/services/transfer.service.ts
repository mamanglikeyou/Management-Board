import type { Board } from '@/features/board/types';
import type { Task } from '@/features/task/types';

export const EXPORT_APP_ID = 'adhivasindo-task-board';
export const EXPORT_VERSION = 1;

export interface BoardExport {
  app: typeof EXPORT_APP_ID;
  version: number;
  exportedAt: string;
  activeBoardId: string;
  boards: Board[];
  tasks: Task[];
}

export function buildExport(boards: Board[], activeBoardId: string, tasks: Task[]): BoardExport {
  return {
    app: EXPORT_APP_ID,
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    activeBoardId,
    boards: JSON.parse(JSON.stringify(boards)),
    tasks: JSON.parse(JSON.stringify(tasks)),
  };
}

export class ImportError extends Error {}

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

/** Validates an exported file and returns typed data, or throws ImportError with a readable reason. */
export function parseImport(text: string): BoardExport {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new ImportError('File is not valid JSON');
  }

  if (!isObject(data) || data.app !== EXPORT_APP_ID) {
    throw new ImportError('This file was not exported from the task board');
  }
  if (data.version !== EXPORT_VERSION) {
    throw new ImportError(`Unsupported export version: ${String(data.version)}`);
  }
  if (!Array.isArray(data.boards) || data.boards.length === 0 || !Array.isArray(data.tasks)) {
    throw new ImportError('File does not contain any boards');
  }

  const boards = data.boards as Board[];
  const columnIds = new Set(
    boards.flatMap((b) => (Array.isArray(b.columns) ? b.columns.map((c) => c.id) : [])),
  );
  const tasks = (data.tasks as Task[]).filter(
    (t) =>
      isObject(t) &&
      typeof t.id === 'string' &&
      typeof t.title === 'string' &&
      columnIds.has(t.columnId),
  );

  return {
    app: EXPORT_APP_ID,
    version: EXPORT_VERSION,
    exportedAt: String(data.exportedAt ?? ''),
    activeBoardId: String(data.activeBoardId ?? boards[0].id),
    boards,
    tasks,
  };
}
