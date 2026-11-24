import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { createId } from '@/core/utils/id';
import { SEED_BOARDS } from '@/data/seed.board';
import { clone } from '@/core/utils/clone';
import type { Board, Column } from '../types';

export const useBoardStore = defineStore(
  'board',
  () => {
    const boards = ref<Board[]>(clone(SEED_BOARDS));
    const activeBoardId = ref<string>(SEED_BOARDS[0].id);

    const activeBoard = computed<Board>(
      () => boards.value.find((b) => b.id === activeBoardId.value) ?? boards.value[0],
    );
    const columns = computed<Column[]>(() => activeBoard.value?.columns ?? []);

    function boardById(id: string): Board | undefined {
      return boards.value.find((b) => b.id === id);
    }

    function findColumn(columnId: string): { board: Board; column: Column } | undefined {
      for (const board of boards.value) {
        const column = board.columns.find((c) => c.id === columnId);
        if (column) return { board, column };
      }
      return undefined;
    }

    function columnTitle(columnId: string): string {
      return findColumn(columnId)?.column.title ?? 'Unknown';
    }

    function setActiveBoard(id: string) {
      if (boardById(id)) activeBoardId.value = id;
    }

    function addColumn(title: string): Column {
      const column: Column = { id: createId('c_'), title: title.trim(), collapsed: false };
      activeBoard.value.columns.push(column);
      return column;
    }

    function renameColumn(columnId: string, title: string) {
      const found = findColumn(columnId);
      if (found && title.trim()) found.column.title = title.trim();
    }

    function toggleCollapse(columnId: string) {
      const found = findColumn(columnId);
      if (found) found.column.collapsed = !found.column.collapsed;
    }

    /** Removes the column only; the caller is responsible for its tasks (see useBoardActions). */
    function removeColumn(columnId: string) {
      const found = findColumn(columnId);
      if (found) found.board.columns = found.board.columns.filter((c) => c.id !== columnId);
    }

    function replaceAll(next: { boards: Board[]; activeBoardId: string }) {
      boards.value = next.boards;
      activeBoardId.value = next.boards.some((b) => b.id === next.activeBoardId)
        ? next.activeBoardId
        : next.boards[0].id;
    }

    return {
      boards,
      activeBoardId,
      activeBoard,
      columns,
      boardById,
      findColumn,
      columnTitle,
      setActiveBoard,
      addColumn,
      renameColumn,
      toggleCollapse,
      removeColumn,
      replaceAll,
    };
  },
  { persist: { key: 'boards', version: 1, paths: ['boards', 'activeBoardId'] } },
);
