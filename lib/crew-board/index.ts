import { workRestTier, type WorkRestTier } from "../heat-science/index";

export type Workload = "light" | "moderate" | "heavy";

/**
 * Heuristic offset representing added metabolic heat load by workload
 * category — not a cited standard. Needs review with Shamveel (occupational
 * heat-safety background) before this goes in front of judges.
 */
const WORKLOAD_ADJUSTMENT_F: Record<Workload, number> = {
  light: -5,
  moderate: 0,
  heavy: 8,
};

export function effectiveHeatIndexF(heatIndexF: number, workload: Workload): number {
  return heatIndexF + WORKLOAD_ADJUSTMENT_F[workload];
}

export function crewWorkRestTier(heatIndexF: number, workload: Workload): WorkRestTier {
  return workRestTier(effectiveHeatIndexF(heatIndexF, workload));
}

export interface WorksiteStatus {
  name: string;
  heatIndexF: number;
  wetBulbC: number;
  workload: Workload;
  tier: WorkRestTier;
}

export function buildWorksiteStatus(input: {
  name: string;
  heatIndexF: number;
  wetBulbC: number;
  workload: Workload;
}): WorksiteStatus {
  return { ...input, tier: crewWorkRestTier(input.heatIndexF, input.workload) };
}

/** A shareable, timestamped line a supervisor could paste into a log. */
export function formatLogEntry(status: WorksiteStatus, timestamp: Date): string {
  return `[${timestamp.toISOString()}] ${status.name}: ${status.tier} tier (heat index ${Math.round(status.heatIndexF)}°F, ${status.workload} workload)`;
}
