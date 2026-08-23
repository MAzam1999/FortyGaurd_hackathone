// One-off connectivity check — calls only the free /v1/system/fetch-api-key-usage
// endpoint (mirrors lib/fortyguard/client.ts's fetchApiKeyUsage()), never an
// analysis endpoint, so it never spends real credits.
// Usage: node --env-file=.env.local scripts/smoke-test-fortyguard.mjs

const baseUrl = process.env.FORTYGUARD_BASE_URL ?? "https://api.fortyguard.com";
const apiKey = process.env.FORTYGUARD_API_KEY;

if (!apiKey) {
  console.error("FORTYGUARD_API_KEY is not set (expected in .env.local)");
  process.exit(1);
}

const res = await fetch(`${baseUrl}/v1/system/fetch-api-key-usage`, {
  method: "POST",
  headers: { "api-key": apiKey, "Content-Type": "application/json" },
  body: JSON.stringify({ api_key: apiKey }),
});

const text = await res.text();
console.log(`status: ${res.status}`);
console.log(text);
