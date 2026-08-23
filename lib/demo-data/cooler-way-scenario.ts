import type { StopExposure } from "../heat-dose/index";

export interface DemoStop extends StopExposure {
  lat: number;
  lon: number;
}

export interface DemoRoute {
  name: string;
  stops: DemoStop[];
}

/**
 * ⚠ PLACEHOLDER DEMO DATA — same caveats as shift-plan-scenario.ts.
 * `shadePercent` values are shaped like real streetview segmentation output
 * (tree canopy + shade-structure share) but are hand-authored, not fetched —
 * no streetview credits (~8,600/call, research/api-spike.md) have been spent
 * generating this. Swap in real per-stop segmentation and real stop
 * coordinates once the golden key and corridor are decided.
 */
export const COOLER_WAY_SCENARIO: { routeA: DemoRoute; routeB: DemoRoute } = {
  routeA: {
    name: "Freret St corridor (illustrative)",
    stops: [
      { lat: 29.9295, lon: -90.0938, waitMinutes: 8, heatIndexF: 98, shadePercent: 15 },
      { lat: 29.9339, lon: -90.0951, waitMinutes: 6, heatIndexF: 99, shadePercent: 10 },
      { lat: 29.9383, lon: -90.0964, waitMinutes: 10, heatIndexF: 101, shadePercent: 5 },
      { lat: 29.9427, lon: -90.0977, waitMinutes: 7, heatIndexF: 100, shadePercent: 20 },
    ],
  },
  routeB: {
    name: "St Charles Ave corridor (illustrative)",
    stops: [
      { lat: 29.9285, lon: -90.0918, waitMinutes: 9, heatIndexF: 98, shadePercent: 55 },
      { lat: 29.9333, lon: -90.0955, waitMinutes: 7, heatIndexF: 99, shadePercent: 65 },
      { lat: 29.938, lon: -90.0992, waitMinutes: 8, heatIndexF: 100, shadePercent: 50 },
      { lat: 29.9428, lon: -90.1029, waitMinutes: 6, heatIndexF: 99, shadePercent: 70 },
    ],
  },
};
