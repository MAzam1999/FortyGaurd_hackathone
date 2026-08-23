import { buildExposureTimeline, findWorstWindow, buildAlternatives } from "@/lib/shift-plan/index";
import { describeRecovery } from "@/lib/heat-science/index";
import { SHIFT_PLAN_SCENARIO } from "@/lib/demo-data/shift-plan-scenario";
import { ExposureTimeline } from "@/components/heat/ExposureTimeline";

export default function ShiftPlanPage() {
  const scenario = SHIFT_PLAN_SCENARIO;
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
        <h1 className="text-2xl font-semibold tracking-tight">The Shift Plan</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {scenario.home.label} → {scenario.work.label} · shift{" "}
          {scenario.shiftStartHour % 12 === 0 ? 12 : scenario.shiftStartHour % 12}
          {scenario.shiftStartHour < 12 ? "AM" : "PM"}–
          {scenario.shiftEndHour % 12 === 0 ? 12 : scenario.shiftEndHour % 12}
          {scenario.shiftEndHour < 12 ? "AM" : "PM"} · {scenario.date}
        </p>
      </div>

      <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        <strong>Demo data:</strong> this location, date, and hourly readings are illustrative
        placeholders — not yet a live or cached FortyGuard call. The API is history-only (no
        forecast), so this always shows current conditions and recent trend, never a prediction.
      </div>

      {worstWindow && (
        <section className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Worst window today</h2>
          <p className="mt-1 text-lg font-semibold">
            {worstWindow.startHour}:00–{worstWindow.endHour + 1}:00
          </p>
          <h3 className="mt-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
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
        <h2 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Hour-by-hour exposure
        </h2>
        <ExposureTimeline timeline={timeline} />
      </section>

      <section className="rounded-lg border border-zinc-200 p-4 text-sm dark:border-zinc-800">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Overnight recovery</h2>
        <p className="mt-1">{recovery}</p>
      </section>
    </div>
  );
}
