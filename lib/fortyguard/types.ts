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

export interface HeatmapStats {
  minimum: number | null;
  maximum: number | null;
  mean: number | null;
  n_cells: number;
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
  temperature?: number;
  date_time: DateTimeFilter;
  /** Basic plan caps this at 3; Premium (this team's plan) returns all */
  analysis?: string[];
}

export interface EnvParamsResult {
  heat_index_celsius: number | null;
  wet_bulb_temperature_celsius: number | null;
  relative_humidity_percent: number | null;
  solar_irradiance: number | null;
  [key: string]: unknown;
}

export interface StreetviewRequest {
  latitude: number;
  longitude: number;
  heading?: number;
  date?: string;
}

export interface StreetviewSegment {
  class: string; // e.g. 'tree' | 'building' | 'road' | 'sky' | 'car'
  percent: number;
}

export interface StreetviewResult {
  segments: StreetviewSegment[];
  image_legend?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface SatelliteRequest {
  latitude: number;
  longitude: number;
  date?: string;
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
  credits_total?: number;
  credits_remaining?: number;
  [key: string]: unknown;
}

export interface SubmitResponse {
  activity_id: string;
  [key: string]: unknown;
}

export type ActivityStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "completed"
  | "failed"
  | "error"
  | (string & {});

export interface StatusResponse<TResult = unknown> {
  status: ActivityStatus;
  result?: TResult;
  message?: string;
  [key: string]: unknown;
}
