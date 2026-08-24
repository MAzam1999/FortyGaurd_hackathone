/**
 * Known LLM provider key env vars. Azam's chosen provider (2026-08-24) is
 * OpenRouter, using the free DeepSeek tier — OPENROUTER_API_KEY is not set
 * yet ("I'll add openrouter key later"). Others kept as fallbacks in case
 * that changes. Once OPENROUTER_API_KEY exists, wire the real model call in
 * handleAskAgentRequest below (e.g. via the Vercel AI SDK's OpenAI-compatible
 * provider pointed at https://openrouter.ai/api/v1) using HEAT_AGENT_TOOLS.
 */
const KNOWN_PROVIDER_KEYS = [
  "OPENROUTER_API_KEY",
  "ANTHROPIC_API_KEY",
  "OPENAI_API_KEY",
  "AI_GATEWAY_API_KEY",
] as const;

export interface AskAgentResponse {
  configured: boolean;
  reply: string;
}

export function isAgentConfigured(env: Record<string, string | undefined>): boolean {
  return KNOWN_PROVIDER_KEYS.some((key) => Boolean(env[key]));
}

export function handleAskAgentRequest(
  message: string,
  env: Record<string, string | undefined>,
): AskAgentResponse {
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

  // Real model call goes here once a provider/key is configured.
  return { configured: true, reply: "Not implemented yet." };
}
