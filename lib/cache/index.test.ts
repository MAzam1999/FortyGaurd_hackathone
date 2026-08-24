import { test } from "node:test";
import assert from "node:assert/strict";
import { MemoryCache, cached } from "./index";

test("get returns undefined for a key that was never set", () => {
  const cache = new MemoryCache();
  assert.equal(cache.get("missing"), undefined);
});

test("set then get returns the stored value", () => {
  const cache = new MemoryCache();
  cache.set("k", { hello: "world" }, 60_000);
  assert.deepEqual(cache.get("k"), { hello: "world" });
});

test("get returns undefined once the TTL has elapsed", () => {
  let now = 1000;
  const cache = new MemoryCache(() => now);
  cache.set("k", "value", 500);
  now += 501;
  assert.equal(cache.get("k"), undefined);
});

test("get still returns the value just before the TTL elapses", () => {
  let now = 1000;
  const cache = new MemoryCache(() => now);
  cache.set("k", "value", 500);
  now += 499;
  assert.equal(cache.get("k"), "value");
});

test("cached() calls the fetcher once and reuses the cached result on the second call", async () => {
  const cache = new MemoryCache();
  let calls = 0;
  const fetcher = async () => {
    calls += 1;
    return "fetched";
  };

  const first = await cached(cache, "k", 60_000, fetcher);
  const second = await cached(cache, "k", 60_000, fetcher);

  assert.equal(first, "fetched");
  assert.equal(second, "fetched");
  assert.equal(calls, 1);
});
