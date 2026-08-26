import { compareRoutes, stopDose } from "@/lib/heat-dose/index";
import { getCoolerWayLiveData } from "@/lib/live-data/cooler-way";
import { SNAPSHOT_GENERATED_AT } from "@/lib/live-data/snapshot";
import { RouteMap } from "@/components/map/RouteMap";

export default function CoolerWayPage() {
  const { routeA, routeB } = getCoolerWayLiveData();
  const comparison = compareRoutes(routeA, routeB);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">The Cooler Way There</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Same two points, scored by cumulative heat dose — not travel time.
        </p>
      </div>

      <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
        <strong>Live-sourced data:</strong> comparing the two real corridors Shamveel identified —
        Canal Street (Route 47/48) and St. Charles Avenue (Route 12). Ambient heat index and
        streetview shade are real, one-time FortyGuard pulls at real points on each corridor
        (captured {SNAPSHOT_GENERATED_AT}, not re-fetched per page view). Shade is measured at one
        representative point per corridor and applied to both listed stops as an <em>Estimate</em>
        (not a per-stop measurement) — see lib/live-data/snapshot.ts.
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
