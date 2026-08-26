/**
 * The API is history-only (research/api-spike.md, 2026-08-23) — never request
 * today or a future date. Yesterday is always fully in the past.
 */
export function recentHistoricalDate(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}
