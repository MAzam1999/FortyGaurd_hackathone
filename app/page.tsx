import Link from "next/link";

const WORKFLOWS = [
  {
    href: "/shift-plan",
    name: "The Shift Plan",
    forWhom: "The Transit Commuter",
    description:
      "Hour-by-hour exposure for your actual commute today, with the worst window flagged and 2–3 realistic alternatives — never “stay home.”",
  },
  {
    href: "/cooler-way",
    name: "The Cooler Way There",
    forWhom: "Same commute, two routes",
    description:
      "Compares real RTA corridor options by cumulative heat dose — minutes exposed × severity — using per-stop shade measured from FortyGuard street imagery.",
  },
  {
    href: "/crew-board",
    name: "The Crew Board",
    forWhom: "The Outdoor Worker / Crew Lead",
    description:
      "A supervisor-facing work/rest signal for outdoor worksites — the kind of guidance no Louisiana law currently requires anyone to provide.",
  },
  {
    href: "/ask-agent",
    name: "Ask the Heat Agent",
    forWhom: "Any of the above, conversationally",
    description:
      "Ask in plain language — “is it safer to leave at 3 or 5?” — and see the tool calls behind the answer.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Heat You Can&rsquo;t Avoid</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Standard heat advice says &ldquo;stay indoors.&rdquo; That&rsquo;s not a real option if
          your shift is fixed, you don&rsquo;t have a car, or your AC isn&rsquo;t reliable.
          Coolcore uses real FortyGuard heat data to show which of your actual, limited options is
          measurably less bad &mdash; never to tell you to avoid going out.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {WORKFLOWS.map((w) => (
          <Link
            key={w.href}
            href={w.href}
            className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {w.forWhom}
            </span>
            <span className="text-lg font-semibold">{w.name}</span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{w.description}</span>
          </Link>
        ))}
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Built on real FortyGuard API data for New Orleans transit corridors and worksites &mdash;
        current conditions and recent trend, not a forecast. Team Coolcore, FortyGuard
        Hackathon&rsquo;26.
      </p>
    </div>
  );
}
