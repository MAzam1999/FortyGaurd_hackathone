import { HEAT_AGENT_TOOLS } from "@/lib/heat-agent/tools";
import { AgentChat } from "@/components/heat/AgentChat";

const EXAMPLE_QUESTIONS = [
  "Is it safer to leave at 3 or 5 today?",
  "Compare my two routes.",
  "What's the crew status at the Elysian Fields site?",
];

export default function AskAgentPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ask the Heat Agent</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Track 06 (Agentic AI) proof point — stretch workflow.
        </p>
      </div>

      <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        <strong>Not wired to a live model yet.</strong> This needs an LLM API key (Anthropic,
        OpenAI, etc.) that isn&apos;t configured in this project. The 3 tools below are real and
        already tested — they just aren&apos;t being called by a model yet. Below is what each
        tool actually returns right now, computed live on this page load, not scripted.
      </div>

      <section>
        <h2 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Try it — it&apos;s live, it just can&apos;t reason yet
        </h2>
        <AgentChat />
        <ul className="mt-3 flex flex-col gap-1 text-sm">
          {EXAMPLE_QUESTIONS.map((q) => (
            <li key={q} className="italic text-zinc-600 dark:text-zinc-400">
              e.g. &ldquo;{q}&rdquo;
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Available tools (real output, demo data)
        </h2>
        {HEAT_AGENT_TOOLS.map((tool) => (
          <div key={tool.name} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="font-mono text-sm font-medium">{tool.name}()</p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{tool.description}</p>
            <pre className="mt-3 overflow-x-auto rounded bg-zinc-100 p-3 text-xs dark:bg-zinc-900">
              {JSON.stringify(tool.run(), null, 2)}
            </pre>
          </div>
        ))}
      </section>
    </div>
  );
}
