import { MemoryCache, cached, fortyGuardCacheKey } from "../cache/index";
import { FortyGuardApiError, FortyGuardError, FortyGuardTimeoutError } from "./errors";
import type {
  ApiKeyUsageResult,
  EnvParamsRequest,
  EnvParamsResult,
  HeatIntelligenceRequest,
  HeatIntelligenceResult,
  HeatmapRequest,
  HeatmapResult,
  SatelliteRequest,
  SatelliteResult,
  StatusResponse,
  StreetviewRequest,
  StreetviewResult,
  SubmitResponse,
} from "./types";

const DEFAULT_BASE_URL = "https://api.fortyguard.com";
const DEFAULT_POLL_INTERVAL_MS = 3_000;
const DEFAULT_TIMEOUT_MS = 600_000;
// heat_intelligence observed at ~117s (research/api-spike.md); give real headroom
const HEAT_INTELLIGENCE_TIMEOUT_MS = 900_000;
const MAX_429_RETRIES = 5;
// Every analysis endpoint is history-only (research/api-spike.md) — a given
// request's result never changes, so a long TTL is safe. This is a per-process
// cache only; it does not replace the real golden/demo dataset (docs/PRD.md §9).
const DEFAULT_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const TERMINAL_SUCCESS = new Set(["succeeded", "completed"]);
const TERMINAL_FAILURE = new Set(["failed", "error"]);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function safeJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function extractMessage(body: unknown): string | null {
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message: unknown }).message;
    if (typeof message === "string") return message;
  }
  return null;
}

export interface FortyGuardClientOptions {
  apiKey?: string;
  baseUrl?: string;
  cache?: MemoryCache;
  cacheTtlMs?: number;
}

export interface PollOptions {
  pollIntervalMs?: number;
  timeoutMs?: number;
  onTick?: (status: string) => void;
}

/**
 * Thin client for the FortyGuard tOS Enterprise API.
 *
 * Handles: api-key header auth, the documented 404-right-after-submit race
 * (retried, never surfaced as failure), bounded 429 backoff, and treats a
 * missing/`null` field as missing data — never coerced to 0.
 */
