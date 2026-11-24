import type { PiniaPluginContext, StateTree } from 'pinia';
import type { StorageDriver } from './storage';

export interface PersistOptions {
  /** Storage key. */
  key: string;
  /** Bump when the persisted shape changes; stale data is discarded. */
  version: number;
  /** State keys to persist (defaults to the whole state). */
  paths?: string[];
}

interface Envelope {
  version: number;
  data: StateTree;
}

declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    persist?: PersistOptions;
  }
}

function pick(state: StateTree, paths?: string[]): StateTree {
  if (!paths) return state;
  return Object.fromEntries(paths.map((p) => [p, state[p]]));
}

/** Pinia plugin: hydrates opted-in stores from storage and saves them on every change. */
export function createPersistPlugin(driver: StorageDriver) {
  return ({ store, options }: PiniaPluginContext) => {
    const persist = options.persist;
    if (!persist) return;

    const saved = driver.getItem<Envelope>(persist.key);
    if (saved && saved.version === persist.version) {
      store.$patch(saved.data);
    }

    store.$subscribe(
      () => {
        driver.setItem<Envelope>(persist.key, {
          version: persist.version,
          data: JSON.parse(JSON.stringify(pick(store.$state, persist.paths))),
        });
      },
      { detached: true, flush: 'post' },
    );
  };
}
