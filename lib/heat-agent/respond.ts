import { HEAT_AGENT_TOOLS, type HeatAgentTool } from "./tools";

/**
 * Known LLM provider key env vars. Azam's chosen provider is OpenRouter —
 * OPENROUTER_API_KEY is the only one actually wired to a real model call
 * below. Others are kept as recognized-but-unimplemented so the app fails
 * honestly (not silently) if one of those is set instead.
 */
const KNOWN_PROVIDER_KEYS = [
  "OPENROUTER_API_KEY",
  "ANTHROPIC_API_KEY",
  "OPENAI_API_KEY",
  "AI_GATEWAY_API_KEY",
] as const;

/**
 * DeepSeek's free-tier OpenRouter slug (referenced in .env.example) is no
 * longer in OpenRouter's catalog as of 2026-08-30 — verified live via
 * GET /api/v1/models. google/gemma-4-26b-a4b-it:free is the requested model
 * (genuinely free, tool-calling capable, confirmed live) — but live-tested
 * 2026-08-30 and its upstream provider (Google AI Studio) is returning 429
 * "temporarily rate-limited upstream" on OpenRouter's shared free pool right
 * now, consistently across repeated attempts, not a one-off.
 *
 * minimax/minimax-m3:free is a free fallback confirmed live and working.
 * google/gemini-2.5-flash-lite is a paid-but-fractions-of-a-cent fallback
 * (not on a congested shared free pool) — kept last so free options are
 * tried first. A third free option (a "reasoning" model) was tried and
 * dropped: it sometimes returns neither content nor a tool call at all —
 * the answer gets stuck in a separate reasoning field — which is worse for
 * a live demo than paying a fraction of a cent for a reliable reply.
 */
const OPENROUTER_MODELS = [
  "google/gemma-4-26b-a4b-it:free",
  "minimax/minimax-m3:free",
  "google/gemini-2.5-flash-lite",
] as const;

const SYSTEM_PROMPT =
  "You are the Heat Agent for Coolcore, a heat-exposure decision-support app for Louisiana. " +
  "Answer using the provided tools for any real data — never invent heat numbers. Never tell " +
  "someone to just stay home or avoid going outside; frame advice within real constraints (a " +
  "different bus, a shift-start conversation, a specific hour to run an errand). Be concise — " +
  "2-4 sentences.";

export interface AgentToolCall {
  name: string;
  input: unknown;
  result: unknown;
}

export interface AskAgentResponse {
  configured: boolean;
  reply: string;
  toolCalls?: AgentToolCall[];
}

export function isAgentConfigured(env: Record<string, string | undefined>): boolean {
  return KNOWN_PROVIDER_KEYS.some((key) => Boolean(env[key]));
}

function toOpenAiTool(tool: HeatAgentTool) {
  return {
    type: "function" as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters:
        tool.name === "get_crew_board"
          ? {
              type: "object",
              properties: {
                worksiteName: { type: "string", description: "Optional worksite name to filter to." },
              },
            }
          : { type: "object", properties: {} },
    },
  };
}

interface OpenRouterMessage {
  role: string;
  content: string | null;
  tool_calls?: Array<{ id: string; function: { name: string; arguments: string } }>;
  tool_call_id?: string;
}

interface OpenRouterResponse {
  choices?: Array<{ message: OpenRouterMessage }>;
}

async function callOpenRouterModel(
  apiKey: string,
  model: string,
  messages: OpenRouterMessage[],
): Promise<OpenRouterResponse> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, tools: HEAT_AGENT_TOOLS.map(toOpenAiTool) }),
  });
  if (!res.ok) {
    throw new Error(`OpenRouter ${res.status} (${model}): ${(await res.text()).slice(0, 300)}`);
  }
  const json = (await res.json()) as OpenRouterResponse;
  const msg = json.choices?.[0]?.message;
  if (!msg?.content && (!msg?.tool_calls || msg.tool_calls.length === 0)) {
    // A 200 with neither a reply nor a tool call — seen from "reasoning" models that
    // sometimes park the actual answer in a separate reasoning field instead. Treat as
    // a failure so the caller falls back to the next model rather than showing nothing.
    throw new Error(`OpenRouter 200 (${model}) but empty message (no content, no tool_calls)`);
  }
  return json;
}

/** Tries each model in OPENROUTER_MODELS in order, falling back on failure (e.g. a 429 from a congested free-tier provider). */
async function callOpenRouter(
  apiKey: string,
  messages: OpenRouterMessage[],
): Promise<{ response: OpenRouterResponse; model: string }> {
  let lastError: unknown;
  for (const model of OPENROUTER_MODELS) {
    try {
      return { response: await callOpenRouterModel(apiKey, model, messages), model };
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("All OpenRouter models failed");
}

export async function handleAskAgentRequest(
  message: string,
  env: Record<string, string | undefined>,
): Promise<AskAgentResponse> {
  if (!message.trim()) {
    return { configured: false, reply: "A message is required." };
  }

  if (!isAgentConfigured(env)) {
    return {
      configured: false,
      reply:
        "The heat agent isn't wired to a live model yet — it needs an LLM API key " +
        `(one of ${KNOWN_PROVIDER_KEYS.join(", ")}) that isn't configured in this project.`,
    };
  }

  const apiKey = env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return {
      configured: true,
      reply: "A model key is configured, but it isn't OPENROUTER_API_KEY — only OpenRouter is wired up right now.",
    };
  }

  const messages: OpenRouterMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: message },
  ];

  try {
    const first = await callOpenRouter(apiKey, messages);
    const firstMessage = first.response.choices?.[0]?.message;
    const requestedCalls = firstMessage?.tool_calls ?? [];

    if (requestedCalls.length === 0) {
      return { configured: true, reply: firstMessage?.content ?? "The model returned no reply." };
    }

    messages.push(firstMessage!);
    const toolCalls: AgentToolCall[] = [];

    for (const call of requestedCalls) {
      const tool = HEAT_AGENT_TOOLS.find((t) => t.name === call.function.name);
      let input: unknown = {};
      try {
        input = call.function.arguments ? JSON.parse(call.function.arguments) : {};
      } catch {
        input = {};
      }
      const result = tool ? tool.run(input as never) : { error: `Unknown tool ${call.function.name}` };
      toolCalls.push({ name: call.function.name, input, result });
      messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result) });
    }

    // Reuse the same model that succeeded above, not the fallback list from the top.
    const second = await callOpenRouterModel(apiKey, first.model, messages);
    return {
      configured: true,
      reply: second.choices?.[0]?.message?.content ?? "The model returned no reply.",
      toolCalls,
    };
  } catch (err) {
    return {
      configured: true,
      reply: `The model call failed: ${err instanceof Error ? err.message : "unknown error"}`,
    };
  }
}
