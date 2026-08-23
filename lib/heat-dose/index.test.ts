import { test } from "node:test";
import assert from "node:assert/strict";
import { stopDose, routeDose, compareRoutes } from "./index";

test("stopDose with no shade: minutes x band severity", () => {
  // 100F -> extreme_caution -> severity 2
  const dose = stopDose({ waitMinutes: 10, heatIndexF: 100, shadePercent: 0 });
  assert.equal(dose, 20);
});

test("stopDose with full shade reduces dose by the shade-effectiveness factor", () => {
  const dose = stopDose({ waitMinutes: 10, heatIndexF: 100, shadePercent: 100 });
  assert.equal(dose, 8); // 10 * 2 * (1 - 1 * 0.6)
});

test("stopDose is zero when the heat index doesn't reach a risk band", () => {
  const dose = stopDose({ waitMinutes: 30, heatIndexF: 75, shadePercent: 0 });
  assert.equal(dose, 0);
});

test("routeDose sums dose across all stops", () => {
  const total = routeDose([
    { waitMinutes: 10, heatIndexF: 100, shadePercent: 0 }, // 20
    { waitMinutes: 5, heatIndexF: 90, shadePercent: 50 }, // 5 * 2 * (1 - 0.5*0.6) = 7
  ]);
  assert.equal(total, 27);
});

test("compareRoutes recommends the lower-dose route", () => {
  const result = compareRoutes(
    { name: "Route A", stops: [{ waitMinutes: 10, heatIndexF: 100, shadePercent: 100 }] }, // dose 8
    { name: "Route B", stops: [{ waitMinutes: 10, heatIndexF: 100, shadePercent: 0 }] }, // dose 20
  );
  assert.equal(result.recommended, "Route A");
  assert.equal(result.doseA, 8);
  assert.equal(result.doseB, 20);
});

test("compareRoutes reports a tie when doses are equal", () => {
  const result = compareRoutes(
    { name: "Route A", stops: [{ waitMinutes: 10, heatIndexF: 100, shadePercent: 0 }] },
    { name: "Route B", stops: [{ waitMinutes: 10, heatIndexF: 100, shadePercent: 0 }] },
  );
  assert.equal(result.recommended, "tie");
});
