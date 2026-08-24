import { test } from "node:test";
import assert from "node:assert/strict";
import { FortyGuardClient } from "./client";
import { FortyGuardApiError, FortyGuardTimeoutError } from "./errors";

function mockResponse(status: number, body: unknown, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });
}

const HEATMAP_REQUEST = {
  polygon_aoi: { type: "FeatureCollection", features: [] } as never,
  date_time: { start_date: "2026-08-01", filter_type: 1 as const },
  granularity: 100 as const,
  analytic_type: "tcm" as const,
};

test("sends the api-key header and repeats api_key in the body for fetchApiKeyUsage", async () => {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (url, init) => {
    calls.push({ url: String(url), init: init as RequestInit });
    return mockResponse(200, { total_available_credits: 2_000_000 });
  }) as typeof fetch;

  try {
    const client = new FortyGuardClient({ apiKey: "test-key" });
    const usage = await client.fetchApiKeyUsage();
    assert.equal(usage.total_available_credits, 2_000_000);
    assert.equal(calls.length, 1);
    assert.equal((calls[0].init.headers as Record<string, string>)["api-key"], "test-key");
    assert.equal(JSON.parse(calls[0].init.body as string).api_key, "test-key");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("retries a 429 using retry-after, then succeeds", async () => {
  let call = 0;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => {
    call += 1;
    if (call === 1) return new Response(null, { status: 429, headers: { "retry-after": "0" } });
    return mockResponse(200, { total_available_credits: 100 });
  }) as typeof fetch;

  try {
    const client = new FortyGuardClient({ apiKey: "k" });
    const usage = await client.fetchApiKeyUsage();
    assert.equal(usage.total_available_credits, 100);
    assert.equal(call, 2);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("handles the 404-right-after-submit race by retrying instead of failing", async () => {
  let statusCalls = 0;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (url) => {
    const u = String(url);
    if (u.endsWith("/v1/heatmap")) return mockResponse(200, { activity_id: "abc123" });
    if (u.includes("/v1/status/")) {
      statusCalls += 1;
      if (statusCalls === 1) return new Response(null, { status: 404 });
      return mockResponse(200, { status: "Completed", result: { stats_data: { n_cells: 5 } } });
    }
    throw new Error(`unexpected url ${u}`);
  }) as typeof fetch;

  try {
    const client = new FortyGuardClient({ apiKey: "k" });
    const result = await client.heatmap(HEATMAP_REQUEST, { pollIntervalMs: 5 });
    assert.equal(result.stats_data.n_cells, 5);
    assert.ok(statusCalls >= 2);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("caches an identical request — second call doesn't hit fetch again", async () => {
  let fetchCalls = 0;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (url) => {
    fetchCalls += 1;
    const u = String(url);
    if (u.endsWith("/v1/heatmap")) return mockResponse(200, { activity_id: "abc123" });
    if (u.includes("/v1/status/")) return mockResponse(200, { status: "Completed", result: { stats_data: { n_cells: 5 } } });
    throw new Error(`unexpected url ${u}`);
  }) as typeof fetch;

  try {
    const client = new FortyGuardClient({ apiKey: "k" });
    const first = await client.heatmap(HEATMAP_REQUEST, { pollIntervalMs: 5 });
    const callsAfterFirst = fetchCalls;
    const second = await client.heatmap(HEATMAP_REQUEST, { pollIntervalMs: 5 });
    assert.deepEqual(second, first);
    assert.equal(fetchCalls, callsAfterFirst);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("throws FortyGuardTimeoutError when polling exceeds the timeout", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (url) => {
    const u = String(url);
    if (u.endsWith("/v1/heatmap")) return mockResponse(200, { activity_id: "slow1" });
    if (u.includes("/v1/status/")) return mockResponse(200, { status: "processing" });
    throw new Error(`unexpected url ${u}`);
  }) as typeof fetch;

  try {
    const client = new FortyGuardClient({ apiKey: "k" });
    await assert.rejects(
      () => client.heatmap(HEATMAP_REQUEST, { pollIntervalMs: 5, timeoutMs: 20 }),
      FortyGuardTimeoutError,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("throws FortyGuardApiError with the response's message on a non-2xx, non-404 response", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => mockResponse(500, { message: "server exploded" })) as typeof fetch;

  try {
    const client = new FortyGuardClient({ apiKey: "k" });
    await assert.rejects(
      () => client.fetchApiKeyUsage(),
      (err: unknown) => {
        assert.ok(err instanceof FortyGuardApiError);
        assert.equal((err as FortyGuardApiError).status, 500);
        assert.match((err as Error).message, /server exploded/);
        return true;
      },
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
