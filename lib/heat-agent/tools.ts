import { buildExposureTimeline, findWorstWindow, buildAlternatives, type WorstWindow } from "../shift-plan/index";
import { describeRecovery, workRestGuidance } from "../heat-science/index";
import { compareRoutes } from "../heat-dose/index";
import { buildWorksiteStatus } from "../crew-board/index";
import { SHIFT_PLAN_SCENARIO } from "../demo-data/shift-plan-scenario";
import { COOLER_WAY_SCENARIO } from "../demo-data/cooler-way-scenario";
import { CREW_BOARD_SCENARIO } from "../demo-data/crew-board-scenario";

/**
 * Tool functions Hero 4 ("Ask the Heat Agent") would call. They currently
 * reason over the same placeholder demo scenarios the other three hero
 * workflows use — no live FortyGuard calls, no location/geocoding input yet.
 * Framework-agnostic on purpose: no AI SDK wired in (no model API key is
 * configured in this project), so this shape can be adapted to whichever
 * provider/tool-calling format gets chosen without rewriting the logic.
 */

export interface ShiftPlanToolResult {
  worstWindow: WorstWindow | null;
  alternatives: string[];
  recoveryNarrative: string;
}

export function shiftPlanTool(): ShiftPlanToolResult {
  const timeline = buildExposureTimeline(SHIFT_PLAN_SCENARIO.hourlyReadings);
  const worstWindow = findWorstWindow(timeline);
  return {
    worstWindow,
    alternatives: worstWindow ? buildAlternatives(worstWindow) : [],
    recoveryNarrative: describeRecovery(
      SHIFT_PLAN_SCENARIO.recoveryWindow.hoursBelowThreshold,
      SHIFT_PLAN_SCENARIO.recoveryWindow.windowHours,
    ),
  };
}

export interface CoolerWayToolResult {
  recommended: string;
  routeAName: string;
  routeBName: string;
  doseA: number;
  doseB: number;
}

export function coolerWayTool(): CoolerWayToolResult {
  const { routeA, routeB } = COOLER_WAY_SCENARIO;
  const comparison = compareRoutes(routeA, routeB);
  return { ...comparison, routeAName: routeA.name, routeBName: routeB.name };
}

export interface CrewBoardToolInput {
  worksiteName?: string;
}

export interface CrewBoardToolResult {
  worksites: Array<{ name: string; tier: string; guidance: string }>;
}

export function crewBoardTool(input: CrewBoardToolInput = {}): CrewBoardToolResult {
  const scenario = input.worksiteName
    ? CREW_BOARD_SCENARIO.filter((site) => site.name === input.worksiteName)
    : CREW_BOARD_SCENARIO;

  return {
    worksites: scenario.map((site) => {
      const status = buildWorksiteStatus(site);
      return { name: status.name, tier: status.tier, guidance: workRestGuidance(status.tier) };
    }),
  };
}

export interface HeatAgentTool {
  name: string;
  description: string;
  run: (input?: never) => unknown;
}

export const HEAT_AGENT_TOOLS: HeatAgentTool[] = [
  {
    name: "get_shift_plan",
    description: "Get today's worst heat-exposure window, realistic alternatives, and the overnight recovery outlook.",
    run: shiftPlanTool as HeatAgentTool["run"],
  },
  {
    name: "compare_routes",
    description: "Compare the two demo transit routes by cumulative heat dose and say which is cooler.",
    run: coolerWayTool as HeatAgentTool["run"],
  },
  {
    name: "get_crew_board",
    description: "Get current work/rest guidance for one or all outdoor worksites.",
    run: crewBoardTool as HeatAgentTool["run"],
  },
];
