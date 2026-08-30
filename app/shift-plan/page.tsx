import { buildExposureTimeline, findWorstWindow, buildAlternatives } from "@/lib/shift-plan/index";
import { describeRecovery, OVERNIGHT_RECOVERY_DISCLAIMER } from "@/lib/heat-science/index";
import { getShiftPlanLiveData } from "@/lib/live-data/shift-plan";
import { SNAPSHOT_GENERATED_AT } from "@/lib/live-data/snapshot";
import { ExposureTimeline } from "@/components/heat/ExposureTimeline";

export default function ShiftPlanPage() {
  const scenario = getShiftPlanLiveData();
  const timeline = buildExposureTimeline(scenario.hourlyReadings);
  const worstWindow = findWorstWindow(timeline);
  const alternatives = worstWindow ? buildAlternatives(worstWindow) : [];
  const recovery = describeRecovery(
    scenario.recoveryWindow.hoursBelowThreshold,
    scenario.recoveryWindow.windowHours,
  );

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight">
          The Shift Plan
        </h1>
        <p className="mt-1 text-sm text-mist">
          {scenario.home.label} → {scenario.work.label} · shift{" "}
          {scenario.shiftStartHour % 12 === 0 ? 12 : scenario.shiftStartHour % 12}
          {scenario.shiftStartHour < 12 ? "AM" : "PM"}–
          {scenario.shiftEndHour % 12 === 0 ? 12 : scenario.shiftEndHour % 12}
          {scenario.shiftEndHour < 12 ? "AM" : "PM"} · {scenario.date}
        </p>
      </div>

      <div className="rounded-lg border border-breeze/30 bg-breeze/10 px-4 py-3 text-sm text-breeze">
        <strong>Live-sourced data:</strong> hourly heat index for {scenario.date} is a real,
        one-time FortyGuard env_params pull at a real point on the Canal Street corridor
        (captured {SNAPSHOT_GENERATED_AT}, not re-fetched per page view — see
        lib/live-data/snapshot.ts). The API is history-only — this is current conditions and
        recent trend, never a forecast.
      </div>

      {worstWindow && (
        <section className="rounded-lg border border-border-subtle bg-surface p-4">
          <h2 className="text-sm font-medium text-mist">Worst window today</h2>
          <p className="mt-1 text-lg font-semibold">
            {worstWindow.startHour}:00–{worstWindow.endHour + 1}:00
          </p>
          <h3 className="mt-4 text-sm font-medium text-mist">
            Realistic options — not &ldquo;stay home&rdquo;
          </h3>
          <ul className="mt-2 flex flex-col gap-2">
            {alternatives.map((alt) => (
              <li key={alt} className="text-sm">
                {alt}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-2 text-sm font-medium text-mist">
          Hour-by-hour exposure
        </h2>
        <ExposureTimeline timeline={timeline} />
      </section>

      <section className="rounded-lg border border-border-subtle bg-surface p-4 text-sm">
        <h2 className="text-sm font-medium text-mist">
          Overnight cooling opportunity
        </h2>
        <p className="mt-1">{recovery}</p>
        <p className="mt-2 text-xs italic text-mist">
          {OVERNIGHT_RECOVERY_DISCLAIMER}
        </p>
      </section>
    </div>
  );
}
