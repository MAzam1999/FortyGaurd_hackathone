// Heat-risk formulas per docs/PRD.md §7. Inputs come from FortyGuard's
// env_params endpoint — never re-derive humidity physics ourselves.
//
// Boundary note: the PRD's source tables give overlapping band edges
// (e.g. Caution "80-90" and Extreme Caution "90-103" both list 90). Treated
// here as half-open intervals — each band owns its lower bound, up to but
// excluding the next band's lower bound. This is our interpretation, not a
// verified NWS/OSHA detail — check it against Ghada's Python notebook once
// the shared test-vector table exists (docs/PRD.md §7 "Validation requirement").

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

/** Recovery threshold used with FortyGuard `persistence` + `direction: 'below'`. */
export const RECOVERY_THRESHOLD_CELSIUS = 26.7;

export type HeatIndexBand = "caution" | "extreme_caution" | "danger" | "extreme_danger" | null;

/** NWS Heat Index bands, docs/PRD.md §7. `heatIndexF` assumes shade/light wind. */
export function heatIndexBand(heatIndexF: number): HeatIndexBand {
  if (heatIndexF >= 125) return "extreme_danger";
  if (heatIndexF >= 103) return "danger";
  if (heatIndexF >= 90) return "extreme_caution";
  if (heatIndexF >= 80) return "caution";
  return null;
}

const BAND_SEVERITY: Record<Exclude<HeatIndexBand, null>, number> = {
  caution: 1,
  extreme_caution: 2,
  danger: 3,
  extreme_danger: 4,
};

/** Numeric severity ranking for a band — 0 for no elevated band. Shared across hero workflows. */
export function bandSeverity(band: HeatIndexBand): number {
  return band === null ? 0 : BAND_SEVERITY[band];
}

export type WorkRestTier = "lower" | "moderate" | "high" | "very_high_extreme";

/**
 * Project screening tiers that mirror NWS Heat Index categories (91/103/115°F
 * ≈ Extreme Caution/Danger/Extreme Danger) — this is NOT an OSHA or NIOSH
 * occupational work/rest schedule. Verified against current guidance in
 * crew-board-science-review.md §4 (decision: keep the ladder as a project
 * screening heuristic, never label it an OSHA/NIOSH requirement). Any UI
 * showing a tier must also show WORK_REST_TIER_DISCLAIMER.
 */
export function workRestTier(heatIndexF: number): WorkRestTier {
  if (heatIndexF >= 115) return "very_high_extreme";
  if (heatIndexF >= 103) return "high";
  if (heatIndexF >= 91) return "moderate";
  return "lower";
}

export const WORK_REST_TIER_DISCLAIMER =
  "Project screening levels — not OSHA/NIOSH work/rest requirements.";

const WORK_REST_GUIDANCE: Record<WorkRestTier, string> = {
  lower: "Basic precautions — water, shade, training.",
  moderate: "Increase water/rest frequency, monitor workers.",
  high: "More frequent breaks, closer supervision.",
  very_high_extreme: "Maximum rest/water, reschedule non-essential work.",
};

export function workRestGuidance(tier: WorkRestTier): string {
  return WORK_REST_GUIDANCE[tier];
}

/**
 * Narrative for the "you don't get to recover overnight" story, from
 * FortyGuard's `persistence` + `direction: 'below'` hours-below-threshold count.
 * This is a project-defined indicator, not an OSHA/CDC recovery standard —
 * see crew-board-science-review.md §7 (decision: keep, with disclosure).
 * Deliberately avoids claiming recovery is "adequate" or "inadequate"; pair
 * with OVERNIGHT_RECOVERY_DISCLAIMER in any UI that shows this.
 */
export function describeRecovery(hoursBelowThreshold: number, windowHours: number): string {
  const qualifier =
    hoursBelowThreshold === windowHours ? `All ${windowHours}` : `Only ${hoursBelowThreshold}`;
  return `${qualifier} of the last ${windowHours} hours dropped below the overnight recovery threshold.`;
}

export const OVERNIGHT_RECOVERY_DISCLAIMER =
  "Project-defined indicator — not an OSHA/CDC medical standard.";
