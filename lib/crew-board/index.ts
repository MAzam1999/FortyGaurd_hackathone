import { workRestTier, type WorkRestTier } from "../heat-science/index";

export type Workload = "light" | "moderate" | "heavy";

/**
 * Workload changes a worker's metabolic heat production, not the
 * environmental Heat Index — per crew-board-science-review.md §5 (decision:
 * REMOVE the prior +8°F/−5°F offset entirely; the Heat Index reading must
 * stay unmodified). Workload is shown as its own field and only qualifies
 * the *occupational risk context*, a project heuristic layered on top of the
 * unmodified environmental reading — never folded back into heat_index.
 */
export type OccupationalRiskContext = "baseline" | "increased";

const OCCUPATIONAL_RISK_CONTEXT: Record<Workload, OccupationalRiskContext> = {
  light: "baseline",
  moderate: "baseline",
  heavy: "increased",
};

export const OCCUPATIONAL_RISK_LABEL: Record<OccupationalRiskContext, string> = {
  baseline: "Baseline",
  increased: "Increased",
};

const OCCUPATIONAL_RISK_NOTE: Partial<Record<Workload, string>> = {
  heavy: "Heavy work produces more metabolic heat and may require additional rest/cooling measures.",
};

export function occupationalRiskContext(workload: Workload): OccupationalRiskContext {
  return OCCUPATIONAL_RISK_CONTEXT[workload];
}

export function occupationalRiskNote(workload: Workload): string | null {
  return OCCUPATIONAL_RISK_NOTE[workload] ?? null;
}

export interface WorksiteStatus {
  name: string;
  heatIndexF: number;
  wetBulbC: number;
  workload: Workload;
  tier: WorkRestTier;
  occupationalRiskContext: OccupationalRiskContext;
}

export function buildWorksiteStatus(input: {
  name: string;
  heatIndexF: number;
  wetBulbC: number;
  workload: Workload;
}): WorksiteStatus {
  return {
    ...input,
    tier: workRestTier(input.heatIndexF),
    occupationalRiskContext: occupationalRiskContext(input.workload),
  };
}

/** A shareable, timestamped line a supervisor could paste into a log. */
export function formatLogEntry(status: WorksiteStatus, timestamp: Date): string {
  return `[${timestamp.toISOString()}] ${status.name}: ${status.tier} tier (heat index ${Math.round(status.heatIndexF)}°F, ${status.workload} workload, occupational risk ${OCCUPATIONAL_RISK_LABEL[status.occupationalRiskContext].toLowerCase()})`;
}
