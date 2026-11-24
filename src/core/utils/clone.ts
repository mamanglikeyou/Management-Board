/**
 * Deep clone for plain JSON data. Works on Vue reactive proxies
 * (unlike structuredClone, which throws on Proxy objects).
 */
export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
