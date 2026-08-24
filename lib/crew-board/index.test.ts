import { test } from "node:test";
import assert from "node:assert/strict";
import { effectiveHeatIndexF, crewWorkRestTier, buildWorksiteStatus, formatLogEntry } from "./index";

test("effectiveHeatIndexF applies the light-workload offset", () => {
  assert.equal(effectiveHeatIndexF(100, "light"), 95);
});

test("effectiveHeatIndexF applies no offset for moderate workload", () => {
  assert.equal(effectiveHeatIndexF(100, "moderate"), 100);
});

test("effectiveHeatIndexF applies the heavy-workload offset", () => {
  assert.equal(effectiveHeatIndexF(100, "heavy"), 108);
});

test("crewWorkRestTier escalates tier for heavy workload at the same raw heat index", () => {
  // raw 95F: light -> effective 90 -> 'lower'; heavy -> effective 103 -> 'high'
  assert.equal(crewWorkRestTier(95, "light"), "lower");
  assert.equal(crewWorkRestTier(95, "heavy"), "high");
});

test("buildWorksiteStatus attaches the computed tier to the worksite", () => {
  const status = buildWorksiteStatus({
    name: "Elysian Fields site",
    heatIndexF: 100,
    wetBulbC: 27,
    workload: "heavy",
  });
  assert.equal(status.name, "Elysian Fields site");
  assert.equal(status.tier, "high"); // effective 108F
});

test("formatLogEntry produces a shareable, timestamped line", () => {
  const status = buildWorksiteStatus({
    name: "Elysian Fields site",
    heatIndexF: 100,
    wetBulbC: 27,
    workload: "heavy",
  });
  const entry = formatLogEntry(status, new Date("2026-08-24T14:00:00.000Z"));
  assert.equal(
    entry,
    "[2026-08-24T14:00:00.000Z] Elysian Fields site: high tier (heat index 100°F, heavy workload)",
  );
});
