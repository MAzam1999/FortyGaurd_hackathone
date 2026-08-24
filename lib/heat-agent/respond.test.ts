import { test } from "node:test";
import assert from "node:assert/strict";
import { handleAskAgentRequest } from "./respond";

test("returns a not-configured reply when no known LLM provider key is set", () => {
  const result = handleAskAgentRequest("Is it safer to leave at 3 or 5 today?", {});
  assert.equal(result.configured, false);
  assert.match(result.reply, /not.*configured|needs an LLM API key/i);
});

test("rejects an empty message", () => {
  const result = handleAskAgentRequest("   ", {});
  assert.equal(result.configured, false);
  assert.match(result.reply, /message is required/i);
});

test("still reports not-configured even if unrelated env vars are set", () => {
  const result = handleAskAgentRequest("hello", { FORTYGUARD_API_KEY: "x" });
  assert.equal(result.configured, false);
});

test("recognizes an OpenRouter key as configured", () => {
  const result = handleAskAgentRequest("hello", { OPENROUTER_API_KEY: "x" });
  assert.equal(result.configured, true);
});
