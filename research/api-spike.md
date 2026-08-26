# API Spike Findings — `/research/api-spike.md`
**Author:** Ghada Nasser Amin  
**Date:** 2026-08-23  
**Plan confirmed:** Hackathon Plan (2,000,000 total credits · 1,970,140 remaining at time of testing)

---

## Summary (read this first)

| # | Question | Result | Team action |
|---|---|---|---|
| 1 | Plan tier & credits | **Hackathon Plan** · 2M credits total · ~1.97M remaining | Use freely for development; still designate **one golden key** for the demo dataset |
| 1a | `POST /v1/streetview` usable for New Orleans bus stops? | **PASSED ✅** – returns accurate % shares (tree, building, road, sky, car) | **Fully integrate into Hero 2** – real per-stop shade metrics instead of class-based estimates |
| 1b | `POST /v1/heat_intelligence` usable for demo? | **PASSED with latency ⚠️** – PDF downloads successfully · **~117 s (~2 min)** | **Never call live on stage.** Pre-generate & cache PDFs for the 1–2 demo worksites only |
| 1c | Credits pool or per-key? | Not yet confirmed via `fetch-api-key-usage` | Still open – pick one designated golden/demo key today |
| 2 | `/v1/heatmap` over New Orleans AOI | Not explicitly re-tested in this note (assumed usable from other calls) | Proceed; monitor for sparse tiles |
| 3–4 | `exceedance` + `persistence` (`direction: 'below'`) | **PASSED ✅** – precise hourly metrics (units: `'hour'`). Test corridor: ~25 h above 32 °C, only **1 h below 26.7 °C** recovery threshold | Use directly in Hero 1 (Shift Plan) and Hero 3 (Crew Board) for the overnight-recovery narrative |
| 5 | 12-hour forecast | **LIMITATION FOUND ❌** – future dates return empty features (`n_cells: 0`). API serves **history only** (2019 → present) | **Pivot Hero 1 UI copy** from “upcoming shift forecast” → “Current conditions + recent trend analysis”. Seed all demos with recent historical dates |
| 6 | Real credit costs | Heatmap ≈ **4,220** · Streetview ≈ **8,600** · Heat Intelligence ≈ **8,600** | Cache aggressively. Golden dataset should be generated early from one key |
| 7 | Latency | Heat Intelligence ≈ 2 min; others not timed in this note | Live demo must use pre-warmed/cached results; never depend on a cold call |
| 8 | `polygon_aoi` validation | Not flagged as failing | Proceed with real corridor polygons |

---

## Endpoint-by-endpoint detail

### 1a · Streetview Segmentation (`POST /v1/streetview`)
**Status:** PASSED ✅  

Returns usable percentage shares for segments:  
`tree`, `building`, `road`, `sky`, `car` (and related classes).  

**Decision:** Fully integrated into **Hero 2 – The Cooler Way There**.  
We now calculate real stop-level shade metrics from imagery instead of static class estimates from Ride New Orleans aggregates. Class-based fallback remains documented but is no longer the primary path.

### 1b · Heat Intelligence Report (`POST /v1/heat_intelligence`)
**Status:** PASSED with latency note ⚠️  

- Successfully generates and downloads a branded PDF via the SDK.  
- Observed latency: **117.37 seconds (~2 minutes)** per report.  

**Decision:** Do **not** call live during the demo or on stage.  
Pre-generate and cache the PDF reports for the chosen demo worksites only (Hero 3 – Crew Board). Treat as a stretch enhancement that adds “official-feeling” export value.

### 3–4 · Exceedance & Persistence (`analytic_type`)
**Status:** PASSED ✅  

- Returns precise hourly metrics (units: `'hour'`).  
- Test corridor example:  
  - ~**25 hours** over 32 °C  
  - only **1 hour** below the 26.7 °C recovery threshold  

**Decision:** Use directly for Hero 1 (Shift Plan) and Hero 3 (Crew Board) to power the “overnight recovery deficit” narrative. No need to compute these ourselves from repeated `tcm` snapshots.

### 5 · Forecast capability
**Status:** LIMITATION FOUND ❌  

Requesting future dates returns empty coordinate features (`n_cells: 0`).  
The API currently serves **historical data only** (2019-01-01 → present). The 12-hour forecast promised in the hackathon FAQ does **not** work.

