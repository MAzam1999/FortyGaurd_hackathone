import { bandSeverity, heatIndexBand } from "../heat-science/index";

/**
 * Heuristic: shade can reduce a stop's effective dose by at most this fraction.
 * First-pass constant, not a cited figure — tune with Ghada/Shamveel once real
 * streetview data is in.
 */
const MAX_SHADE_REDUCTION = 0.6;

export interface StopExposure {
  waitMinutes: number;
  heatIndexF: number;
  /** 0-100, combined tree canopy + shade-structure coverage from streetview segmentation */
  shadePercent: number;
}

/** Cumulative heat dose for one stop: minutes exposed x band severity x shade discount. */
export function stopDose(stop: StopExposure): number {
  const severity = bandSeverity(heatIndexBand(stop.heatIndexF));
  const shadeFactor = 1 - (stop.shadePercent / 100) * MAX_SHADE_REDUCTION;
  return stop.waitMinutes * severity * shadeFactor;
}

export function routeDose(stops: StopExposure[]): number {
  return stops.reduce((total, stop) => total + stopDose(stop), 0);
}

export interface Route {
  name: string;
  stops: StopExposure[];
}

export interface RouteComparison {
  doseA: number;
  doseB: number;
  recommended: string | "tie";
}

/** Scores two route options by cumulative heat dose, not travel time. */
export function compareRoutes(routeA: Route, routeB: Route): RouteComparison {
  const doseA = routeDose(routeA.stops);
  const doseB = routeDose(routeB.stops);
  const recommended = doseA === doseB ? "tie" : doseA < doseB ? routeA.name : routeB.name;
  return { doseA, doseB, recommended };
}
