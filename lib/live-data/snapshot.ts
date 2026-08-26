/**
 * A one-time, real FortyGuard pull — not fabricated, not re-fetched per page
 * view. Generated 2026-08-26 from Muhammad Azam's (golden/demo) key. See
 * scripts/generate-live-snapshot.ts to regenerate.
 *
 * WHY A SNAPSHOT, NOT A LIVE CALL PER PAGE REQUEST: live-tested against the
 * real API (research/api-spike.md addendum, 2026-08-26) — two sequential
 * requests to the same dynamic page each triggered a fresh, full-price API
 * call; an in-process cache did not prevent the second spend, and a real
 * Vercel deployment scales across multiple serverless instances with no
 * shared memory anyway. A checked-in snapshot is the only approach
 * consistent with the fixed 2,000,000-credit budget (docs/PRD.md §5, §8).
 *
 * CORRIDORS: Shamveel's corridor selection (summary.md, provided 2026-08-26)
 * resolved docs/PRD.md §13 item 2 — Canal Street (Route 47/48) and St.
 * Charles Avenue (Route 12) are both existing streetcar lines. Coordinates
 * below are real points on the actual tram ways, confirmed via OpenStreetMap
 * Nominatim, not guessed intersections. The third corridor summary.md names
 * (East–West Bank BRT) is a planned, not-yet-operating line — summary.md is
 * explicit that it needs different treatment (planning narrative, not an
 * operational trip comparison) and is intentionally NOT wired into Hero
 * 1/2 here; see docs/PRD.md for that follow-up decision.
 *
 * FINDING (2026-08-26): env_params heat index appears to snap to a coarse
 * spatial grid, not a true per-point value — Canal St's own reading matches
 * a separate point (Elysian Fields) ~3km away exactly, while St Charles
 * Ave's reading matches a different point (Freret St) ~2km away exactly.
 * Treat ambient heat index as tile-level, not hyper-local; real per-point
 * variation shows up in streetview shade data instead, which clearly does
 * vary (confirmed: one geocoded "St Charles Ave" point returned an INDOOR
 * scene — floor/ceiling/bench — because that exact spot's street-level
 * imagery was captured inside a building; re-pulled from the actual tram-way
 * coordinate instead. Never assume a geocoded address is outdoors.)
 */

export const SNAPSHOT_DATE = "2026-08-25"; // the historical date this data describes
export const SNAPSHOT_GENERATED_AT = "2026-08-26";

export const CANAL_STREET_CORRIDOR = {
  lat: 29.9515669,
  lon: -90.0666808,
  label: "Canal Street corridor (Conti St, CBD/French Quarter — Route 47/48 shared trunk)",
};

export const ST_CHARLES_AVENUE_CORRIDOR = {
  /** Where the ambient reading was taken — CBD/Warehouse District end of the line. */
  ambientPoint: { lat: 29.9437541, lon: -90.0718966, label: "St Charles Ave, CBD/Warehouse District end" },
  /** Where the streetview shade reading was taken — the actual tram way, Uptown. */
  shadePoint: { lat: 29.9275520, lon: -90.1109504, label: "St Charles Streetcar near Burthe St, Uptown" },
  label: "St. Charles Avenue corridor (Route 12)",
};

/**
 * Real env_params hour-range call at CANAL_STREET_CORRIDOR, 06:00-20:00
 * local (GMT-6), 2026-08-25. Temperature input 33°C (required field — the
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

/** Canal Street's own 14:00 reading — same value as the hourly curve above, not a separate call. */
export const CANAL_STREET_AMBIENT_HEAT_INDEX_C =
  SHIFT_PLAN_HOURLY_HEAT_INDEX_C.find((h) => h.hour === 14)!.heatIndexC;

/**
 * Real env_params single-hour readings, 14:00 local, 2026-08-25. Cost: 2,900 credits each.
 */
export const AMBIENT_READINGS = {
  /** Generic outdoor-worksite point (crew-board only — unrelated to the transit corridors above). */
  elysianFields: { heatIndexC: 40.8, wetBulbC: 25.3, relativeHumidityPercent: 63.5 },
  /** Generic outdoor-worksite point (crew-board only — unrelated to the transit corridors above). */
  freretSt: { heatIndexC: 42.5, wetBulbC: 26.2, relativeHumidityPercent: 67.8 },
  /** ST_CHARLES_AVENUE_CORRIDOR.ambientPoint. */
  stCharlesAve: { heatIndexC: 42.5, wetBulbC: 26.2, relativeHumidityPercent: 67.8 },
};

/**
 * Real streetview segmentation. Source: POST /v1/streetview. Cost: 8,600 credits each.
 */
export const STREETVIEW_READINGS = {
  /** CANAL_STREET_CORRIDOR. Dense CBD/French Quarter streetscape — low tree cover as expected. */
  canalStreet: {
    segments: { building: 44.76, sky: 4.95, tree: 2.89, road: 23.34, sidewalk: 2.22, others: 21.84 },
    imageDate: "2014-05-01",
  },
  /** ST_CHARLES_AVENUE_CORRIDOR.shadePoint. Tree-lined Uptown streetscape, as summary.md describes. */
  stCharlesAve: {
    segments: { building: 4.28, sky: 32.24, tree: 17.27, road: 14.65, grass: 28.77, sidewalk: 1.49, car: 0.61, others: 0.69 },
    imageDate: "2025-11-01",
  },
};

/** tree canopy + building/structure shade share — matches PRD §6 Hero 2's definition. */
function shadePercent(segments: Record<string, number>): number {
  return Math.min(100, (segments.tree ?? 0) + (segments.building ?? 0));
}

export const SHADE_PERCENTS = {
  canalStreet: shadePercent(STREETVIEW_READINGS.canalStreet.segments),
  stCharlesAve: shadePercent(STREETVIEW_READINGS.stCharlesAve.segments),
};
