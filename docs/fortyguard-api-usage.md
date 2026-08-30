# FortyGuard API Usage

How Coolcore actually calls the FortyGuard Temperature API — what's used, how, what it costs, and what we learned the hard way. This is the submission's required "documentation of FortyGuard API usage"; it summarizes and links to the deeper, dated research notes rather than duplicating them.

- Client code: [`/lib/fortyguard`](../lib/fortyguard) (`client.ts`, `types.ts`, `errors.ts`)
- Full verified findings, endpoint-by-endpoint: [`research/api-spike.md`](../research/api-spike.md)
- One specific investigation (a transient failure, its resolution, and a real cost/credit trail): [`research/streetview-retry-2026-08-30.md`](../research/streetview-retry-2026-08-30.md)
- What real data is checked into the app and why: [`lib/live-data/snapshot.ts`](../lib/live-data/snapshot.ts)

## Why FortyGuard, and how central it is

Every heat number on the three data-backed hero pages — Shift Plan, Cooler Way There, Crew Board — comes from a real FortyGuard API call, either live (dev/research scripts) or a checked-in snapshot of a real call (production). Nothing is a formula we invented from raw weather data; FortyGuard's `env_params` endpoint is the sole source of heat index, wet-bulb, and humidity, its `streetview` endpoint is the sole source of shade measurements, and its `heatmap` endpoint is the sole source of the overnight-recovery figure. `/lib/heat-science` only classifies and combines those real values (NWS bands, work/rest tiers, dose scoring) — it never re-derives them.

**One disclosed exception — Hero 4, "Ask the Heat Agent."** The stretch agent workflow reasons over hand-authored placeholder scenarios in [`lib/demo-data`](../lib/demo-data), not the snapshot; each of those modules carries a `⚠ PLACEHOLDER DEMO DATA` header saying so, and the page labels its tool list "real output, demo data." Its tool logic and its model calls are real — the heat values it quotes are illustrative. It is the one hero workflow with no FortyGuard call behind it, and it is labelled that way in the product rather than passed off as live.

## Authentication

Every request sends `api-key: <key>` as a header (not `Authorization: Bearer`, which is a common mistake against this API). Base URL: `https://api.fortyguard.com`.

