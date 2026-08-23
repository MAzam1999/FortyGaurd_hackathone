import { test } from "node:test";
import assert from "node:assert/strict";
import {
  celsiusToFahrenheit,
  heatIndexBand,
  workRestTier,
  describeRecovery,
} from "./index";

test("celsiusToFahrenheit converts 0C to 32F", () => {
  assert.equal(celsiusToFahrenheit(0), 32);
});

test("celsiusToFahrenheit converts 100C to 212F", () => {
  assert.equal(celsiusToFahrenheit(100), 212);
});

test("heatIndexBand returns null below the Caution floor (80F)", () => {
  assert.equal(heatIndexBand(79.9), null);
});

test("heatIndexBand returns 'caution' at the 80F floor", () => {
  assert.equal(heatIndexBand(80), "caution");
});

test("heatIndexBand returns 'caution' just under 90F", () => {
  assert.equal(heatIndexBand(89.9), "caution");
});

test("heatIndexBand returns 'extreme_caution' at 90F", () => {
  assert.equal(heatIndexBand(90), "extreme_caution");
});

test("heatIndexBand returns 'danger' at 103F", () => {
  assert.equal(heatIndexBand(103), "danger");
});

test("heatIndexBand returns 'extreme_danger' at 125F", () => {
  assert.equal(heatIndexBand(125), "extreme_danger");
});

test("workRestTier returns 'lower' just under 91F", () => {
  assert.equal(workRestTier(90.9), "lower");
});

test("workRestTier returns 'moderate' at 91F", () => {
  assert.equal(workRestTier(91), "moderate");
});

test("workRestTier returns 'high' at 103F", () => {
  assert.equal(workRestTier(103), "high");
});

test("workRestTier returns 'very_high_extreme' at 115F", () => {
  assert.equal(workRestTier(115), "very_high_extreme");
});

test("describeRecovery reports a near-total recovery deficit", () => {
  assert.equal(
    describeRecovery(1, 24),
    "Only 1 of the last 24 hours dropped below the overnight recovery threshold.",
  );
});

test("describeRecovery reports full recovery", () => {
  assert.equal(
    describeRecovery(24, 24),
    "All 24 of the last 24 hours dropped below the overnight recovery threshold.",
  );
});
