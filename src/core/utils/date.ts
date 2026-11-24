/** Dates are stored as ISO calendar dates (YYYY-MM-DD) to avoid timezone drift. */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function toISODate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** "8 Aug" — used on cards. */
export function formatShortDate(iso: string): string {
  const d = parseISODate(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/** "20 Aug, 2025" — used in the detail view. */
export function formatLongDate(iso: string): string {
  const d = parseISODate(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function diffInDays(iso: string, today: Date = new Date()): number {
  const ms = parseISODate(iso).getTime() - startOfDay(today).getTime();
  return Math.round(ms / 86_400_000);
}

export function timeAgo(timestamp: number, now: number = Date.now()): string {
  const s = Math.max(0, Math.round((now - timestamp) / 1000));
  if (s < 45) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ago`;
  return formatLongDate(toISODate(new Date(timestamp)));
}
