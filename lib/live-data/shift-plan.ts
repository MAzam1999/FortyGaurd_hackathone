import type { HourlyReading } from "../shift-plan/index";
import { SHIFT_PLAN_HOURLY_HEAT_INDEX_C, SNAPSHOT_DATE, SNAPSHOT_LOCATION } from "./snapshot";

// Placeholder corridor — docs/PRD.md §13 item 2 (real corridor still pending
// Shamveel/Ghada's shortlist). Coordinates are real New Orleans points.
export const HOME_LOCATION = { lat: 30.0225, lon: -89.9345, label: "New Orleans East" };
export const WORK_LOCATION = SNAPSHOT_LOCATION;

export interface ShiftPlanLiveData {
  date: string;
  home: typeof HOME_LOCATION;
  work: typeof WORK_LOCATION;
  shiftStartHour: number;
  shiftEndHour: number;
  recoveryWindow: { hoursBelowThreshold: number; windowHours: number };
  hourlyReadings: HourlyReading[];
}

/**
 * Reads the real, one-time FortyGuard snapshot (lib/live-data/snapshot.ts) —
 * see that file for why this isn't a live call on every page render.
 */
export function getShiftPlanLiveData(): ShiftPlanLiveData {
  return {
    date: SNAPSHOT_DATE,
    home: HOME_LOCATION,
    work: WORK_LOCATION,
    shiftStartHour: 9,
    shiftEndHour: 17,
    // Reuses the real, spike-verified figure (research/api-spike.md,
    // 2026-08-23: persistence + direction:'below' on the test corridor)
    // rather than a separate persistence call.
    recoveryWindow: { hoursBelowThreshold: 1, windowHours: 24 },
    hourlyReadings: SHIFT_PLAN_HOURLY_HEAT_INDEX_C,
  };
}
