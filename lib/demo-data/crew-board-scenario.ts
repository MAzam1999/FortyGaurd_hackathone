import type { Workload } from "../crew-board/index";

/**
 * ⚠ PLACEHOLDER DEMO DATA — same caveats as the other demo-data modules.
 * Hand-authored, not fetched from FortyGuard — no credits spent. Swap for
 * real worksites + live/cached env_params once the golden key is decided.
 */
export const CREW_BOARD_SCENARIO: Array<{
  name: string;
  heatIndexF: number;
  wetBulbC: number;
  workload: Workload;
}> = [
  { name: "Elysian Fields warehouse build-out", heatIndexF: 104, wetBulbC: 27.5, workload: "heavy" },
  { name: "Freret St streetscape crew", heatIndexF: 99, wetBulbC: 26.1, workload: "moderate" },
];
