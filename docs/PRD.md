# PRD — Heat You Can't Avoid (working title)
FortyGuard Hackathon'26 · Team: Coolcore . Members: Ghada Nasser Amin · Shamveel Mazhar · Muhammad Azam

**Status:** Draft v1 · **Written:** 2026-08-23 · **Deadline:** 2026-08-30, 23:59 GST (UTC+4) — no late submissions

---

## 0. Read this first

- Everything in this document that is a **fact about the world** (Louisiana statistics, law, science thresholds, the FortyGuard API) carries a source. Where I could not live-verify something this session, it's marked **⚠ VERIFY** — treat those as "very likely correct, confirm before it goes in the pitch or the code," not as confirmed.
- Everything that is a **decision** (scope, architecture, task assignment) is a recommendation for the team to accept, change, or veto today. Nothing here is locked.
- **Ghada is currently spiking on the FortyGuard API/data itself** (status, nature, quality). This PRD is written to plug directly into that — Section 5 tells her exactly what to check and where to report it. Everything downstream (scope, architecture, even which hero workflow ships first) bends around what she finds. Don't let the rest of the team build ahead of her findings on Day 0–1.

---

## 1. Deadline math (do this today)

Submission deadline: **Aug 30, 2026, 23:59 GST (UTC+4)**. "No late submissions" per FortyGuard's own FAQ.

| Team member | Local deadline |
|---|---|
| Ghada (Cairo, EEST = UTC+3) | **Aug 30, 22:59** |
| Shamveel & Azam (Pakistan, PKT = UTC+5) | **Aug 31, 00:59** |

**Internal freeze: Aug 29, 20:00 UTC (Aug 30, 01:00 GST).** Submit a working v1 the moment it's deployable — don't wait for "done." FortyGuard's rules let you resubmit; a live link that works beats a better one that's still building at 23:55.

Submission = 3 things, confirmed from the hackathon site: **(1)** public GitHub repo with `fortyguard` added as a collaborator, **(2)** a live website/demo link, **(3)** a written summary. The live-link requirement means deployment is not optional polish — it's a submission requirement from day one.

---

## 2. The problem — reframed with real Louisiana numbers

Standard heat advice says "stay indoors, avoid peak hours." For a large share of Louisiana, especially New Orleans, that's not a real option:

- **17.4% of Orleans Parish households have no vehicle** (27,169 of 155,821), roughly double the Louisiana statewide rate of 8.5%. [US Census ACS 2024 5-yr, tables B25044/B08201]
- **83–85% of RTA bus stops have no shelter.** ("293 of 1,930 stops (15%) have shelters" per the New Orleans Complete Streets Coalition benchmark; a separate stops inventory found 83% lack shelter, 81% lack seating.) People waiting for the bus in New Orleans summer heat are, in the large majority of cases, standing in direct sun. [Ride New Orleans, *State of Transit 2025*]
- **The average Orleans Parish resident can reach only ~33% of regional jobs within 60 minutes by transit** (vs. nearly all by car); residents of New Orleans East, Algiers, and St. Bernard reach under 5%. People with fixed shifts and no car often cannot simply pick a cooler commute time — the bus that gets them to work on time is the one that exists. [Ride New Orleans, *State of Transit 2025*, LODES v8.3 data]
- **7% of Louisiana homes have no AC at all** (~130,000 homes); of the ones that do, many can't afford to run it — Louisiana's census division (West South Central: LA/AR/OK/TX) has the **worst energy-insecurity numbers of any of the 9 US Census divisions**: 34.4% report some energy insecurity, 10.5% kept their home at an unsafe temperature, 7.0% were unable to run AC they own. [EIA RECS 2020]
- **New Orleans has no summer utility-disconnect moratorium.** Protection only triggers "when the National Weather Service issues a heat warning" — episodic, not guaranteed — and Louisiana is one of only 6 states with **no vulnerable-population protection** at all (no medical/elderly/disability carve-out from disconnection). [LIHEAP Clearinghouse, sourced to LPSC General Orders]
- Louisiana has **no state occupational heat standard** (only CA, CO, MD, MN, NV, OR, WA have one) and **no local-preemption law** either (unlike Texas's HB 2127 or Florida's HB 433, which explicitly ban cities from protecting outdoor workers) — meaning New Orleans *could* pass a local heat ordinance and hasn't. The federal OSHA heat rule, proposed Aug 2024, has slipped to a **projected final action of October 2027** — it is not coming to protect anyone this summer or next. [EPI, Aug 2025; Federal Register RIN 1218-AD39 via reginfo.gov, 2026 Unified Agenda]
- Louisiana's outdoor/heat-exposed workforce is large and undercounted for this exact risk: ~151,100 in construction, ~143,300 in manufacturing (incl. petrochemical), ~27,600 in mining/oil & gas extraction. **No public data source tracks heat-illness workers' comp claims in Louisiana at all** — a real, citable measurement gap. [BLS Economy at a Glance, Jul 2026; Louisiana Workforce Commission — absence confirmed by direct search]

