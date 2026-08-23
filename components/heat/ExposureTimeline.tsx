import type { TimelineHour } from "@/lib/shift-plan/index";
import { HeatBadge } from "./HeatBadge";

function formatHour(hour: number): string {
  const period = hour < 12 ? "AM" : "PM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour} ${period}`;
}

export function ExposureTimeline({ timeline }: { timeline: TimelineHour[] }) {
  return (
    <ol className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
      {timeline.map((hour) => (
        <li key={hour.hour} className="flex items-center justify-between gap-4 py-2">
          <span className="w-16 shrink-0 text-sm text-zinc-500 dark:text-zinc-400">{formatHour(hour.hour)}</span>
          <span className="w-16 shrink-0 text-sm tabular-nums">{Math.round(hour.heatIndexF)}°F</span>
          <span className="flex-1 text-right">
            <HeatBadge band={hour.band} />
          </span>
        </li>
      ))}
    </ol>
  );
}
