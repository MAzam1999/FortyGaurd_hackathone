# Streetview retry — Elk Place & St Charles Ave CBD end (2026-08-30)

**Context:** Cooler Way There's two stop-level streetview pulls (`lib/live-data/cooler-way.ts`) — Elk Place (Canal St, 29.9560991, -90.073429) and St Charles Ave CBD/Warehouse District end (29.9437541, -90.0718966) — both came back `status: "Failed"` when Ghada first tried them on 2026-08-29. Until now, `lib/live-data/snapshot.ts` covered both stops with the corridor's one representative shade reading applied as an estimate, per its own comment ("pending per-stop pulls").

## What we tried

1. **2026-08-29:** Azam wrote `scripts/pull-remaining-stop-streetview.ts`, theorizing the failure meant "no usable street-level imagery at that exact point," and tried small (~30–50m) coordinate nudges instead of the original points.
2. **2026-08-30 (Azam, golden key, nudged Elk Place point only):** nudge still returned `Failed`. One data point, but consistent with "nudging doesn't help."
3. **2026-08-30 (Ghada, her own key):** re-tested the *exact original* coordinates for both stops plus a control point. **All three returned `Completed` on the first attempt**, with real images and segmentation.
4. **2026-08-30 (Azam, golden key):** re-pulled the same two original coordinates to get a traceable, golden-key-sourced reading. Both succeeded, same image dates as Ghada's run (2018-11-01 / 2015-01-01 — same underlying source photos; the two runs' segment percentages differ slightly, which is normal segmentation-model noise, not a different image). Cost: 17,200 credits (2 × 8,600), no failures.

## Conclusion

The original `Failed` status was a **transient API issue**, not missing coverage. The nudge theory was wrong — nudging moved off the actual (working) point. Retrying the original coordinates was the fix.

## Data now in the codebase

Both stops now have real, per-stop streetview data in `lib/live-data/snapshot.ts` (`STREETVIEW_READINGS.elkPlace`, `STREETVIEW_READINGS.stCharlesCbdEnd`) and are wired into `lib/live-data/cooler-way.ts` per-stop — no corridor-wide estimate remains on either route.

- **Elk Place:** normal open-street segmentation (building/sky/road/sidewalk/car), no tree canopy — scored 21.7% shade via the standard tree+building formula.
- **St Charles Ave CBD end:** segmentation returned an **indoor scene** (floor/ceiling/bench/windowpane/chair — a covered streetcar shelter, not open street), confirmed independently by both Ghada's and Azam's runs. The standard tree+building formula doesn't apply to this label set (it would score ~0%, the opposite of reality), so it's set directly to 100% shade with a comment explaining why. **Flagged for Ghada to confirm** this indoor-shelter reading and scoring choice before it's treated as final.

## Not carried into the repo

Ghada's raw test outputs (`test_results.txt`, `testing.ipynb`, ~9MB combined, mostly embedded Base64 images per her own note) were not committed — the numbers relevant to the app are captured above and in `lib/live-data/snapshot.ts` directly.