export class FortyGuardClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly cache: MemoryCache;
  private readonly cacheTtlMs: number;

  constructor(options: FortyGuardClientOptions = {}) {
    const apiKey = options.apiKey ?? process.env.FORTYGUARD_API_KEY;
    if (!apiKey) {
      throw new FortyGuardError(
        "FortyGuard API key missing — set FORTYGUARD_API_KEY (see .env.example) or pass { apiKey } explicitly.",
      );
    }
    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl ?? process.env.FORTYGUARD_BASE_URL ?? DEFAULT_BASE_URL;
    this.cache = options.cache ?? new MemoryCache();
    this.cacheTtlMs = options.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;
  }

  /** Low-level request with 429 backoff. Non-2xx (other than an allowed 404) throws FortyGuardApiError. */
  private async request(
    path: string,
    init: RequestInit,
    opts: { allow404?: boolean } = {},
  ): Promise<Response> {
    let attempt = 0;

    while (true) {
      const res = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        // Next.js's fetch Data Cache must never intercept this — the status-poll
        // GET would otherwise return a stale cached "pending" response forever.
        cache: "no-store",
        headers: {
          "api-key": this.apiKey,
          "Content-Type": "application/json",
          ...init.headers,
        },
      });

      if (res.status === 429 && attempt < MAX_429_RETRIES) {
        const retryAfter = res.headers.get("retry-after");
        const backoffMs = retryAfter ? Number(retryAfter) * 1000 : Math.min(2 ** attempt * 1000, 30_000);
        attempt += 1;
        await sleep(backoffMs);
        continue;
      }

      if (res.status === 404 && opts.allow404) {
        return res;
      }

      if (!res.ok) {
        const body = await safeJson(res);
        const message = extractMessage(body) ?? `FortyGuard request to ${path} failed with status ${res.status}`;
        throw new FortyGuardApiError(message, res.status, body);
      }

      return res;
    }
  }

  private async submit(path: string, payload: unknown): Promise<string> {
    const res = await this.request(path, { method: "POST", body: JSON.stringify(payload) });
    const body = (await safeJson(res)) as SubmitResponse | null;
    const activityId = body?.data?.activity_id;
    if (!activityId) {
      throw new FortyGuardApiError(`Submit to ${path} did not return an activity_id`, res.status, body);
    }
    return activityId;
  }

  /** Poll GET /v1/status/{activityId} until a terminal status, handling the 404-right-after-submit race. */
  async waitForCompletion<TResult>(activityId: string, opts: PollOptions = {}): Promise<TResult> {
    const pollIntervalMs = opts.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;
    const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const deadline = Date.now() + timeoutMs;

    while (true) {
      if (Date.now() >= deadline) {
        throw new FortyGuardTimeoutError(
          `Polling timed out after ${timeoutMs}ms for activity ${activityId}`,
        );
      }

      const res = await this.request(`/v1/status/${activityId}`, { method: "GET" }, { allow404: true });

      if (res.status === 404) {
        // Known race: status isn't indexed yet immediately after submit — not a failure.
        opts.onTick?.("pending");
        await sleep(pollIntervalMs);
        continue;
      }

      const body = (await safeJson(res)) as StatusResponse<TResult> | null;
      const status = String(body?.data?.status ?? "").toLowerCase();
      opts.onTick?.(status);

      if (TERMINAL_SUCCESS.has(status)) {
        return (body?.data?.result ?? (body as unknown)) as TResult;
      }
      if (TERMINAL_FAILURE.has(status)) {
        throw new FortyGuardApiError(body?.message ?? "FortyGuard activity failed", res.status, body);
      }

      await sleep(pollIntervalMs);
    }
  }

  /** Submits and waits for a result, reusing a cached result for an identical request. */
  private async submitAndWait<TResult>(
    path: string,
    payload: unknown,
    pollOpts: PollOptions = {},
  ): Promise<TResult> {
    const key = fortyGuardCacheKey(path, payload);
    return cached(this.cache, key, this.cacheTtlMs, async () => {
      const activityId = await this.submit(path, payload);
      return this.waitForCompletion<TResult>(activityId, pollOpts);
    });
  }

  async heatmap(request: HeatmapRequest, pollOpts?: PollOptions): Promise<HeatmapResult> {
    return this.submitAndWait<HeatmapResult>("/v1/heatmap", request, pollOpts);
  }

  async envParams(request: EnvParamsRequest, pollOpts?: PollOptions): Promise<EnvParamsResult> {
    return this.submitAndWait<EnvParamsResult>("/v1/env_params", request, pollOpts);
  }

  async satellite(request: SatelliteRequest, pollOpts?: PollOptions): Promise<SatelliteResult> {
    const { latitude, longitude, date_time, granularity } = request;
    const payload = {
      sat: { latitude, longitude },
      date_time,
      granularity: granularity ?? 100,
    };
    return this.submitAndWait<SatelliteResult>("/v1/satellite", payload, pollOpts);
  }

  async streetview(request: StreetviewRequest, pollOpts?: PollOptions): Promise<StreetviewResult> {
    const payload = {
      latitude: request.latitude,
      longitude: request.longitude,
      vertical_angle: request.vertical_angle ?? 0,
      horizontal_angle: request.horizontal_angle ?? 0,
      back_view: request.back_view ?? false,
    };
    return this.submitAndWait<StreetviewResult>("/v1/streetview", payload, pollOpts);
  }

  /** Confirmed ~117s latency (research/api-spike.md) — never call live in a demo; pre-generate and cache. */
  async heatIntelligence(
    request: HeatIntelligenceRequest,
    pollOpts?: PollOptions,
  ): Promise<HeatIntelligenceResult> {
    return this.submitAndWait<HeatIntelligenceResult>("/v1/heat_intelligence", request, {
      timeoutMs: HEAT_INTELLIGENCE_TIMEOUT_MS,
      ...pollOpts,
    });
  }

  /** Direct status check, without the submit-and-wait wrapper (e.g. to resume polling an existing activity). */
  async status<TResult = unknown>(activityId: string): Promise<StatusResponse<TResult>> {
    const res = await this.request(`/v1/status/${activityId}`, { method: "GET" });
    return (await safeJson(res)) as StatusResponse<TResult>;
  }

  /**
   * Free system check — does not consume analysis credits. Safe to call to verify
   * auth/connectivity. Confirmed 2026-08-23: despite the api-key header, this
   * endpoint also requires api_key repeated in the body or it 422s.
   */
  async fetchApiKeyUsage(): Promise<ApiKeyUsageResult> {
    const res = await this.request("/v1/system/fetch-api-key-usage", {
      method: "POST",
      body: JSON.stringify({ api_key: this.apiKey }),
    });
    return (await safeJson(res)) as ApiKeyUsageResult;
  }
}
