// Regenerates lib/live-data/snapshot.ts from real FortyGuard calls.
//
// Run deliberately, NOT automatically and NOT per page render — every run
// spends real credits: 4x env_params (~2,900 each) + 3x streetview (~8,600
// each) = ~37,400 total. See lib/live-data/snapshot.ts for why the app reads
// a checked-in snapshot instead of calling the API on every page view.
//
// Corridor points come from Shamveel's corridor selection (summary.md) and
// were confirmed via OpenStreetMap Nominatim against the actual streetcar
// tram ways — do not swap in a geocoded street address without verifying
// it's actually outdoors (one early attempt returned an INDOOR streetview:
// floor/ceiling/bench segments, because that geocode matched a building).
//
// Usage: node --env-file=.env.local --import tsx scripts/generate-live-snapshot.ts
import { FortyGuardClient } from "../lib/fortyguard/client";

const REFERENCE_TEMPERATURE_C = 33;
const REFERENCE_HOUR = "14:00";

const CANAL_STREET_CORRIDOR = { lat: 29.9515669, lon: -90.0666808, label: "Canal Street corridor (Conti St)" };
const ST_CHARLES_AMBIENT_POINT = { lat: 29.9437541, lon: -90.0718966, label: "St Charles Ave (CBD end)" };
const ST_CHARLES_SHADE_POINT = { lat: 29.927552, lon: -90.1109504, label: "St Charles Streetcar near Burthe St" };
// Generic outdoor-worksite points for the Crew Board (unrelated to the transit corridors above).
const ELYSIAN_FIELDS = { lat: 29.9691, lon: -90.0715, label: "Elysian Fields" };
const FRERET_ST = { lat: 29.9295, lon: -90.0938, label: "Freret St" };

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

  console.log(`Fetching hourly curve at ${CANAL_STREET_CORRIDOR.label}...`);
  const hourly = await client.envParams({
    latitude: CANAL_STREET_CORRIDOR.lat,
    longitude: CANAL_STREET_CORRIDOR.lon,
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

  console.log(`Fetching ambient at ${ST_CHARLES_AMBIENT_POINT.label}...`);
  const stCharlesAmbient = await fetchAmbient(client, ST_CHARLES_AMBIENT_POINT.lat, ST_CHARLES_AMBIENT_POINT.lon, date);

  console.log(`Fetching ambient at ${ELYSIAN_FIELDS.label} (crew-board)...`);
  const elysianFieldsAmbient = await fetchAmbient(client, ELYSIAN_FIELDS.lat, ELYSIAN_FIELDS.lon, date);

  console.log(`Fetching ambient at ${FRERET_ST.label} (crew-board)...`);
  const freretStAmbient = await fetchAmbient(client, FRERET_ST.lat, FRERET_ST.lon, date);

  console.log(`Fetching streetview at ${CANAL_STREET_CORRIDOR.label}...`);
  const canalStreetview = await fetchStreetview(client, CANAL_STREET_CORRIDOR.lat, CANAL_STREET_CORRIDOR.lon);

  console.log(`Fetching streetview at ${ST_CHARLES_SHADE_POINT.label}...`);
  const stCharlesStreetview = await fetchStreetview(client, ST_CHARLES_SHADE_POINT.lat, ST_CHARLES_SHADE_POINT.lon);

  const output = `/**
 * A one-time, real FortyGuard pull — not fabricated, not re-fetched per page
 * view. Generated ${today} via scripts/generate-live-snapshot.ts.
 *
 * WHY A SNAPSHOT, NOT A LIVE CALL PER PAGE REQUEST: an in-process cache does
 * not reliably prevent repeat spend across real page views (confirmed live,
 * research/api-spike.md addendum, 2026-08-26) — a real Vercel deployment
 * also scales across multiple serverless instances with no shared memory.
 *
 * CORRIDORS: Canal Street (Route 47/48) and St. Charles Avenue (Route 12)
 * per Shamveel's corridor selection (summary.md). Coordinates are real
 * points on the actual tram ways (OpenStreetMap-confirmed) — do not swap in
 * a geocoded address without verifying it's actually outdoors.
 */

export const SNAPSHOT_DATE = "${date}"; // the historical date this data describes
export const SNAPSHOT_GENERATED_AT = "${today}";

export const CANAL_STREET_CORRIDOR = {
  lat: ${CANAL_STREET_CORRIDOR.lat},
  lon: ${CANAL_STREET_CORRIDOR.lon},
  label: "${CANAL_STREET_CORRIDOR.label} — Route 47/48 shared trunk",
};

export const ST_CHARLES_AVENUE_CORRIDOR = {
  ambientPoint: { lat: ${ST_CHARLES_AMBIENT_POINT.lat}, lon: ${ST_CHARLES_AMBIENT_POINT.lon}, label: "${ST_CHARLES_AMBIENT_POINT.label}" },
  shadePoint: { lat: ${ST_CHARLES_SHADE_POINT.lat}, lon: ${ST_CHARLES_SHADE_POINT.lon}, label: "${ST_CHARLES_SHADE_POINT.label}" },
  label: "St. Charles Avenue corridor (Route 12)",
};

export const SHIFT_PLAN_HOURLY_HEAT_INDEX_C: Array<{ hour: number; heatIndexC: number }> = [
${hourlyEntries.join("\n")}
];

export const CANAL_STREET_AMBIENT_HEAT_INDEX_C =
  SHIFT_PLAN_HOURLY_HEAT_INDEX_C.find((h) => h.hour === 14)!.heatIndexC;

export const AMBIENT_READINGS = {
  elysianFields: ${JSON.stringify(elysianFieldsAmbient)},
  freretSt: ${JSON.stringify(freretStAmbient)},
  stCharlesAve: ${JSON.stringify(stCharlesAmbient)},
};

export const STREETVIEW_READINGS = {
  canalStreet: ${JSON.stringify({ segments: canalStreetview.segments, imageDate: canalStreetview.imageDate })},
  stCharlesAve: ${JSON.stringify({ segments: stCharlesStreetview.segments, imageDate: stCharlesStreetview.imageDate })},
};

/** tree canopy + building/structure shade share — matches PRD §6 Hero 2's definition. */
function shadePercent(segments: Record<string, number>): number {
  return Math.min(100, (segments.tree ?? 0) + (segments.building ?? 0));
}

export const SHADE_PERCENTS = {
  canalStreet: shadePercent(STREETVIEW_READINGS.canalStreet.segments),
  stCharlesAve: shadePercent(STREETVIEW_READINGS.stCharlesAve.segments),
};
`;

  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const outPath = path.resolve(import.meta.dirname, "../lib/live-data/snapshot.ts");
  await fs.writeFile(outPath, output);
  console.log(`Wrote ${outPath}`);
}

main();