**The thesis:** this isn't a knowledge gap ("people don't know it's hot"), it's a *decision-support gap under real constraints* — commute route and mode are often fixed, shift times are fixed, AC access is unreliable, and no institution is currently required to protect these people. A tool that tells someone *when within their actual schedule they're most exposed and which of their real, limited options is measurably less bad* is the product. Nothing here proposes people simply avoid the heat.

---

## 3. Users — three personas, matched to the data above

| Persona | Grounded in | What they need |
|---|---|---|
| **The Transit Commuter** — works fixed hours (retail/hospitality/healthcare shift work), no car, rides RTA | 17.4% carless Orleans households; 83–85% unsheltered stops; only 33% of jobs reachable in 60 min by transit | Which of their 1–2 realistic route/time options exposes them least, and how bad the wait will actually be |
| **The Outdoor Worker / Crew Lead** — construction, landscaping, warehouse/delivery, no state or local heat rule protecting them | 151k construction + 143k manufacturing workers; zero state heat standard; OSHA rule not in effect until ~2027 at earliest | A defensible, real-time work/rest/hydration signal for a crew, since no regulation supplies one |
| **The Home-Bound Resident** — elderly/chronic condition, unreliable or no AC, on a fixed income | 7% no AC statewide; 34.4% energy-insecure in region; no summer disconnect protection | To know when *today* is a "run the AC even if it's expensive" day vs. a day they can safely economize, and when overnight won't cool enough to recover |

We are explicitly **not** building for someone who can choose to stay home tomorrow. That person is already served by every existing weather app.

---

## 4. Scope — Louisiana, New Orleans core

**Demo geography: New Orleans (Orleans Parish).** Rationale: this is where nearly all our verified data lives (transit, energy burden, carless rate), FortyGuard's heatmap endpoint caps AOI at **50 mi² on our confirmed Premium plan** (see §5) — Orleans Parish is ~350 mi², so even on Premium we're working a corridor/multi-neighborhood scale, not the whole city, and New Orleans' data happens to already be corridor-shaped (RTA routes, specific under-shaded stop clusters).

**Primary MVP scenario:** 1–2 real RTA bus corridors through neighborhoods with documented low shelter coverage, plus a small set of representative worksite points (construction/warehouse) for the Crew Board. Baton Rouge / the Baton Rouge–New Orleans industrial corridor ("Cancer Alley," Track 03 territory) is a **stretch scenario only** — do not scope it into the MVP; the 10 mi² cap and time budget don't support a second, 80-mile-long geography.

