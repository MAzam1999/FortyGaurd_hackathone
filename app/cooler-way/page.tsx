import { compareRoutes, stopDose } from "@/lib/heat-dose/index";
import { COOLER_WAY_SCENARIO } from "@/lib/demo-data/cooler-way-scenario";
import { RouteMap } from "@/components/map/RouteMap";

export default function CoolerWayPage() {
  const { routeA, routeB } = COOLER_WAY_SCENARIO;
  const comparison = compareRoutes(routeA, routeB);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">The Cooler Way There</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Same two points, scored by cumulative heat dose — not travel time.
        </p>
      </div>

      <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        <strong>Demo data:</strong> stop locations and shade percentages are illustrative
        placeholders, not a live streetview call — no credits spent generating this.
      </div>

      <section className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Recommended</h2>
        <p className="mt-1 text-lg font-semibold">{comparison.recommended}</p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { route: routeA, dose: comparison.doseA },
          { route: routeB, dose: comparison.doseB },
        ].map(({ route, dose }) => (
          <div key={route.name} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <h3 className="font-medium">{route.name}</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Total heat dose: <span className="tabular-nums">{Math.round(dose)}</span>
            </p>
            <ul className="mt-3 flex flex-col gap-1 text-sm">
              {route.stops.map((stop, i) => (
                <li key={i} className="flex justify-between">
                  <span>Stop {i + 1}</span>
                  <span className="tabular-nums text-zinc-500 dark:text-zinc-400">
                    {stop.shadePercent}% shaded · dose {Math.round(stopDose(stop))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">Map</h2>
        <RouteMap
          routes={[
            { color: "#2563eb", stops: routeA.stops },
            { color: "#9333ea", stops: routeB.stops },
          ]}
        />
      </section>
    </div>
  );
}
