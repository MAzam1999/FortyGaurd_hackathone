import { buildWorksiteStatus, formatLogEntry } from "@/lib/crew-board/index";
import { workRestGuidance } from "@/lib/heat-science/index";
import { CREW_BOARD_SCENARIO } from "@/lib/demo-data/crew-board-scenario";
import { WorkRestBadge } from "@/components/heat/WorkRestBadge";

export default function CrewBoardPage() {
  const now = new Date();
  const worksites = CREW_BOARD_SCENARIO.map((site) => buildWorksiteStatus(site));

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">The Crew Board</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          What OSHA&apos;s proposed heat rule would require by ~2027 — available today, because
          Louisiana has no state occupational heat standard yet.
        </p>
      </div>

      <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        <strong>Demo data:</strong> worksites, heat index, and wet-bulb readings are illustrative
        placeholders — not a live/cached FortyGuard call.
      </div>

      <section className="flex flex-col gap-4">
        {worksites.map((site) => (
          <div key={site.name} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-medium">{site.name}</h2>
              <WorkRestBadge tier={site.tier} />
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {Math.round(site.heatIndexF)}°F heat index · {site.wetBulbC.toFixed(1)}°C wet-bulb ·{" "}
              {site.workload} workload
            </p>
            <p className="mt-2 text-sm">{workRestGuidance(site.tier)}</p>
            <p className="mt-3 rounded bg-zinc-100 px-2 py-1 font-mono text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              {formatLogEntry(site, now)}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
