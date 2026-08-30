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
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight">
          Ask the Heat Agent
        </h1>
        <p className="mt-1 text-sm text-mist">
          Track 06 (Agentic AI) proof point — stretch workflow.
        </p>
      </div>

      <div className="rounded-lg border border-breeze/30 bg-breeze/10 px-4 py-3 text-sm text-breeze">
        <strong>Live-sourced data:</strong> this chat calls a real model (OpenRouter, Gemma) with
        tool access to the 3 tools below. Ask it a question and it decides which tool(s) to call —
        expand &ldquo;called ...&rdquo; under its reply to see the actual tool calls and results,
        not just the final answer.
      </div>

      <section>
        <h2 className="mb-2 text-sm font-medium text-mist">
          Try it — ask about your shift, routes, or crew
        </h2>
        <AgentChat />
        <ul className="mt-3 flex flex-col gap-1 text-sm">
          {EXAMPLE_QUESTIONS.map((q) => (
            <li key={q} className="italic text-mist">
              e.g. &ldquo;{q}&rdquo;
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-mist">
          Available tools (real output, demo data)
        </h2>
        {HEAT_AGENT_TOOLS.map((tool) => (
          <div key={tool.name} className="rounded-lg border border-border-subtle bg-surface p-4">
            <p className="font-mono text-sm font-medium">{tool.name}()</p>
            <p className="mt-1 text-sm text-mist">{tool.description}</p>
            <pre className="mt-3 overflow-x-auto rounded bg-background p-3 text-xs">
              {JSON.stringify(tool.run(), null, 2)}
            </pre>
          </div>
        ))}
      </section>
    </div>
  );
}
