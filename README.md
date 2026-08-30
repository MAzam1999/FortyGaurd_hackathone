# Coolcore — Heat You Can't Avoid

A heat-exposure decision-support app for people who can't just "stay indoors" — transit-dependent commuters, outdoor workers, and residents without reliable AC in Louisiana, with New Orleans as the primary demo area.

Built for the **FortyGuard Hackathon '26** by Team Coolcore. Live at **[coolcore.vercel.app](https://coolcore.vercel.app)**.

## The problem

Most heat advice assumes you can reorganize your day around the weather: stay in, work from home, run the AC, drive instead of wait for a bus. That doesn't hold for a lot of people — a fixed-shift worker with no car, an outdoor crew that has to show up regardless of heat index, a resident whose AC can't keep up overnight.

Coolcore doesn't tell people to avoid the heat. It helps them make the **least-exposed choice that still fits their real constraints** — using real heat index, wet-bulb, exceedance/persistence, and street-level shade data from the [FortyGuard](https://fortyguard.com) API, not guesses.

## The four workflows

| Workflow | Route | What it does |
|---|---|---|
| **The Shift Plan** | `/shift-plan` | Hour-by-hour exposure timeline for a commute + shift, flagging the worst window and giving realistic alternatives (a different bus, a shift-start talking point, a specific hour to run an errand) |
| **The Cooler Way There** | `/cooler-way` | Scores two real transit route options by cumulative heat dose — minutes exposed × severity, weighted by real per-stop shade from FortyGuard streetview segmentation — instead of by travel time |
| **The Crew Board** | `/crew-board` | Supervisor-facing view for outdoor worksites: live heat index/wet-bulb trend, workload-adjusted work/rest guidance, and a shareable log |
| **Ask the Heat Agent** | `/ask-agent` | A conversational agent over the same underlying tools ("is it safer to leave at 3 or 5", "compare my two routes") that shows its reasoning and tool calls, not just an answer |

None of these ever recommend "stay home" — every recommendation stays inside the person's actual constraints. Every number on screen traces back to a real FortyGuard API call (live or cached), never a fabricated estimate.

A known, deliberate limitation: FortyGuard's API is **history-only** (2019-01-01 → present, no forecast), so every workflow is framed as "current conditions and recent trend," never a prediction.

## Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **[MapLibre GL](https://maplibre.org)** for route/corridor maps (no API token required)
- **[FortyGuard API](https://fortyguard.com)** — heatmap, env_params, exceedance/persistence, streetview segmentation, heat_intelligence
- **OpenRouter** (DeepSeek, free tier) — powers Ask the Heat Agent
- Deployed on **Vercel**

## Architecture

```
/app                  Next.js routes — Shift Plan, Cooler Way There, Crew Board, Ask the Heat Agent
/lib/fortyguard        FortyGuard API client: api-key auth, submit-and-poll, 404-race + 429-backoff handling
/lib/heat-science       Risk formulas (NWS heat index bands, work/rest tiers, overnight recovery),
                        checked against the same test-vector table as the Python notebook
/lib/heat-dose          Cumulative heat-dose scoring for route comparison (Cooler Way There)
/lib/shift-plan         /lib/crew-board       /lib/heat-agent    Per-workflow business logic
/lib/cache              Cache layer keyed by (lat, lon, hour, analytic_type)
/lib/live-data          Live + cached data assembly per hero workflow
/lib/demo-data          Seeded demo scenarios (always recent historical dates, US coordinates only)
/components/heat        UI: exposure timeline, heat badges, work/rest badges, agent chat
/components/map         MapLibre route rendering
/research               API spike findings, heat-science validation notebook, shared test vectors
/docs/PRD.md            Living project plan
```

Single Next.js app, one Vercel deploy, one live URL — no separate backend to keep in sync.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables (`.env.local`)

| Variable | Required for | Notes |
|---|---|---|
| `FORTYGUARD_API_KEY` | All four hero workflows | Sent as an `api-key` header, not `Authorization`. Get one from FortyGuard. |
| `OPENROUTER_API_KEY` | Ask the Heat Agent only | Free-tier DeepSeek via [openrouter.ai/keys](https://openrouter.ai/keys) |

### Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # run the production build
npm run lint     # eslint
npm test         # run all lib/**/*.test.ts unit tests (node --test + tsx)
```

## Data integrity

- `null` from the API always means "missing" — never coerced to `0`.
- Heat risk is always shown as heat index or wet-bulb temperature, never raw air temperature (humidity is the whole point in Louisiana).
- Every formula in `/lib/heat-science` is checked against the same hand-computed test-vector table (`/research/test-vectors`) used to validate the companion Python notebook, so the TypeScript and Python implementations can't silently diverge.
- Cached/estimated values are labeled as such in the UI rather than presented as fresh live data.

## Team Coolcore

| Member | Focus |
|---|---|
| **Ghada Nasser Amin** | Data & model — API spike, golden dataset, heat-science validation notebook |
| **Shamveel Mazhar** | Domain grounding, occupational-heat-safety review, written summary, pitch/demo |
| **Muhammad Azam** | Application, FortyGuard client, agent, deployment |

See [`docs/PRD.md`](docs/PRD.md) for the full project plan and [`research/api-spike.md`](research/api-spike.md) for verified FortyGuard API findings.
