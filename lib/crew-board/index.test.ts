import { test } from "node:test";
import assert from "node:assert/strict";
import {
  occupationalRiskContext,
  occupationalRiskNote,
  buildWorksiteStatus,
  formatLogEntry,
} from "./index";

test("occupationalRiskContext is baseline for light and moderate workload", () => {
  assert.equal(occupationalRiskContext("light"), "baseline");
  assert.equal(occupationalRiskContext("moderate"), "baseline");
});

test("occupationalRiskContext is increased for heavy workload", () => {
  assert.equal(occupationalRiskContext("heavy"), "increased");
});

test("occupationalRiskNote is null unless there's something to say", () => {
  assert.equal(occupationalRiskNote("light"), null);
  assert.equal(occupationalRiskNote("moderate"), null);
  assert.ok(occupationalRiskNote("heavy"));
});

test("buildWorksiteStatus derives the tier from the unmodified heat index, not a workload offset", () => {
  // 95F sits in the 'moderate' band (91-103) regardless of workload — the
  // environmental Heat Index is never adjusted by workload (see
  // crew-board-science-review.md §5).
  const light = buildWorksiteStatus({
    name: "Site A",
    heatIndexF: 95,
    wetBulbC: 26,
    workload: "light",
  });
  const heavy = buildWorksiteStatus({
    name: "Site A",
    heatIndexF: 95,
    wetBulbC: 26,
    workload: "heavy",
  });
  assert.equal(light.tier, "moderate");
  assert.equal(heavy.tier, "moderate");
  assert.equal(light.occupationalRiskContext, "baseline");
  assert.equal(heavy.occupationalRiskContext, "increased");
});

test("formatLogEntry produces a shareable, timestamped line including occupational risk", () => {
  const status = buildWorksiteStatus({
    name: "Elysian Fields site",
    heatIndexF: 104,
    wetBulbC: 27,
    workload: "heavy",
  });
  const entry = formatLogEntry(status, new Date("2026-08-24T14:00:00.000Z"));
  assert.equal(
    entry,
    "[2026-08-24T14:00:00.000Z] Elysian Fields site: high tier (heat index 104°F, heavy workload, occupational risk increased)",
  );
});
