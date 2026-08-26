import { FortyGuardClient } from "./client";

let client: FortyGuardClient | null = null;

/**
 * One client per server process so its in-memory cache (lib/cache) is shared
 * across requests — an identical request within the cache TTL is served from
 * memory instead of spending credits again. Not a substitute for a real
 * persistent golden/cached dataset (docs/PRD.md §9, owned by Ghada) — this
 * cache is lost on every server restart.
 */
export function getFortyGuardClient(): FortyGuardClient {
  if (!client) {
    client = new FortyGuardClient();
  }
  return client;
}
