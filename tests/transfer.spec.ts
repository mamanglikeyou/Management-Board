import { describe, expect, it } from 'vitest';
import { SEED_BOARDS, createSeedTasks } from '@/data/seed.board';
import {
  ImportError,
  buildExport,
  parseImport,
} from '@/features/transfer/services/transfer.service';
import { createMemoryDriver } from '@/core/storage/storage';

describe('export / import', () => {
  it('round-trips an export', () => {
    const tasks = createSeedTasks();
    const exported = buildExport(SEED_BOARDS, SEED_BOARDS[0].id, tasks);
    const imported = parseImport(JSON.stringify(exported));
    expect(imported.boards).toHaveLength(SEED_BOARDS.length);
    expect(imported.tasks).toHaveLength(tasks.length);
  });

  it('rejects invalid files with a readable error', () => {
    expect(() => parseImport('not json')).toThrow(ImportError);
    expect(() => parseImport('{"app":"other"}')).toThrow(/not exported/);
  });

  it('drops tasks that point to unknown columns', () => {
    const exported = buildExport(SEED_BOARDS, SEED_BOARDS[0].id, createSeedTasks());
    exported.tasks[0].columnId = 'missing';
    expect(parseImport(JSON.stringify(exported)).tasks).toHaveLength(exported.tasks.length - 1);
  });
});

describe('storage driver', () => {
  it('stores and reads JSON values', () => {
    const driver = createMemoryDriver();
    driver.setItem('k', { a: 1 });
    expect(driver.getItem('k')).toEqual({ a: 1 });
    driver.removeItem('k');
    expect(driver.getItem('k')).toBeNull();
  });
});
