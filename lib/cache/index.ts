/**
 * In-memory, per-process cache. Deliberately simple — good enough to avoid
 * duplicate FortyGuard calls within a single dev/server run, but it does NOT
 * persist across serverless cold starts or multiple instances, and it is
 * NOT the golden/demo dataset. The actual demo dataset belongs in
 * /research/data (docs/PRD.md §9), generated once from the designated key.
 */
export class MemoryCache {
  private store = new Map<string, { value: unknown; expiresAt: number }>();

  constructor(private readonly now: () => number = Date.now) {}

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (this.now() >= entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    this.store.set(key, { value, expiresAt: this.now() + ttlMs });
  }
}

/** Runs fetcher only on a cache miss; stores and reuses the result until ttlMs elapses. */
export async function cached<T>(
  cache: MemoryCache,
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const hit = cache.get<T>(key);
  if (hit !== undefined) return hit;
  const value = await fetcher();
  cache.set(key, value, ttlMs);
  return value;
}

/**
 * Stable key for a FortyGuard call: endpoint path + sorted-key JSON of the
 * request body. Covers every endpoint uniformly (point-based ones like
 * env_params/streetview as well as polygon-based heatmap), unlike a literal
 * (lat, lon, hour, analytic_type) tuple which only fits the point-based case.
 */
export function fortyGuardCacheKey(path: string, request: unknown): string {
  return `${path}:${stableStringify(request)}`;
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const keys = Object.keys(value as Record<string, unknown>).sort();
  const entries = keys.map((k) => `${JSON.stringify(k)}:${stableStringify((value as Record<string, unknown>)[k])}`);
  return `{${entries.join(",")}}`;
}
