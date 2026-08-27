import { bandSeverity, heatIndexBand } from "../heat-science/index";

/**
 * Project-defined route-scoring weight, NOT a physiological/OSHA heat-stress
 * reduction figure — per crew-board-science-review.md §6 (decision: REMOVE
 * as a scientific reduction claim; shade's real effect varies with sun
 * angle, wind, canopy type, and duration, so no fixed percentage is
 * defensible as a physical fact). This only scales the app's own relative
 * `stopDose` comparison between routes — it must never be presented to users
 * as "shade reduces heat stress by 60%".
 */
const PROJECT_DEFINED_SHADE_WEIGHT = 0.6;

export interface StopExposure {
  waitMinutes: number;
  heatIndexF: number;
  /** 0-100, combined tree canopy + shade-structure coverage from streetview segmentation */
  shadePercent: number;
}

/**
 * Cumulative heat dose for one stop: minutes exposed x band severity x
 * project-defined shade weighting. This is a relative exposure score for
 * comparing routes, not a clinical or OSHA heat-stress measurement.
 */
export function stopDose(stop: StopExposure): number {
  const severity = bandSeverity(heatIndexBand(stop.heatIndexF));
  const shadeFactor = 1 - (stop.shadePercent / 100) * PROJECT_DEFINED_SHADE_WEIGHT;
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
