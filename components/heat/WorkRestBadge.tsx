import type { WorkRestTier } from "@/lib/heat-science/index";

const TIER_STYLE: Record<WorkRestTier, string> = {
  lower: "bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-200",
  moderate: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-200",
  high: "bg-orange-100 text-orange-900 dark:bg-orange-900/40 dark:text-orange-200",
  very_high_extreme: "bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-200",
};

const TIER_LABEL: Record<WorkRestTier, string> = {
  lower: "Lower",
  moderate: "Moderate",
  high: "High",
  very_high_extreme: "Very High / Extreme",
};

export function WorkRestBadge({ tier }: { tier: WorkRestTier }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TIER_STYLE[tier]}`}>
      {TIER_LABEL[tier]}
    </span>
  );
}
