import Link from "next/link";

const WORKFLOWS = [
  {
    href: "/shift-plan",
    name: "The Shift Plan",
    forWhom: "The Transit Commuter",
    description:
      "Hour-by-hour exposure for your actual commute today, with the worst window flagged and 2–3 realistic alternatives — never “stay home.”",
    accent: "bg-breeze",
  },
  {
    href: "/cooler-way",
    name: "The Cooler Way There",
    forWhom: "Same commute, two routes",
    description:
      "Compares real RTA corridor options by cumulative heat dose — minutes exposed × severity — using per-stop shade measured from FortyGuard street imagery.",
    accent: "bg-moss",
  },
  {
    href: "/crew-board",
    name: "The Crew Board",
    forWhom: "The Outdoor Worker / Crew Lead",
    description:
      "A supervisor-facing work/rest signal for outdoor worksites — the kind of guidance no Louisiana law currently requires anyone to provide.",
    accent: "bg-breeze",
  },
  {
    href: "/ask-agent",
    name: "Ask the Heat Agent",
    forWhom: "Any of the above, conversationally",
    description:
      "Ask in plain language — “is it safer to leave at 3 or 5?” — and see the tool calls behind the answer.",
    accent: "bg-moss",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden bg-dusk">
        <div className="canopy-glow" />
        <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-20">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight text-magnolia sm:text-5xl">
            Heat You Can&rsquo;t Avoid
          </h1>
          <p className="max-w-xl font-[family-name:var(--font-display)] text-lg italic text-[#bcd6d3]">
            Standard heat advice says &ldquo;stay indoors.&rdquo; That&rsquo;s not a real option
            if your shift is fixed, you don&rsquo;t have a car, or your AC isn&rsquo;t reliable.
          </p>
          <p className="max-w-xl text-[15px] leading-relaxed text-[#8fb0b0]">
            Coolcore uses real FortyGuard heat data to show which of your actual, limited options
            is measurably less bad — never to tell you to avoid going out.
          </p>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {WORKFLOWS.map((w) => (
            <Link
              key={w.href}
              href={w.href}
              className="group flex flex-col gap-2 overflow-hidden rounded-lg border border-border-subtle bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className={`-mx-4 -mt-4 mb-1 h-1 ${w.accent}`} aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-wide text-mist">
                {w.forWhom}
              </span>
              <span className="text-lg font-semibold text-foreground group-hover:text-breeze">
                {w.name}
              </span>
              <span className="text-sm text-mist">{w.description}</span>
            </Link>
          ))}
        </div>

        <p className="text-xs text-mist">
          Built on real FortyGuard API data for New Orleans transit corridors and worksites —
          current conditions and recent trend, not a forecast. Team Coolcore, FortyGuard
          Hackathon&rsquo;26.
        </p>
      </section>
    </div>
  );
}
