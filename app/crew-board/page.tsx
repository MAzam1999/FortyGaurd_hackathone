import {
  buildWorksiteStatus,
  formatLogEntry,
  occupationalRiskNote,
  OCCUPATIONAL_RISK_LABEL,
} from "@/lib/crew-board/index";
import { workRestGuidance, WORK_REST_TIER_DISCLAIMER } from "@/lib/heat-science/index";
import { getCrewBoardLiveData } from "@/lib/live-data/crew-board";
import { SNAPSHOT_GENERATED_AT } from "@/lib/live-data/snapshot";
import { WorkRestBadge } from "@/components/heat/WorkRestBadge";

export default function CrewBoardPage() {
  const now = new Date();
  const worksites = getCrewBoardLiveData().map((site) => buildWorksiteStatus(site));

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight">
          The Crew Board
        </h1>
        <p className="mt-1 text-sm text-mist">
          What OSHA&apos;s proposed heat rule would require by ~2027 — available today, because
          Louisiana has no state occupational heat standard yet.
        </p>
      </div>

      <div className="rounded-lg border border-breeze/30 bg-breeze/10 px-4 py-3 text-sm text-breeze">
        <strong>Live-sourced data:</strong> heat index and wet-bulb are real, one-time FortyGuard
        env_params pulls at each worksite&apos;s own location (captured {SNAPSHOT_GENERATED_AT}, not
        re-fetched per page view). Worksite locations are placeholders pending the team&apos;s final
        corridor pick; workload category is a domain assignment, not API data.
      </div>

      <div className="rounded-lg border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember">
        <strong>{WORK_REST_TIER_DISCLAIMER}</strong> Heat Index is a screening indicator —
        occupational heat risk also depends on workload, acclimatization, clothing/PPE, radiant
        heat, air movement, and access to cooling. This board supports, but does not replace,
        site-specific heat-safety procedures.
      </div>

      <section className="flex flex-col gap-4">
        {worksites.map((site) => (
          <div key={site.name} className="rounded-lg border border-border-subtle bg-surface p-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-medium">{site.name}</h2>
              <WorkRestBadge tier={site.tier} />
            </div>
            <p className="mt-1 text-sm text-mist">
              {Math.round(site.heatIndexF)}°F heat index · {site.wetBulbC.toFixed(1)}°C wet-bulb ·{" "}
              {site.workload} workload · occupational risk: {OCCUPATIONAL_RISK_LABEL[site.occupationalRiskContext]}
            </p>
            <p className="mt-2 text-sm">{workRestGuidance(site.tier)}</p>
            {occupationalRiskNote(site.workload) && (
              <p className="mt-1 text-sm text-mist">
                {occupationalRiskNote(site.workload)}
              </p>
            )}
            <p className="mt-3 rounded bg-background px-2 py-1 font-mono text-xs text-mist">
              {formatLogEntry(site, now)}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
