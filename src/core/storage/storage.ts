/**
 * Storage abstraction. Stores never talk to `window.localStorage` directly,
 * so the persistence layer can be swapped (IndexedDB, Ionic Storage, REST API)
 * without touching any feature code.
 */
export interface StorageDriver {
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
}

export function createLocalStorageDriver(namespace = 'adhivasindo'): StorageDriver {
  const k = (key: string) => `${namespace}:${key}`;
  return {
    getItem<T>(key: string): T | null {
      try {
        const raw = localStorage.getItem(k(key));
        return raw ? (JSON.parse(raw) as T) : null;
      } catch {
        return null;
      }
    },
    setItem<T>(key: string, value: T): void {
      try {
        localStorage.setItem(k(key), JSON.stringify(value));
      } catch (error) {
        console.warn(`[storage] failed to persist "${key}"`, error);
      }
    },
    removeItem(key: string): void {
      try {
        localStorage.removeItem(k(key));
      } catch {
        /* storage unavailable — nothing to clean up */
      }
    },
  };
}

/** In-memory driver: used by unit tests and as a fallback. */
export function createMemoryDriver(): StorageDriver {
  const map = new Map<string, string>();
  return {
    getItem: <T>(key: string) => (map.has(key) ? (JSON.parse(map.get(key)!) as T) : null),
    setItem: (key, value) => void map.set(key, JSON.stringify(value)),
    removeItem: (key) => void map.delete(key),
  };
}
