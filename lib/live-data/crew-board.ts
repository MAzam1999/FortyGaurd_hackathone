import { celsiusToFahrenheit } from "../heat-science/index";
import { AMBIENT_READINGS } from "./snapshot";
import type { Workload } from "../crew-board/index";

export interface CrewBoardSiteLiveData {
  name: string;
  heatIndexF: number;
  wetBulbC: number;
  workload: Workload;
}

/** Reads the real, one-time FortyGuard snapshot (lib/live-data/snapshot.ts) — one real reading per worksite. */
export function getCrewBoardLiveData(): CrewBoardSiteLiveData[] {
  return [
    {
      name: "Elysian Fields warehouse build-out",
      heatIndexF: celsiusToFahrenheit(AMBIENT_READINGS.elysianFields.heatIndexC),
      wetBulbC: AMBIENT_READINGS.elysianFields.wetBulbC,
      workload: "heavy",
    },
    {
      name: "Freret St streetscape crew",
      heatIndexF: celsiusToFahrenheit(AMBIENT_READINGS.freretSt.heatIndexC),
      wetBulbC: AMBIENT_READINGS.freretSt.wetBulbC,
      workload: "moderate",
    },
  ];
}
