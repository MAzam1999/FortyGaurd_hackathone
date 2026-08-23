import { bandSeverity, celsiusToFahrenheit, heatIndexBand, type HeatIndexBand } from "../heat-science/index";

export interface HourlyReading {
  hour: number; // 0-23, local time
  heatIndexC: number;
}

export interface TimelineHour {
  hour: number;
  heatIndexF: number;
  band: HeatIndexBand;
}

/** Builds an hour-by-hour exposure timeline from historical/current readings — never forecast. */
export function buildExposureTimeline(readings: HourlyReading[]): TimelineHour[] {
  return readings
    .slice()
    .sort((a, b) => a.hour - b.hour)
    .map(({ hour, heatIndexC }) => {
      const heatIndexF = celsiusToFahrenheit(heatIndexC);
      return { hour, heatIndexF, band: heatIndexBand(heatIndexF) };
    });
}

export interface WorstWindow {
  startHour: number;
  endHour: number;
  band: Exclude<HeatIndexBand, null>;
}

/** Longest contiguous run of hours at the timeline's highest severity band. */
export function findWorstWindow(timeline: TimelineHour[]): WorstWindow | null {
  const peakSeverity = Math.max(0, ...timeline.map((t) => bandSeverity(t.band)));
  if (peakSeverity === 0) return null;

  let best: WorstWindow | null = null;
  let run: { startHour: number; endHour: number; band: Exclude<HeatIndexBand, null> } | null = null;

  const closeRun = () => {
    if (!run) return;
    const bestLength = best ? best.endHour - best.startHour : -1;
    if (run.endHour - run.startHour > bestLength) best = run;
    run = null;
  };

  for (const hour of timeline) {
    if (hour.band !== null && bandSeverity(hour.band) === peakSeverity) {
      if (run) {
        run.endHour = hour.hour;
      } else {
        run = { startHour: hour.hour, endHour: hour.hour, band: hour.band };
      }
    } else {
      closeRun();
    }
  }
  closeRun();

  return best;
}

function formatHour(hour: number): string {
  const normalized = ((hour % 24) + 24) % 24;
  const period = normalized < 12 ? "AM" : "PM";
  const displayHour = normalized % 12 === 0 ? 12 : normalized % 12;
  return `${displayHour} ${period}`;
}

/**
 * Realistic, constraint-aware alternatives for the worst exposure window.
 * Never suggests staying home or avoiding going outside — see docs/PRD.md §8.
 */
export function buildAlternatives(window: { startHour: number; endHour: number }): string[] {
  const range = `${formatHour(window.startHour)}–${formatHour(window.endHour + 1)}`;
  return [
    `If any of your outdoor tasks can move, shift them outside the ${range} window — earlier or later in your shift is measurably less exposed.`,
    `If your route has a bus option that arrives outside ${range}, take that one instead of waiting through the worst of it.`,
    `Ask your supervisor whether your shift start/end can flex by an hour to dodge the ${range} window.`,
  ];
}
