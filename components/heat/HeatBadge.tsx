import type { HeatIndexBand } from "@/lib/heat-science/index";

const BAND_STYLE: Record<Exclude<HeatIndexBand, null>, string> = {
  caution: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-200",
  extreme_caution: "bg-orange-100 text-orange-900 dark:bg-orange-900/40 dark:text-orange-200",
  danger: "bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-200",
  extreme_danger: "bg-purple-200 text-purple-950 dark:bg-purple-900/50 dark:text-purple-200",
};

const BAND_LABEL: Record<Exclude<HeatIndexBand, null>, string> = {
  caution: "Caution",
  extreme_caution: "Extreme Caution",
  danger: "Danger",
  extreme_danger: "Extreme Danger",
};

export function HeatBadge({ band }: { band: HeatIndexBand }) {
  if (band === null) {
    return (
      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
        Below caution
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${BAND_STYLE[band]}`}>
      {BAND_LABEL[band]}
    </span>
  );
}
