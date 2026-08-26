// Regenerates lib/live-data/snapshot.ts from real FortyGuard calls.
//
// Run deliberately, NOT automatically and NOT per page render — every run
// spends real credits: 3x env_params (~2,900 each) + 2x streetview (~8,600
// each) = ~26,000 total. See lib/live-data/snapshot.ts for why the app reads
// a checked-in snapshot instead of calling the API on every page view.
//
// Usage: node --env-file=.env.local --import tsx scripts/generate-live-snapshot.ts
import { FortyGuardClient } from "../lib/fortyguard/client";

const REFERENCE_TEMPERATURE_C = 33;
const REFERENCE_HOUR = "14:00";

const ELYSIAN_FIELDS = { lat: 29.9691, lon: -90.0715, label: "Elysian Fields corridor" };
const FRERET_ST = { lat: 29.9295, lon: -90.0938, label: "Freret St" };
const ST_CHARLES_AVE = { lat: 29.9285, lon: -90.0918, label: "St Charles Ave" };

function yesterday(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

async function fetchAmbient(client: FortyGuardClient, lat: number, lon: number, date: string) {
  const result = await client.envParams({
    latitude: lat,
    longitude: lon,
    temperature: REFERENCE_TEMPERATURE_C,
    date_time: { start_date: date, filter_type: 1, start_time: REFERENCE_HOUR },
  });
  const params = result.locations?.[0]?.parameters;
  return {
    heatIndexC: params?.heat_index_celsius?.[0] ?? null,
    wetBulbC: params?.wet_bulb_temperature_celsius?.[0] ?? null,
    relativeHumidityPercent: params?.relative_humidity_percent?.[0] ?? null,
  };
}

async function fetchStreetview(client: FortyGuardClient, lat: number, lon: number) {
  const result = await client.streetview({ latitude: lat, longitude: lon });
  return { segments: result.front?.segments ?? {}, imageDate: result.front?.image_date ?? null };
}

async function main() {
  const client = new FortyGuardClient();
  const date = yesterday();
  const today = new Date().toISOString().slice(0, 10);

  console.log(`Fetching hourly curve for ${date} at ${ELYSIAN_FIELDS.label}...`);
  const hourly = await client.envParams({
    latitude: ELYSIAN_FIELDS.lat,
    longitude: ELYSIAN_FIELDS.lon,
    temperature: REFERENCE_TEMPERATURE_C,
    date_time: { start_date: date, filter_type: 2, start_time: "06:00", end_time: "20:00" },
  });
  const timestamps = hourly.metadata?.timestamps ?? [];
  const heatIndexC = hourly.locations?.[0]?.parameters.heat_index_celsius ?? [];
  const hourlyEntries: string[] = [];
  timestamps.forEach((ts, i) => {
    const v = heatIndexC[i];
    const hourMatch = ts.match(/T(\d{2}):/);
    if (v == null || !hourMatch) return;
    hourlyEntries.push(`  { hour: ${Number(hourMatch[1])}, heatIndexC: ${v} },`);
  });

  console.log(`Fetching ambient reading at ${ELYSIAN_FIELDS.label}...`);
  const elysianFieldsAmbient = await fetchAmbient(client, ELYSIAN_FIELDS.lat, ELYSIAN_FIELDS.lon, date);

  console.log(`Fetching ambient reading at ${FRERET_ST.label}...`);
  const freretStAmbient = await fetchAmbient(client, FRERET_ST.lat, FRERET_ST.lon, date);

  console.log(`Fetching streetview at ${ELYSIAN_FIELDS.label}...`);
  const elysianFieldsStreetview = await fetchStreetview(client, ELYSIAN_FIELDS.lat, ELYSIAN_FIELDS.lon);

  console.log(`Fetching streetview at ${ST_CHARLES_AVE.label}...`);
  const stCharlesStreetview = await fetchStreetview(client, ST_CHARLES_AVE.lat, ST_CHARLES_AVE.lon);

  const output = `/**
 * A one-time, real FortyGuard pull — not fabricated, not re-fetched per page
 * view. Generated ${today} via scripts/generate-live-snapshot.ts. Regenerate
 * with that script once the real corridor is chosen (docs/PRD.md §13 item 2)
 * or the golden dataset build (Ghada, docs/PRD.md §10) supersedes this.
 *
 * WHY A SNAPSHOT, NOT A LIVE CALL PER PAGE REQUEST: an in-process cache does
 * not reliably prevent repeat spend across real page views (confirmed live,
 * research/api-spike.md addendum, 2026-08-26) — a real Vercel deployment
 * also scales across multiple serverless instances with no shared memory.
 */

export const SNAPSHOT_DATE = "${date}"; // the historical date this data describes
export const SNAPSHOT_GENERATED_AT = "${today}";

export const SNAPSHOT_LOCATION = {
  lat: ${ELYSIAN_FIELDS.lat},
  lon: ${ELYSIAN_FIELDS.lon},
  label: "${ELYSIAN_FIELDS.label} (placeholder — pending Shamveel/Ghada's corridor shortlist, docs/PRD.md §13)",
};

export const SHIFT_PLAN_HOURLY_HEAT_INDEX_C: Array<{ hour: number; heatIndexC: number }> = [
${hourlyEntries.join("\n")}
];

export const AMBIENT_READINGS = {
  elysianFields: ${JSON.stringify(elysianFieldsAmbient)},
  /** ${FRERET_ST.label} (${FRERET_ST.lat}, ${FRERET_ST.lon}) — crew-board site 2 / cooler-way routeA. */
  freretSt: ${JSON.stringify(freretStAmbient)},
};

/** Kept for callers that only need the one original reading. */
export const AMBIENT_READING_14H = AMBIENT_READINGS.elysianFields;

export const STREETVIEW_READINGS = {
  /** SNAPSHOT_LOCATION (${ELYSIAN_FIELDS.lat}, ${ELYSIAN_FIELDS.lon}) — cooler-way routeA stop 1. */
  elysianFields: ${JSON.stringify({ segments: elysianFieldsStreetview.segments, imageDate: elysianFieldsStreetview.imageDate })},
  /** ${ST_CHARLES_AVE.label} (${ST_CHARLES_AVE.lat}, ${ST_CHARLES_AVE.lon}) — cooler-way routeB stop 1. */
  stCharlesAve: ${JSON.stringify({ segments: stCharlesStreetview.segments, imageDate: stCharlesStreetview.imageDate })},
};

/** tree canopy + building/structure shade share — matches PRD §6 Hero 2's definition. */
function shadePercent(segments: Record<string, number>): number {
  return Math.min(100, (segments.tree ?? 0) + (segments.building ?? 0));
}

export const SHADE_PERCENTS = {
  elysianFields: shadePercent(STREETVIEW_READINGS.elysianFields.segments),
  stCharlesAve: shadePercent(STREETVIEW_READINGS.stCharlesAve.segments),
};

/** Kept for callers that only need the one original reading. */
export const REAL_SHADE_PERCENT = SHADE_PERCENTS.elysianFields;
`;

  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const outPath = path.resolve(import.meta.dirname, "../lib/live-data/snapshot.ts");
  await fs.writeFile(outPath, output);
  console.log(`Wrote ${outPath}`);
}

main();
