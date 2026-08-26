/**
 * A one-time, real FortyGuard pull — not fabricated, not re-fetched per page
 * view. Generated 2026-08-26 from Muhammad Azam's (golden/demo) key via
 * `scripts/generate-live-snapshot.mjs`. Regenerate with that script once the
 * real corridor is chosen (docs/PRD.md §13 item 2) or the golden dataset
 * build (Ghada, docs/PRD.md §10) supersedes this.
 *
 * WHY A SNAPSHOT, NOT A LIVE CALL PER PAGE REQUEST: live-tested against the
 * real API (research/api-spike.md addendum, 2026-08-26) — two sequential
 * requests to the same dynamic page each triggered a fresh, full-price API
 * call; the in-process MemoryCache did not prevent the second spend. Whether
 * that's a Next.js dev-mode render-worker quirk or not, it doesn't matter in
 * production either: a real Vercel deployment scales across multiple
 * serverless instances with no shared memory between them, so an in-memory
 * cache can never reliably stop repeat spend across real page views. A
 * checked-in snapshot, generated once, is the only approach consistent with
 * the fixed 2,000,000-credit budget (docs/PRD.md §5, §8).
 */

export const SNAPSHOT_DATE = "2026-08-25"; // the historical date this data describes
export const SNAPSHOT_GENERATED_AT = "2026-08-26";

export const SNAPSHOT_LOCATION = {
  lat: 29.9691,
  lon: -90.0715,
  label: "Elysian Fields corridor (placeholder — pending Shamveel/Ghada's corridor shortlist, docs/PRD.md §13)",
};

/**
 * Real env_params hour-range call, 06:00-20:00 local (GMT-6), 2026-08-25.
 * Source: POST /v1/env_params, temperature input 33°C (required field — the
 * API has no historical surface-air-temperature source of its own; humidity/
 * solar/cloud data driving the hour-to-hour variation is real). Cost: 2,900 credits.
 */
export const SHIFT_PLAN_HOURLY_HEAT_INDEX_C: Array<{ hour: number; heatIndexC: number }> = [
  { hour: 6, heatIndexC: 52 },
  { hour: 7, heatIndexC: 49.7 },
  { hour: 8, heatIndexC: 47.7 },
  { hour: 9, heatIndexC: 46.4 },
  { hour: 10, heatIndexC: 45.2 },
  { hour: 11, heatIndexC: 44.4 },
  { hour: 12, heatIndexC: 42.9 },
  { hour: 13, heatIndexC: 40.7 },
  { hour: 14, heatIndexC: 40.8 },
  { hour: 15, heatIndexC: 40.3 },
  { hour: 16, heatIndexC: 40.3 },
  { hour: 17, heatIndexC: 40.3 },
  { hour: 18, heatIndexC: 50.9 },
  { hour: 19, heatIndexC: 50.7 },
  { hour: 20, heatIndexC: 52.1 },
];

/**
 * Real env_params single-hour calls, 14:00 local, 2026-08-25. Cost: 2,900 credits each.
 */
export const AMBIENT_READINGS = {
  elysianFields: { heatIndexC: 40.8, wetBulbC: 25.3, relativeHumidityPercent: 63.5 },
  /** Freret St (29.9295, -90.0938) — crew-board site 2 / cooler-way routeA. */
  freretSt: { heatIndexC: 42.5, wetBulbC: 26.2, relativeHumidityPercent: 67.8 },
};

/** Kept for callers that only need the one original reading. */
export const AMBIENT_READING_14H = AMBIENT_READINGS.elysianFields;

/**
 * Real streetview segmentation. Source: POST /v1/streetview. Cost: 8,600 credits each.
 */
export const STREETVIEW_READINGS = {
  /** SNAPSHOT_LOCATION (29.9691, -90.0715) — cooler-way routeA stop 1. */
  elysianFields: {
    segments: { building: 15.19, sky: 33, tree: 7.84, road: 33.38, grass: 3.39, sidewalk: 4.33, others: 2.87 },
    imageDate: "2025-09-01",
  },
  /** St Charles Ave (29.9285, -90.0918) — cooler-way routeB stop 1. */
  stCharlesAve: {
    segments: { building: 2.86, sky: 34.64, tree: 14.78, road: 26.95, grass: 17.57, car: 2.84, others: 0.36 },
    imageDate: "2025-11-01",
  },
};

/** tree canopy + building/structure shade share — matches PRD §6 Hero 2's definition. */
function shadePercent(segments: Record<string, number>): number {
  return Math.min(100, (segments.tree ?? 0) + (segments.building ?? 0));
}

export const SHADE_PERCENTS = {
  elysianFields: shadePercent(STREETVIEW_READINGS.elysianFields.segments),
  stCharlesAve: shadePercent(STREETVIEW_READINGS.stCharlesAve.segments),
};

/** Kept for callers that only need the one original reading. */
export const REAL_SHADE_PERCENT = SHADE_PERCENTS.elysianFields;