**Decision:**  
- Update all Hero 1 UI copy from “Your upcoming shift forecast” → **“Current conditions and recent trend analysis”**.  
- Seed every demo scenario with recent historical dates (not future dates).  
- Be transparent in the pitch and UI about this limitation.

---

## Observed credit costs (per request)

| Endpoint                        | Approx. credits |
|---------------------------------|-----------------|
| Heatmap generation              | ~4,220          |
| Streetview segmentation         | ~8,600          |
| Heat Intelligence report        | ~8,600          |

**Implication:** Cache aggressively. Generate the golden/demo dataset early from **one designated key** so credit usage stays traceable and we do not risk running low mid-hackathon.

---

## Immediate team actions required

1. **Azam** – Update Hero 1 copy and seed data to historical dates only. Build the FortyGuard client against the confirmed working endpoints (`heatmap`, `env_params`, `streetview`, `status`). Treat `heat_intelligence` as a pre-cached stretch path only.
2. **Azam + Ghada** – Designate **one golden/demo API key** today (still open from PRD §5 row 1c / §13). All production demo data must come from that key.
3. **Everyone** – Do not call `heat_intelligence` live in any demo path. Pre-generate the PDFs for the 1–2 chosen worksites.
4. **Shamveel** – When writing the submission summary and pitch, explicitly note the forecast limitation and that we pivoted to current + recent-trend analysis (honest disclosure is preferred by judges).

---

## Next steps for Ghada (Day 1)

- [ ] Confirm credit pooling (org vs per-key) via `POST /v1/system/fetch-api-key-usage` on all three keys.
- [ ] Publish one clean request/response pair for each endpoint we will actually use (`heatmap`, `env_params`, `streetview`, `status`).
- [ ] Start building the golden/cached dataset for the chosen New Orleans corridor(s) once Shamveel shortlists the routes.

---

*This file is the source of truth for all subsequent API work. Do not write application code that touches the FortyGuard API until you have read it.*

---

## Addendum — live client verification (Azam, 2026-08-26)

While wiring `/lib/fortyguard`, direct live calls (via the real TS client, not the official Python SDK) surfaced response-shape bugs in our own client that unit tests hadn't caught, plus new cost data. All fixed in `client.ts`/`types.ts`; noted here since they affect budgeting and anyone integrating against this client.

| Endpoint | Finding | Real credit cost |
|---|---|---|
| `/v1/heatmap` | Response envelope is `{ error, status_code, message, data: { activity_id, status, result } }`, not flat as our client assumed — every `submitAndWait`-based endpoint was silently broken until fixed. `stats_data` shape is also `{ temperature_stats: {...}, overall_temperature_distribution, normal_temperature_distribution, temperature_frequency }`, not `{ minimum, maximum, mean, n_cells }`. | **4,220** (matches original spike figure) |
| `/v1/env_params` | `temperature` is a **required** field (422 without it), not optional. Result is `{ metadata: {...}, locations: [{ lat, lon, elevation, temperature, parameters: { heat_index_celsius: [...], ... }, solar_irradiance }] }` — every parameter is an array over `metadata.timestamps`, not a flat scalar. | **2,900** (new — not in original spike) |
| `/v1/satellite` | Request must nest coordinates as `sat: { latitude, longitude }` plus `date_time` and `granularity` (a bare lat/lon 422s: "should be a valid dictionary or object"). Confirmed against the official quickstart's `satellite_segmentation`. | **14,400** (new — not in original spike; **more expensive than streetview or heat_intelligence**) |
| `/v1/streetview` | Request is `{ latitude, longitude, vertical_angle, horizontal_angle, back_view }` — no `heading`/`date` fields as previously typed. Result nests under `front` (and `back` when `back_view: true`): `{ coordinates, front: { original_image, segments: { tree, building, road, sky, grass, sidewalk, others, ... percentages }, image_legend, segmented_image, image_date } }` — `segments` is a class→percent map, not an array. | **8,600** (matches original spike figure) |

**Budget implication:** satellite is the most expensive analytic type observed so far — 14,400 credits/call, over 3x heatmap. If satellite ends up used anywhere in a hero workflow, budget for it accordingly; it isn't currently required by any hero workflow's confirmed plan (§6).

**Total spent verifying all four endpoints once each: 34,340 / 2,000,000 credits** on the designated golden key (Azam's).