One exception, confirmed against a live call: `POST /v1/system/fetch-api-key-usage` (the free credit-usage check, doesn't consume analysis credits) 422s unless the key is *also* repeated in the request body as `{ "api_key": "..." }` — the header alone isn't enough for that specific endpoint.

## The async submit-and-poll pattern

Every analysis endpoint is asynchronous: `POST` submits a job and returns an `activity_id`; `GET /v1/status/{activity_id}` is polled until a terminal status. Two documented gotchas, both handled in `client.ts`:

1. **The 404-right-after-submit race.** Polling status immediately after a successful submit can 404 — the activity isn't indexed yet, not a real failure. The client treats a 404 during polling as "still pending" and keeps polling rather than surfacing it as an error (`waitForCompletion`, `allow404: true`).
2. **429 rate limiting.** The client backs off using the `Retry-After` header when present, falling back to exponential backoff (capped at 30s) for up to 5 retries before giving up.

The response envelope for every submit/status call is `{ error, status_code, message, data: {...} }` — `activity_id`/`status`/`result` all live under `data`, never at the top level. This wasn't documented anywhere and broke our first client implementation silently (every `submitAndWait`-based endpoint returned `undefined`) until caught against a real live call.

`null` in any response field is treated as genuinely missing data throughout the app — never coerced to `0`. A `0°F` heat index and a "we don't have this reading" are different facts, and conflating them would misrepresent risk.

## Endpoints used

| Endpoint | Used for | Real cost/call | Analytic type |
|---|---|---|---|
| `POST /v1/env_params` | Heat index, wet-bulb, humidity, solar irradiance at a point | ~2,900 credits | — |
| `POST /v1/streetview` | Per-stop shade segmentation (tree/building/sky/road %) | ~8,600 credits | — |
| `POST /v1/heatmap` | Overnight-recovery hours for the Shift Plan (`persistence` + `direction: 'below'`); area heat distribution otherwise | ~4,220 credits | `tcm` / `exceedance` / `persistence` |
| `GET /v1/status/{id}` | Poll for any of the above | free | — |
| `POST /v1/system/fetch-api-key-usage` | Credit-budget tracking (used throughout development, not by the app itself) | free | — |

Two more endpoints exist and are implemented in the client (`satellite`, `heat_intelligence`) but are **not used by any shipped hero workflow** — see Limitations below for why.

### Which hero workflow rests on which endpoint

| Hero workflow | What FortyGuard supplies | Endpoint(s) |
|---|---|---|
| **1 — The Shift Plan** | Hour-by-hour heat index across the shift; overnight recovery hours | `env_params` (hourly range), `heatmap` (`persistence`, `direction: 'below'`) |
| **2 — The Cooler Way There** | Per-stop shade % (tree/building/sky/road) driving the heat-dose score; corridor ambient heat index | `streetview` (one call per stop), `env_params` |
| **3 — The Crew Board** | Per-worksite heat index + wet-bulb, which set the work/rest tier | `env_params` |
| **4 — Ask the Heat Agent** *(stretch)* | *Nothing — placeholder demo scenarios, disclosed above and in the UI* | — |

Wired end to end, that's: [`scripts/generate-live-snapshot.ts`](../scripts/generate-live-snapshot.ts) → [`lib/live-data/snapshot.ts`](../lib/live-data/snapshot.ts) → a per-workflow adapter (`lib/live-data/shift-plan.ts`, `cooler-way.ts`, `crew-board.ts`) → the page.

### `analytic_type` — and the trap FortyGuard's own docs warn about

`heatmap` supports four `analytic_type` values: `tcm` (a point-in-time snapshot), `time_of_measure` (hour of peak), `exceedance` (hours above a threshold), and `persistence` (longest continuous run above a threshold). Picking the wrong one silently gives a confident wrong answer — e.g. `exceedance` counts total hours above a threshold, `persistence` counts the longest *unbroken* run, and those tell very different stories about the same day.

The one genuinely original piece of analysis in this project uses `persistence` with `direction: 'below'` — inverted, this turns a "longest streak above threshold" endpoint into "longest streak *below* an overnight-recovery threshold" (26.7°C / 80°F), which is how the Shift Plan page reports "hours of real overnight cooling relief." That reframing isn't documented anywhere by FortyGuard; it came from reading the parameter semantics carefully rather than assuming. The figure it produced (only **1 of ~24 overnight hours** dropped below the recovery threshold) came from a real `heatmap` call during the API spike on 2026-08-23; `lib/live-data/shift-plan.ts` reuses that verified result rather than re-spending credits on an identical call, and says so inline.

## Known limitations (disclosed in the product, not hidden)

- **No forecast.** The hackathon FAQ claims a 12-hour forecast; live-tested, any future date returns `n_cells: 0`. The API is history-only (2019-01-01 → present). Every workflow's copy was written around this — "current conditions and recent trend," never "your commute in 3 hours."
- **`env_params` heat index appears to snap to a coarse spatial grid**, not a true per-point value — two corridor points ~2–3km apart returned identical readings. Documented in `snapshot.ts`; the app treats ambient heat index as tile-level and relies on `streetview` for genuine per-point variation instead.
- **`heat_intelligence` takes ~117 seconds per call** (measured, not estimated) — far too slow for a live request path. Implemented in the client, gated behind a much longer timeout, but never called from a live user-facing route.
- **`satellite` costs ~14,400 credits/call** — more than streetview or heat_intelligence — and isn't required by any hero workflow, so it's implemented but unused, to avoid scope creep against a fixed credit budget.
- **A submitted job can transiently return `Failed` and succeed identically on retry** — observed directly on 2026-08-30 (two coordinates failed once, then succeeded on the exact same input from two different keys). Not something the client currently retries automatically; documented as a real, confirmed API behavior in `research/streetview-retry-2026-08-30.md` rather than assumed to be "no coverage there."

## Why the deployed app uses a cached snapshot, not live calls per page view

This was tested, not assumed: two sequential requests to the same dynamic page each triggered a fresh, full-price API call — an in-process cache didn't prevent the second charge, and a real Vercel deployment scales across multiple serverless instances with no shared memory to cache against anyway. Given a **fixed 2,000,000-credit budget for the entire hackathon**, live-per-request calls were not viable. `lib/live-data/snapshot.ts` is a real, one-time pull from the golden/demo key, checked into the repo — every hero page reads from it directly. The UI discloses this ("captured 2026-08-26, not re-fetched per page view") rather than presenting cached data as live.

## Real credit spend

All figures below are from actual `fetch-api-key-usage` responses against the designated golden/demo key (Muhammad Azam's), not estimates.

- Verifying all four endpoints once each during client development: **34,340 credits**
- Golden dataset generation (2026-08-26) — hourly `env_params` range + 4 single-hour `env_params` calls + 2 `streetview` calls for the two transit corridors: real, one-time pulls, checked into `snapshot.ts`
- Investigating and resolving a transient streetview failure (2026-08-30) — 2 more `streetview` calls, 17,200 credits, both succeeded, added to `snapshot.ts`
- A verified checkpoint mid-project: **86,140 credits used → 103,340 after** the above retry — **5.2% of the total 2,000,000-credit budget**, comfortably within it

## Reproducing this

```bash
cp .env.example .env.local        # then set FORTYGUARD_API_KEY (gitignored; FORTYGUARD_BASE_URL is optional)

# Free connectivity + credit-balance check. Calls only fetch-api-key-usage —
# never an analysis endpoint, so it costs nothing.
node --env-file=.env.local scripts/smoke-test-fortyguard.mjs

# Regenerates lib/live-data/snapshot.ts from real calls. SPENDS REAL CREDITS
# (~37,400: 4x env_params + 3x streetview). Run deliberately, never in CI,
# never on a page render.
node --env-file=.env.local --import tsx scripts/generate-live-snapshot.ts

npm test                          # client + heat-science unit tests, no network, no credits
```

The client is usable directly for any one-off check:

```ts
import { FortyGuardClient } from "@/lib/fortyguard";

const client = new FortyGuardClient();                 // reads FORTYGUARD_API_KEY
const result = await client.envParams({ /* point + historical date */ });
```

`envParams`, `streetview`, `heatmap`, `satellite`, and `heatIntelligence` all submit and poll to completion internally — the 404 race and 429 backoff are handled inside, so callers get either a result or a thrown `FortyGuardApiError`.

## Where to look for more

- Every confirmed request/response shape, with the exact bug each one caused before it was fixed: [`research/api-spike.md`](../research/api-spike.md) (see the "Addendum — live client verification" section for the most load-bearing findings)
- The client implementation itself, with inline citations back to the finding that justified each design choice: [`lib/fortyguard/client.ts`](../lib/fortyguard/client.ts), [`lib/fortyguard/types.ts`](../lib/fortyguard/types.ts)
