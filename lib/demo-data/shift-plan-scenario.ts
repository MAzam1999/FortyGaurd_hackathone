import type { HourlyReading } from "../shift-plan/index";

/**
 * ⚠ PLACEHOLDER DEMO DATA — not from a live/cached FortyGuard call.
 *
 * Coordinates are illustrative New Orleans East -> CBD locations, not a
 * confirmed corridor (docs/PRD.md §13 item 2 is still open — Shamveel/Ghada
 * haven't shortlisted the real corridor yet). Hourly readings are a
 * hand-authored plausible August curve, NOT fetched from the API — no
 * credits have been spent generating this. Swap this module out once the
 * golden/demo key + real corridor are decided (docs/PRD.md §5 row 1c).
 *
 * The one real number in here is the recovery finding: research/api-spike.md
 * (2026-08-23) verified only 1 of ~24 overnight hours dropped below the
 * 26.7C recovery threshold on Ghada's test corridor — reused here as-is.
 */
export const SHIFT_PLAN_SCENARIO = {
  date: "2026-08-20",
  home: { lat: 30.0225, lon: -89.9345, label: "New Orleans East (illustrative)" },
  work: { lat: 29.9511, lon: -90.0715, label: "CBD / Canal St (illustrative)" },
  shiftStartHour: 9,
  shiftEndHour: 17,
  recoveryWindow: { hoursBelowThreshold: 1, windowHours: 24 }, // verified, research/api-spike.md
  hourlyReadings: [
    { hour: 6, heatIndexC: 27 },
    { hour: 7, heatIndexC: 28 },
    { hour: 8, heatIndexC: 30 },
    { hour: 9, heatIndexC: 32 },
    { hour: 10, heatIndexC: 34 },
    { hour: 11, heatIndexC: 36 },
    { hour: 12, heatIndexC: 39 },
    { hour: 13, heatIndexC: 41 },
    { hour: 14, heatIndexC: 42 },
    { hour: 15, heatIndexC: 41 },
    { hour: 16, heatIndexC: 39 },
    { hour: 17, heatIndexC: 36 },
    { hour: 18, heatIndexC: 33 },
    { hour: 19, heatIndexC: 30 },
    { hour: 20, heatIndexC: 28 },
  ] satisfies HourlyReading[],
};
