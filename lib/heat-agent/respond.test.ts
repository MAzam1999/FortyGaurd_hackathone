import { test } from "node:test";
import assert from "node:assert/strict";
import { handleAskAgentRequest } from "./respond";

function mockFetchOnce(...responses: Array<{ status?: number; body: unknown }>) {
  const original = globalThis.fetch;
  let call = 0;
  globalThis.fetch = (async () => {
    const r = responses[Math.min(call, responses.length - 1)];
    call += 1;
    return new Response(JSON.stringify(r.body), { status: r.status ?? 200 });
  }) as typeof fetch;
  return () => {
    globalThis.fetch = original;
  };
}

test("returns a not-configured reply when no known LLM provider key is set", async () => {
  const result = await handleAskAgentRequest("Is it safer to leave at 3 or 5 today?", {});
  assert.equal(result.configured, false);
  assert.match(result.reply, /not.*configured|needs an LLM API key/i);
});

test("rejects an empty message", async () => {
  const result = await handleAskAgentRequest("   ", {});
  assert.equal(result.configured, false);
  assert.match(result.reply, /message is required/i);
});

test("still reports not-configured even if unrelated env vars are set", async () => {
  const result = await handleAskAgentRequest("hello", { FORTYGUARD_API_KEY: "x" });
  assert.equal(result.configured, false);
});

test("recognizes an OpenRouter key and returns the model's direct reply", async () => {
  const restore = mockFetchOnce({
    body: { choices: [{ message: { role: "assistant", content: "It's cooler to leave at 5." } }] },
  });
  try {
    const result = await handleAskAgentRequest("hello", { OPENROUTER_API_KEY: "x" });
    assert.equal(result.configured, true);
    assert.equal(result.reply, "It's cooler to leave at 5.");
    assert.equal(result.toolCalls, undefined);
  } finally {
    restore();
  }
});

test("executes a requested tool call and reports it in toolCalls", async () => {
  const restore = mockFetchOnce(
    {
      body: {
        choices: [
          {
            message: {
              role: "assistant",
              content: null,
              tool_calls: [{ id: "call_1", function: { name: "compare_routes", arguments: "{}" } }],
            },
          },
        ],
      },
    },
    { body: { choices: [{ message: { role: "assistant", content: "Take the cooler route." } }] } },
  );
  try {
    const result = await handleAskAgentRequest("compare my two routes", { OPENROUTER_API_KEY: "x" });
    assert.equal(result.configured, true);
    assert.equal(result.reply, "Take the cooler route.");
    assert.equal(result.toolCalls?.length, 1);
    assert.equal(result.toolCalls?.[0].name, "compare_routes");
  } finally {
    restore();
  }
});

test("reports a failed model call without crashing", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = (async () => new Response("server error", { status: 500 })) as typeof fetch;
  try {
    const result = await handleAskAgentRequest("hello", { OPENROUTER_API_KEY: "x" });
    assert.equal(result.configured, true);
    assert.match(result.reply, /model call failed/i);
  } finally {
    globalThis.fetch = original;
  }
});
