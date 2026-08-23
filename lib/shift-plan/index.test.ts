import { test } from "node:test";
import assert from "node:assert/strict";
import { buildExposureTimeline, findWorstWindow, buildAlternatives } from "./index";

test("buildExposureTimeline converts each hour's heat index and assigns a band", () => {
  const timeline = buildExposureTimeline([
    { hour: 6, heatIndexC: 24 }, // ~75F -> no band
    { hour: 14, heatIndexC: 38 }, // ~100F -> extreme_caution
  ]);

  assert.equal(timeline.length, 2);
  assert.equal(timeline[0].hour, 6);
  assert.equal(timeline[0].band, null);
  assert.equal(timeline[1].hour, 14);
  assert.equal(timeline[1].band, "extreme_caution");
});

test("findWorstWindow returns the contiguous run of hours at the highest severity band", () => {
  const timeline = buildExposureTimeline([
    { hour: 12, heatIndexC: 32 }, // ~90F extreme_caution
    { hour: 13, heatIndexC: 38 }, // ~100F extreme_caution
    { hour: 14, heatIndexC: 41 }, // ~106F danger
    { hour: 15, heatIndexC: 41 }, // ~106F danger
    { hour: 16, heatIndexC: 30 }, // ~86F caution
  ]);

  const worst = findWorstWindow(timeline);

  assert.deepEqual(worst, { startHour: 14, endHour: 15, band: "danger" });
});

test("findWorstWindow returns null when no hour reaches a heat-index band", () => {
  const timeline = buildExposureTimeline([{ hour: 6, heatIndexC: 20 }]);
  assert.equal(findWorstWindow(timeline), null);
});

test("buildAlternatives returns realistic options that never say to stay home or avoid going out", () => {
  const alternatives = buildAlternatives({ startHour: 14, endHour: 15 });

  assert.ok(alternatives.length >= 2);
  for (const alt of alternatives) {
    const lower = alt.toLowerCase();
    assert.ok(!lower.includes("stay home"), `"${alt}" implies staying home`);
    assert.ok(!lower.includes("stay indoors"), `"${alt}" implies staying indoors`);
    assert.ok(!lower.includes("avoid going out"), `"${alt}" implies avoiding going out`);
  }
});

test("buildAlternatives mentions the worst window's start hour", () => {
  const alternatives = buildAlternatives({ startHour: 14, endHour: 15 });
  assert.ok(alternatives.some((alt) => alt.includes("2 PM")));
});
