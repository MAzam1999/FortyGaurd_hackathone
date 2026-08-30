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
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight">
          The Cooler Way There
        </h1>
        <p className="mt-1 text-sm text-mist">
          Same two points, scored by cumulative heat dose — not travel time.
        </p>
      </div>

      <div className="rounded-lg border border-breeze/30 bg-breeze/10 px-4 py-3 text-sm text-breeze">
        <strong>Live-sourced data:</strong> comparing the two real corridors Shamveel identified —
        Canal Street (Route 47/48) and St. Charles Avenue (Route 12). Ambient heat index and
        streetview shade are real, one-time FortyGuard pulls at real points on each corridor
        (captured {SNAPSHOT_GENERATED_AT}, not re-fetched per page view). Every listed stop has its
        own per-stop streetview shade reading — see lib/live-data/snapshot.ts.
      </div>

      <div className="rounded-lg border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember">
        <strong>Dose is a project-defined score</strong>, not a clinical or OSHA heat-stress
        measurement — it combines wait time, heat-index severity, and shade coverage to compare
        routes relative to each other. Shade reduces radiant heat exposure, but we do not claim a
        universal percentage reduction in heat stress.
      </div>

      <section className="rounded-lg border border-border-subtle bg-surface p-4">
        <h2 className="text-sm font-medium text-mist">Recommended</h2>
        <p className="mt-1 text-lg font-semibold">{comparison.recommended}</p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { route: routeA, dose: comparison.doseA },
          { route: routeB, dose: comparison.doseB },
        ].map(({ route, dose }) => (
          <div key={route.name} className="rounded-lg border border-border-subtle bg-surface p-4">
            <h3 className="font-medium">{route.name}</h3>
            <p className="mt-1 text-sm text-mist">
              Total heat dose: <span className="tabular-nums">{Math.round(dose)}</span>
            </p>
            <ul className="mt-3 flex flex-col gap-1 text-sm">
              {route.stops.map((stop, i) => (
                <li key={i} className="flex justify-between">
                  <span>Stop {i + 1}</span>
                  <span className="tabular-nums text-mist">
                    {stop.shadePercent}% shaded · dose {Math.round(stopDose(stop))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-medium text-mist">Map</h2>
        <RouteMap
          routes={[
            { color: "#1b9c8f", stops: routeA.stops },
            { color: "#b06d3a", stops: routeB.stops },
          ]}
        />
      </section>
    </div>
  );
}
