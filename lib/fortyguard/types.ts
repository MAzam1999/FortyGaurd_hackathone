// Shapes verified against research/api-spike.md and the official quickstart
// (https://github.com/FortyGuard-Tech/temperature-api-quickstart). Fields not
// explicitly confirmed are typed loosely (unknown / index signature) rather
// than guessed precisely.

export interface GeoJsonPolygonAoi {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties?: Record<string, unknown>;
    geometry: {
      type: "Polygon";
      coordinates: number[][][];
    };
  }>;
}

/** 1=single hour, 2=hour range, 3=single day, 4=day range */
export type DateTimeFilterType = 1 | 2 | 3 | 4;

export interface DateTimeFilter {
  start_date: string; // YYYY-MM-DD, history only: 2019-01-01 -> present, no future dates
  filter_type: DateTimeFilterType;
  start_time?: string; // HH:MM — required for filter_type 1/2
  end_time?: string; // required for filter_type 2
  end_date?: string; // required for filter_type 4
}

/** tcm=snapshot, time_of_measure=peak hour, exceedance/persistence=duration metrics */
export type AnalyticType = "tcm" | "time_of_measure" | "exceedance" | "persistence";
export type Granularity = 60 | 80 | 100;
export type ThresholdDirection = "above" | "below";

export interface HeatmapRequest {
  polygon_aoi: GeoJsonPolygonAoi;
  date_time: DateTimeFilter;
  granularity: Granularity;
  analytic_type: AnalyticType;
  /** required for exceedance/persistence */
  threshold?: number;
  /** persistence only; 'below' inverts into an overnight-recovery metric */
  direction?: ThresholdDirection;
}

export interface HeatmapDistribution {
  x_axis: number[];
  y_axis: number[];
}

/** Confirmed 2026-08-26 against a live call — no `n_cells`; cell count comes from `map_data.features.length`. */
export interface HeatmapStats {
  temperature_stats: {
    minimum: number | null;
    maximum: number | null;
    mean: number | null;
    standard_deviation: number | null;
  };
  overall_temperature_distribution: number[];
  normal_temperature_distribution: HeatmapDistribution;
  temperature_frequency: HeatmapDistribution;
  [key: string]: unknown;
}

export interface HeatmapResult {
  map_data: {
    type: "FeatureCollection";
    features: Array<{
      type: "Feature";
      properties: {
        average_temperature: number | null;
        min_temperature: number | null;
        max_temperature: number | null;
        [key: string]: unknown;
      };
      geometry: unknown;
    }>;
  };
  stats_data: HeatmapStats;
}

export interface EnvParamsRequest {
  latitude: number;
  longitude: number;
  /** Required — confirmed 2026-08-26 live (422 "Field 'temperature' is required." without it). */
  temperature: number;
  date_time: DateTimeFilter;
  /** Basic plan caps this at 3; Premium (this team's plan) returns all */
  analysis?: string[];
}

/** Confirmed 2026-08-26 against a live call — one entry per requested location, each parameter an array over `metadata.timestamps`. */
export interface EnvParamsLocation {
  lat: number;
  lon: number;
  elevation: number | null;
  temperature: number | null;
  parameters: {
    heat_index_celsius?: (number | null)[];
    wet_bulb_temperature_celsius?: (number | null)[];
    relative_humidity_percent?: (number | null)[];
    apparent_temperature_celsius?: (number | null)[];
    [analysisKey: string]: (number | null)[] | undefined;
  };
  solar_irradiance?: {
    clear_sky: { ghi: number | null; dni: number | null; dhi: number | null };
    description?: string;
  };
}

export interface EnvParamsResult {
  metadata: {
    timezone: string;
    timezone_offset_hours: number;
    time_range: { start: string; end: string; interval: string; count: number };
    timestamps: string[];
  };
  locations: EnvParamsLocation[];
}

/**
 * Confirmed 2026-08-26 against the official quickstart (fortyguard/client.py,
 * street_view_segmentation) — no `heading`/`date` fields; angles + back_view instead.
 */
export interface StreetviewRequest {
  latitude: number;
  longitude: number;
  vertical_angle?: number; // default 0.0
  horizontal_angle?: number; // default 0.0
  back_view?: boolean; // default false
}

/** Class name -> percent share of the frame (e.g. 'tree', 'building', 'road', 'sky', 'grass', 'sidewalk', 'others'). */
export type StreetviewSegments = Record<string, number>;

export interface StreetviewView {
  original_image: string; // base64
  segments: StreetviewSegments;
  image_legend: Record<string, [number, number, number]>; // class -> RGB
  segmented_image: string; // base64
  image_date: string;
}

/** Confirmed 2026-08-26 against a live call — result is nested under `front` (and `back` when `back_view: true`), not flat. */
export interface StreetviewResult {
  coordinates: { latitude: number; longitude: number };
  front: StreetviewView;
  back?: StreetviewView;
}

/**
 * Public shape kept flat (matches streetview/heat_intelligence) — the client
 * wraps `latitude`/`longitude` into the wire-level `sat: { latitude, longitude }`
 * object, per the official quickstart (fortyguard/client.py, satellite_segmentation),
 * confirmed 2026-08-26: a bare `sat` string/lat-lon pair 422s ("should be a valid
 * dictionary or object").
 */
export interface SatelliteRequest {
  latitude: number;
  longitude: number;
  date_time: DateTimeFilter;
  granularity?: Granularity;
}

export type SatelliteResult = Record<string, unknown>;

export type HeatIntelligenceAnalysisCategory =
  | "geographic"
  | "environmental"
  | "urban"
  | "events"
  | "anthropogenic";

export interface HeatIntelligenceRequest {
  latitude: number;
  longitude: number;
  temperature?: number;
  date: string;
  analysis: HeatIntelligenceAnalysisCategory[];
}

export interface HeatIntelligenceResult {
  download_link: string;
  [key: string]: unknown;
}

export interface ApiKeyUsageResult {
  credit_summary?: {
    total_available_credits: number | null;
    total_credits_used: number | null;
    total_remaining_credits: number | null;
    cycle_credits_used: number | null;
    cycle_remaining_credits: number | null;
    cycle_usage_percentage: number | null;
  };
  activity_breakdown?: Array<{ name: string; credits: number; count: number; percentage: number }>;
  [key: string]: unknown;
}

/**
 * Every submit/status endpoint wraps its payload in this envelope — confirmed
 * 2026-08-26 against a live /v1/heatmap call (research/api-spike.md). The
 * activity_id/status/result all live under `data`, not top-level.
 */
export interface ApiEnvelope<TData> {
  error: boolean;
  status_code: number;
  message?: string;
  data: TData;
}

export type SubmitResponse = ApiEnvelope<{ activity_id: string }>;

/** Observed values are capitalized ("Processing", "Completed") — matched case-insensitively. */
export type ActivityStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "completed"
  | "failed"
  | "error"
  | (string & {});

export type StatusResponse<TResult = unknown> = ApiEnvelope<{
  activity_id: string;
  status: ActivityStatus;
  result?: TResult;
}>;
