import { celsiusToFahrenheit } from "../heat-science/index";
import { AMBIENT_READINGS, CANAL_STREET_AMBIENT_HEAT_INDEX_C, SHADE_PERCENTS } from "./snapshot";
import type { DemoRoute } from "../demo-data/cooler-way-scenario";

// Real corridors per Shamveel's corridor selection (summary.md, 2026-08-26),
// resolving docs/PRD.md §13 item 2. Stop coordinates are real points on each
// streetcar line (confirmed via OpenStreetMap), not fabricated. Only the two
// listed stops per route have live-fetched data; a real corridor comparison
// only needs the endpoints most riders actually experience (CBD end vs. the
// far end) — see lib/live-data/snapshot.ts for the exact points and costs.
const CANAL_STREET_STOPS = [
  { lat: 29.9515669, lon: -90.0666808, waitMinutes: 8, label: "Conti St (CBD/French Quarter)" },
  { lat: 29.9560991, lon: -90.073429, waitMinutes: 7, label: "Elk Place (Storyville, toward Mid-City split)" },
];
const ST_CHARLES_AVENUE_STOPS = [
  { lat: 29.9437541, lon: -90.0718966, waitMinutes: 9, label: "CBD/Warehouse District end" },
  { lat: 29.927552, lon: -90.1109504, waitMinutes: 6, label: "Uptown, near Burthe St" },
];

function buildRoute(
  name: string,
  stops: typeof CANAL_STREET_STOPS,
  ambientHeatIndexF: number,
  realShadePercent: number,
): DemoRoute {
  return {
    name,
    stops: stops.map((stop) => ({
      lat: stop.lat,
      lon: stop.lon,
      waitMinutes: stop.waitMinutes,
      heatIndexF: ambientHeatIndexF,
      // Real streetview segmentation (lib/live-data/snapshot.ts) was only
      // pulled at one representative point per corridor — ~8,600
      // credits/call. Applied to both listed stops on this route as an
      // Estimate (summary.md §14's term for "inferred, not directly
      // measured at this exact stop") pending per-stop pulls.
      shadePercent: realShadePercent,
    })),
  };
}

/** Reads the real, one-time FortyGuard snapshot (lib/live-data/snapshot.ts) for the two real corridors. */
export function getCoolerWayLiveData(): { routeA: DemoRoute; routeB: DemoRoute } {
  return {
    routeA: buildRoute(
      "Canal Street corridor (Route 47/48)",
      CANAL_STREET_STOPS,
      celsiusToFahrenheit(CANAL_STREET_AMBIENT_HEAT_INDEX_C),
      SHADE_PERCENTS.canalStreet,
    ),
    routeB: buildRoute(
      "St. Charles Avenue corridor (Route 12)",
      ST_CHARLES_AVENUE_STOPS,
      celsiusToFahrenheit(AMBIENT_READINGS.stCharlesAve.heatIndexC),
      SHADE_PERCENTS.stCharlesAve,
    ),
  };
}