**Explicitly out of scope for this hackathon (see §8 Don'ts for the hard version of this list):** user accounts/auth, native mobile apps, real-time GPS tracking of a person, medical diagnosis/alerts, anything requiring non-US data.

---

## 5. Ghada's data-quality spike — what to check, why it matters, where it changes the plan

This is running now; treat it as the project's actual Day-0 critical path. Report back against this checklist:

**Plan tier confirmed 2026-08-23: Premium.** All three team members have their own API key. This changes the answer to row 1 below and unlocks rows 1a–1c as new checks — the plan matrix from FortyGuard's docs gives us: **50 mi² max heatmap AOI** (vs. 10 mi²), **all `env_params` per request** (not capped at 3), and access to `satellite`, `streetview`, and `heat_intelligence` — all three of which were previously assumed out of scope. Re-scope §6 and §8 accordingly (done below), but still verify each one actually works before building on it.

**⚠ Credit figure corrected from Ghada's actual key, 2026-08-23:** the real plan is the **"Hackathon Plan" — 2,000,000 total credits** (not 5,000,000/month as earlier estimated from the docs matrix). Design the caching/budget strategy against **2M total for the whole hackathon**, not a monthly refill. Whether that 2M is per-key or pooled across the team's 3 keys is still unconfirmed (row 1c below).

**Ghada's spike (`/research/api-spike.md`) is done as of 2026-08-23 — results below fold the checklist's answers directly into each row.**

| # | Question | Result (2026-08-23) | Team action |
|---|---|---|---|
| 1 | ~~Which plan tier~~ **Confirmed: Premium**, 3 keys held by the team | Real plan is **"Hackathon Plan" — 2M total credits**, not 5M/month | Unlocks `satellite`, `streetview`, `heat_intelligence`, full `env_params`, 50 mi² AOI — budget against 2M total |
| 1a | `POST /v1/streetview` on real New Orleans bus-stop coordinates | **PASSED ✅** — accurate % shares (tree, building, road, sky, car) | **Promoted to primary path for Hero 2** — real per-stop shade metrics replace the class-based estimate (now documented fallback only) |
| 1b | `POST /v1/heat_intelligence` demo-usable? | **PASSED with latency ⚠️** — PDF downloads successfully, but **~117s (~2 min)** per call | **Never call live on stage.** Pre-generate & cache PDFs for the 1–2 chosen demo worksites only (Hero 3 stretch) |
| 1c | Credits pool per-org or per-key? | **Not yet confirmed** — Ghada still needs to run `fetch-api-key-usage` on all 3 keys | Still open — pick one designated golden/demo key today regardless of the answer |
| 2 | `/v1/heatmap` over a real New Orleans polygon | Not explicitly re-tested in this spike; assumed usable from other passing calls | Proceed; monitor for sparse tiles once tested directly |
| 3 | `analytic_type: exceedance`/`persistence` sensible for New Orleans? | **PASSED ✅** — precise hourly metrics (units `'hour'`). Test corridor: ~25h above 32°C | Use directly for Hero 1 + Hero 3's overnight-recovery narrative — no need to compute ourselves |
| 4 | `direction: 'below'` usable overnight-recovery signal? | **PASSED ✅** — test corridor showed only **1h below 26.7°C** recovery threshold | Confirms the "you don't get to recover overnight" story is real in the data |
| 5 | Does the 12-hour forecast work? | **LIMITATION FOUND ❌** — future dates return `n_cells: 0`. API is **history-only, 2019-01-01 → present** (not just capped at 12h — forecast doesn't work at all) | **Pivot Hero 1 UI copy** from "upcoming shift forecast" → **"current conditions + recent trend analysis."** Seed every demo with recent historical dates, never future ones. Disclose this plainly in the pitch (Shamveel) |
| 6 | Real credit cost per call type | **Heatmap ≈ 4,220 · Streetview ≈ 8,600 · Heat Intelligence ≈ 8,600** credits/request | Cache aggressively — at ~8,600/call, streetview/heat_intelligence add up fast against the 2M total. Generate the golden dataset early from one key |
| 7 | Real latency, observed | Heat Intelligence ≈ 2 min; others not timed in this spike | Live demo must use pre-warmed/cached results for heat_intelligence; time the others before relying on a live call on stage |
| 8 | `polygon_aoi` validation | Not flagged as failing | Proceed with real corridor polygons |

**Report format:** a short markdown note in `/research/api-spike.md` (see §9 repo layout) with pass/fail per row above, one example request/response pair per endpoint we'll actually use, and the credit cost observed. This file is the thing the rest of the team reads before writing a single line of app code that touches the API.

---

## 6. Hero workflows

Ranked by build priority. Build 1 fully before starting 2; 3 and 4 are stretch if time allows after 1–2 are solid — judging weights Impact 40% + Technical 35% far above Innovation 15%, so a polished workflow 1–2 beats four half-built ones.

### Hero 1 — "The Shift Plan" *(build first)*
Input: a home location, a work location, a shift start/end time. Output: an hour-by-hour exposure timeline for that specific day using real heat index + persistence/exceedance data for the corridor between them, flagging the worst window(s) and — critically — giving 2–3 *realistic* alternatives within the person's actual constraints (a different but still-arriving-on-time bus, a shift-start negotiation talking point, a specific hour to do an errand that must happen anyway). Never says "stay home."

**⚠ Pivoted 2026-08-23 (spike §5 row 5):** the API is history-only — forecast does not work at all, not even at 12h. All copy must read "current conditions and recent trend" (e.g. "over the last 24–48h") rather than anything implying a future prediction ("your commute in 3 hours," "upcoming shift forecast"). Seed every demo scenario with a recent historical date, never a future one. Be upfront about this in the pitch — it's a disclosed limitation, not a hidden gap.

### Hero 2 — "The Cooler Way There"
Given 2 real RTA route options between the same two points, score each not by travel time but by **cumulative heat dose**: minutes exposed × severity, weighted by whether the stop has shelter. **Now that Premium is confirmed (§5, row 1a), the primary plan is real per-stop shade detection via `POST /v1/streetview` segmentation** (tree canopy / structure vs. open sky at the actual stop coordinates) — a genuine upgrade over guessing "this class of stop is unsheltered" from Ride New Orleans' aggregate reporting. Keep the class-based estimate as the documented fallback if streetview segmentation proves noisy or too slow to run per-stop. Directly demonstrates Track 01's own example, "Cool Route Planner," executed with real imagery-derived shade data instead of just routing.

### Hero 3 — "The Crew Board" *(the "a client would pay for this" surface — weight this for Impact 40%)*
A supervisor-facing view for 1 or more outdoor worksites: current + trend heat index and wet-bulb, workload-category-adjusted work/rest guidance (see §7), and a shareable log — explicitly framed as "the thing OSHA's rule would require by ~2027, available today, for free, because no one is making Louisiana employers do this yet." This is the piece that makes the "genuine real-world value, the kind an actual client would adopt" bar (FortyGuard's own judging language) land hardest. **Stretch enhancement now that Premium is confirmed:** an exportable PDF via `POST /v1/heat_intelligence` for each demo worksite, pre-generated and cached (§5 row 1b — this endpoint is too slow to call live), giving the Crew Board a genuinely "official-feeling" report a real supervisor could hand to their safety officer.

### Hero 4 — "Ask the Heat Agent" *(stretch — Track 06 proof point)*
A conversational surface over the same tools ("is it safer to leave at 3 or 5 today," "compare my two routes," "what's the crew status at the Elysian Fields site") that shows its reasoning/tool calls, not just an answer — this is what makes Track 06 (Agentic AI) legible to judges rather than just claimed.

---

## 7. Heat-science model — what we compute and from what

We compute risk from **inputs FortyGuard's `env_params` endpoint already provides** — do not re-derive humidity physics ourselves; use their `heat_index_celsius`, `wet_bulb_temperature_celsius`, `relative_humidity_percent`, `solar_irradiance`. This keeps FortyGuard's data "central" (a hackathon rule) and removes a whole class of formula bugs.

**NWS Heat Index bands — confirmed live from weather.gov, use exactly as-is:**

| Category | Heat Index (°F) | Effect |
|---|---|---|
| Caution | 80–90 | Fatigue possible with prolonged exposure/activity |
| Extreme Caution | 90–103 | Heat cramps/exhaustion possible |
| Danger | 103–124 | Heat cramps/exhaustion likely, heat stroke possible |
| Extreme Danger | 125+ | Heat stroke highly likely |

Bands assume shade/light wind; direct sun can add up to 15°F — this is our justification for weighting *unsheltered* bus stops and outdoor worksites more severely than the raw heat index alone would.

**Occupational work/rest guidance (Crew Board) — ⚠ VERIFY before hard-coding, high confidence but not live-fetched this session (osha.gov blocked automated fetch):**

| Risk tier | Heat Index | Guidance |
|---|---|---|
| Lower | < 91°F | Basic precautions — water, shade, training |
| Moderate | 91–103°F | Increase water/rest frequency, monitor workers |
| High | 103–115°F | More frequent breaks, closer supervision |
| Very High/Extreme | > 115°F | Maximum rest/water, reschedule non-essential work |

The proposed (not-yet-final) federal OSHA rule's two-tier trigger — **⚠ VERIFY the exact figures against the rule text directly, recall-based**: an "initial heat trigger" around 80°F heat index (water, shade, paid rest breaks, acclimatization) and a "high heat trigger" around 90°F (adds mandatory 15-min breaks every 2 hrs + buddy system). We can cite this as "the standard OSHA has proposed but not yet finalized" — which is itself part of our problem statement (§2).

**Overnight recovery — this is our most original computed metric, not a borrowed standard.** Operationalize via FortyGuard's own `persistence` layer with `direction: 'below'` at a threshold around 26.7°C/80°F overnight: "hours below the recovery threshold" directly from their API. Note: the ~80°F "impaired recovery" figure is **widely referenced in heat-health research but not a single official agency standard** — present it in the UI as "a commonly used recovery threshold," not as an OSHA/CDC number, to stay honest.

**Personal risk modifiers (for framing "The Home-Bound Resident" persona) — ⚠ VERIFY exact CDC wording, recall-based list, directionally solid:** older adults, infants/young children, pregnant people, outdoor workers/athletes, people with chronic conditions, people with low income or no reliable AC access, socially isolated individuals.

**Validation requirement:** every formula above ships with a small, checked-in table of hand-computed test cases (input → expected output) that Ghada's Python notebook and Azam's TypeScript port both must match exactly. This is the cheapest possible defense against a judge finding a heat-math bug live.

---

## 8. Dos and Don'ts

### Do
- Keep every recommendation inside the person's real constraints — a different bus, a shifted errand, a supervisor conversation, running the AC tonight. Never "just don't go out."
- Make FortyGuard's data visibly, undeniably central — every screen should make clear a number came from their API, not a guess.
- Cache aggressively. Credits and latency are both real constraints (§5, rows 6–7); design for a demo that works even if the network hiccups on stage.
- Disclose limitations in the UI when we fall back to cached/estimated data instead of a fresh live call — a small "as of [time]" or "estimated" label costs nothing and protects credibility under judge questioning.
- Cite every statistic in the app and pitch deck the way this document does — judges can and do check sources.
- Keep the three hero workflows demoable in under 3 minutes total; rehearse the demo, don't improvise it live against a possibly-slow API.
- Log real request/response pairs from the actual API into `/research/` as they're discovered — this becomes both documentation and a fallback fixture set.

### Don't
- Never output or imply "stay indoors" / "avoid going outside" as the primary advice — that's the premise we're explicitly rejecting.
- Never use raw air temperature as the displayed risk metric — always heat index or wet-bulb; Louisiana's humidity is the whole point.
- Never request data outside the API's real bounds: **history starts 2019-01-01** (not 2021 as the hackathon page claims — verified from the docs bundle). **Forecast does not work at all (confirmed 2026-08-23, spike §5 row 5)** — future dates return `n_cells: 0`. The API is history-only; never request or design around a future date.
- Never use non-US coordinates anywhere, including in tests or seed data — the API silently returns nothing for them.
- We're confirmed on Premium (§5), so `/v1/satellite`, `/v1/streetview`, and `/v1/heat_intelligence` are available — but don't let that turn into scope creep. `heatmap` + `env_params` must carry the MVP end-to-end on their own; treat satellite/streetview/heat_intelligence strictly as named stretch enhancements (§6 Hero 2/3), never as something a hero workflow depends on to function.
- With 3 separate API keys in play, don't let ad-hoc dev-time calls on personal keys quietly become the thing the demo depends on — the golden/demo dataset (§5 row 1c) must come from one designated, tracked key so credit usage and reproducibility aren't scattered across three accounts.
- Never build user accounts, login, or onboarding flows — zero judging value, real time cost.
- Never scope in Baton Rouge/the industrial corridor as anything but a stretch mention — see §4.
- Never ship a feature whose only live-demo path is a slow, uncached API call — always have a pre-warmed fallback.
- Never silently fabricate a number when real data is thin — label it, don't hide it.
- Never let feature work continue past the internal freeze (§1) chasing "one more thing."

---

## 9. Architecture

Single **Next.js 16 (App Router)** app on **Vercel**, one deploy, one live URL (a submission requirement). This avoids cross-service deploy risk in an 8-day window — no separate backend to keep in sync.

```
/app                     Next.js routes: Shift Plan, Cooler Way There, Crew Board, (Agent)
/lib/fortyguard           FortyGuard API client — auth, submit, poll, error/race handling
/lib/heat-science          TS port of the risk formulas in §7, with the shared test-vector table
/lib/cache                 Cache layer keyed by (lat, lon, hour, analytic_type)
/research
  api-spike.md              Ghada's §5 findings — the project's actual source of truth on the API
  heat-science-notebook/     Ghada's Python validation of the §7 formulas + shared test vectors
  data/                      Golden/cached datasets for the demo corridors (JSON, checked in)
/docs
  PRD.md                    this file
  submission-summary.md      the written summary required at submission
/components/map            MapLibre GL (no API token required) rendering FortyGuard tile data
```

**FortyGuard client (`/lib/fortyguard`)** must implement, per the verified API behavior from research: `api-key` header auth; submit-and-poll against `/v1/status/{activity_id}`; explicit handling of the documented **404-right-after-submit race** (retry, don't fail); bounded polling with backoff on `429`; treating `null` response values as missing, never as zero. Build thin wrappers for all six endpoints (`heatmap`, `env_params`, `satellite`, `streetview`, `heat_intelligence`, `status`) since Premium unlocks all of them, but only `heatmap`/`env_params`/`status` are load-bearing for the MVP — the other three are called from clearly isolated stretch-feature code paths, not the core hero-workflow logic. Model this closely on the one third-party client our research found to be verified-live-correct: `arbonomous/heatwatch-fortyguard` — read its `docs/API_USAGE.md` and client code as a reference before writing ours from scratch. **Do not** reference `0xConsole/thermal-sentinel-agent` — confirmed to use invented, non-working endpoints.

**Heat-science parity:** the TS module in `/lib/heat-science` and Ghada's Python notebook must both be checked against the exact same test-vector table (checked into `/research`), so a formula bug can't silently diverge between the two.

---

## 10. Team assignments — by expertise, not by fairness

### Ghada Nasser Amin — Data & Model
- **Now → Day 1:** API spike (§5) — this blocks everyone else touching the API.
- **Day 1–2:** Build the golden/cached dataset for the chosen New Orleans corridor(s) from real API calls; own `/research/data/`.
- **Day 2–3:** Python notebook implementing and validating the §7 heat-risk formulas against the shared test-vector table; work with Shamveel to sanity-check outputs against real Louisiana conditions, not just formula correctness.
- **Day 3–5:** If time allows, a lightweight forecasting/trend layer using her edge-ML background (short-horizon exceedance/persistence trend, not a heavy model — Innovation is only 15% of the score, don't over-invest here).
- **Throughout:** first reviewer on any UI number that claims to come from real data — she's the one who'll know if it's actually plausible.

### Muhammad Azam — Application, Agent, Deploy
- **Day 0–1:** Repo scaffold, Next.js + Vercel deploy skeleton live immediately (even empty — "live URL" from day one, no last-minute deploy risk); FortyGuard client (`/lib/fortyguard`) built to spec once Ghada's spike confirms plan tier and behavior.
- **Day 2–3:** Hero 1 (Shift Plan) end-to-end, backed by real/cached data.
- **Day 3–4:** Hero 2 (Cooler Way There) + map integration.
- **Day 4–5:** Hero 3 (Crew Board); Hero 4 (Agent) only if 1–3 are solid and time remains.
- **Day 5–7:** Integration, caching/perf pass, deploy hardening, final freeze.

### Shamveel Mazhar — Domain Grounding, Validation, Communication
Not core app code — his real leverage is elsewhere:
- **Day 0–1:** Turn his direct experience (cooling-load optimization project, solar-powered train-cabin AC project, maintenance work on cooling towers/HTM systems, and — notably — his time as a Maintenance Engineer at a **transit** company) into the concrete Louisiana personas and demo scenarios in §3. He is the team's best check on whether a scenario is physically/operationally realistic.
- **Day 2–3:** Sanity-review the §7 thresholds and Crew Board guidance against real occupational heat-safety practice — flag anything that reads as naive to someone who's actually run plant/maintenance operations.
- **Day 3–4:** Own the written summary (`/docs/submission-summary.md`) and pitch deck — his design/event-management background (Director of Design, Career Fair 2024 management) is a direct fit for the Communication 10% criterion and for making the deck itself look good.
- **Day 4–6:** Demo script and rehearsal lead; make sure the 3-minute demo actually lands the "an actual client would adopt this" framing FortyGuard's judges are told to look for.

---

## 11. Judging-weight → priority map

| Criterion | Weight | What satisfies it here |
|---|---|---|
| **Impact & Relevance** | 40% | Real Louisiana data (§2), a named realistic adopter for Crew Board (an LA employer/agency), personas grounded in actual constraints, not hypothetical ones |
| **Technical Execution** | 35% | Correct `analytic_type` usage (no confusing snapshot/exceedance/persistence/time_of_measure — the exact trap FortyGuard warned about), validated heat-science formulas, working async/error handling, a live deployed app |
| **Innovation** | 15% | The `direction: 'below'` overnight-recovery reframing (§7) and the constraint-aware "realistic options" framing (§2) — don't chase novelty beyond this; it's the smallest weight |
| **Communication** | 10% | Shamveel's deck + written summary + rehearsed demo |

---

## 12. Day-by-day plan (Aug 23 → Aug 30)

| Day | Date | Focus |
|---|---|---|
| 0 | Sat Aug 23 (today) | Ghada: API spike underway. Azam: repo + empty deploy live. Shamveel: personas + scenario grounding. Team: agree scope from this PRD. |
| 1 | Sun Aug 24 | Ghada: finish spike, publish `/research/api-spike.md`. Azam: FortyGuard client built to spike's findings. Shamveel: continue persona/scenario work, start deck outline. |
| 2 | Mon Aug 25 | Ghada: golden dataset + start heat-science notebook. Azam: Hero 1 (Shift Plan) build starts. Shamveel: review §7 thresholds against domain experience. |
| 3 | Tue Aug 26 | Ghada: finish notebook + shared test vectors. Azam: Hero 1 complete; Hero 2 starts + map. Shamveel: written summary draft. |
| 4 | Wed Aug 27 | Ghada: optional trend layer if time allows; test `streetview` shade-segmentation quality for Hero 2 (§5 row 1a). Azam: Hero 2 complete (streetview shade detection if 1a passed, else class-based fallback); Hero 3 (Crew Board) starts. Shamveel: pitch deck + demo script. |
| 5 | Thu Aug 28 | Azam: Hero 3 complete; Hero 4 only if ahead of schedule. Ghada + Azam: TS/Python parity check. Shamveel: record/rehearse demo. |
| 6 | Fri Aug 29 | **Freeze feature work by 20:00 UTC.** Full QA pass on all shipped hero workflows. Finalize written summary. Add `fortyguard` as GitHub collaborator. Final deploy. |
| 7 | Sat Aug 30 | Buffer only. Submit well before the deadline (target submitting by early GST daytime, not at 23:59) — leaves margin for any last deploy issue. |

---

## 13. Open questions for the team to resolve today

1. ~~Confirm plan tier~~ **Resolved: Premium, all 3 members have keys (2026-08-23).** ~~Confirm exceedance/persistence/streetview/heat_intelligence behavior~~ **Resolved by Ghada's spike (2026-08-23): all PASSED** (see §5) — `streetview` promoted to primary for Hero 2, `heat_intelligence` confirmed as pre-cache-only stretch for Hero 3, `exceedance`/`persistence`/`direction:'below'` confirmed usable for Hero 1 + 3. **New, not previously anticipated: forecast doesn't work at all** — Hero 1 pivoted to current-conditions-plus-trend (§6). Still open: credit pooling (org vs per-key), and `/v1/heatmap` itself hasn't been explicitly spike-tested yet (§5 row 2).
2. Pick the exact 1–2 RTA corridor(s) / neighborhoods for the MVP — needs a real corridor with documented low shelter coverage; Shamveel + Ghada to shortlist candidates from the Ride New Orleans report once accessible.
3. Decide whether Hero 4 (Agent) is realistically in scope given the 7-day budget, or explicitly cut now rather than discovered as a casualty on Day 5.
4. ~~Who owns the API key~~ **Resolved: each member has their own key.** ~~Which one key is the designated "golden dataset / demo" key~~ **Resolved 2026-08-26: Muhammad Azam's key is the designated golden/demo key.** All cached golden-dataset calls and the final demo run should draw from Azam's key only, so credit usage against the 2M total stays traceable on one account. Who owns Vercel project access is still open.
