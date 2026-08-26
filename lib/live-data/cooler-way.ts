import { celsiusToFahrenheit } from "../heat-science/index";
import { AMBIENT_READINGS, SHADE_PERCENTS } from "./snapshot";
import type { DemoRoute } from "../demo-data/cooler-way-scenario";

// Same corridors as the placeholder scenario (docs/PRD.md §13 item 2 — real
// corridor still pending Shamveel's shortlist), real street coordinates.
const ROUTE_A_STOPS = [
  { lat: 29.9295, lon: -90.0938, waitMinutes: 8, shadePercent: 15 },
  { lat: 29.9339, lon: -90.0951, waitMinutes: 6, shadePercent: 10 },
  { lat: 29.9383, lon: -90.0964, waitMinutes: 10, shadePercent: 5 },
  { lat: 29.9427, lon: -90.0977, waitMinutes: 7, shadePercent: 20 },
];
const ROUTE_B_STOPS = [
  { lat: 29.9285, lon: -90.0918, waitMinutes: 9, shadePercent: 55 },
  { lat: 29.9333, lon: -90.0955, waitMinutes: 7, shadePercent: 65 },
  { lat: 29.938, lon: -90.0992, waitMinutes: 8, shadePercent: 50 },
  { lat: 29.9428, lon: -90.1029, waitMinutes: 6, shadePercent: 70 },
];

function buildRoute(
  name: string,
  stops: typeof ROUTE_A_STOPS,
  ambientHeatIndexF: number,
  realFirstStopShade: number,
): DemoRoute {
  return {
    name,
    stops: stops.map((stop, i) => ({
      lat: stop.lat,
      lon: stop.lon,
      waitMinutes: stop.waitMinutes,
      heatIndexF: ambientHeatIndexF,
      // Real streetview segmentation (lib/live-data/snapshot.ts) only for
      // each route's first stop — ~8,600 credits/call. Remaining stops keep
      // the documented placeholder shade estimate until Ghada's full golden
      // dataset build covers every stop (docs/PRD.md §10).
      shadePercent: i === 0 ? realFirstStopShade : stop.shadePercent,
    })),
  };
}

/**
 * Reads the real, one-time FortyGuard snapshot (lib/live-data/snapshot.ts).
 * Ambient heat index is the real env_params reading taken AT each route's own
 * first stop. Shade is real streetview segmentation, but only two points were
 * ever pulled (Elysian Fields, St Charles Ave) — routeA's ambient is Freret
 * St's own real reading, but its shade reuses the Elysian Fields streetview
 * (no streetview call was made at Freret St itself); routeB's ambient and
 * shade both come from real readings, just at different nearby points
 * (env_params at Elysian Fields, streetview at St Charles Ave).
 */
export function getCoolerWayLiveData(): { routeA: DemoRoute; routeB: DemoRoute } {
  return {
    routeA: buildRoute(
      "Freret St corridor",
      ROUTE_A_STOPS,
      celsiusToFahrenheit(AMBIENT_READINGS.freretSt.heatIndexC),
      SHADE_PERCENTS.elysianFields,
    ),
    routeB: buildRoute(
      "St Charles Ave corridor",
      ROUTE_B_STOPS,
      celsiusToFahrenheit(AMBIENT_READINGS.elysianFields.heatIndexC),
      SHADE_PERCENTS.stCharlesAve,
    ),
  };
}
