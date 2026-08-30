import Link from "next/link";
import { CitySkyline } from "@/components/CitySkyline";
import {
  ClockIcon,
  RouteIcon,
  UsersIcon,
  ChatIcon,
  ArrowRightIcon,
  ThermometerIcon,
  BarChartIcon,
  ShieldCheckIcon,
} from "@/components/icons";

const WORKFLOWS = [
  {
    href: "/shift-plan",
    name: "The Shift Plan",
    forWhom: "The Transit Commuter",
    description:
      "Hour-by-hour exposure for your actual commute today, with the worst window flagged and 2–3 realistic alternatives — never “stay home.”",
    icon: ClockIcon,
    accent: "breeze",
  },
  {
    href: "/cooler-way",
    name: "The Cooler Way There",
    forWhom: "Same commute, two routes",
    description:
      "Compares real RTA corridor options by cumulative heat dose — minutes exposed × severity — using per-stop shade measured from FortyGuard street imagery.",
    icon: RouteIcon,
    accent: "leaf",
  },
  {
    href: "/crew-board",
    name: "The Crew Board",
    forWhom: "The Outdoor Worker / Crew Lead",
    description:
      "A supervisor-facing work/rest signal for outdoor worksites — the kind of guidance no Louisiana law currently requires anyone to provide.",
    icon: UsersIcon,
    accent: "violet",
  },
  {
    href: "/ask-agent",
    name: "Ask the Heat Agent",
    forWhom: "Any of the above, conversationally",
    description:
      "Ask in plain language — “is it safer to leave at 3 or 5?” — and see the tool calls behind the answer.",
    icon: ChatIcon,
    accent: "amber",
  },
] as const;

const ACCENT_CLASSES: Record<
  (typeof WORKFLOWS)[number]["accent"],
  { text: string; bg: string; iconBg: string; border: string }
> = {
  breeze: { text: "text-breeze-bright", bg: "bg-breeze/10", iconBg: "bg-breeze/20", border: "border-breeze/25" },
  leaf: { text: "text-leaf", bg: "bg-leaf/10", iconBg: "bg-leaf/20", border: "border-leaf/25" },
  violet: { text: "text-violet", bg: "bg-violet/10", iconBg: "bg-violet/20", border: "border-violet/25" },
  amber: { text: "text-amber", bg: "bg-amber/10", iconBg: "bg-amber/20", border: "border-amber/25" },
};

const FEATURES = [
  { icon: ThermometerIcon, label: "Real heat data", sub: "FortyGuard verified", accent: "breeze" as const },
  { icon: BarChartIcon, label: "Measurable options", sub: "Compare, don't guess", accent: "leaf" as const },
  { icon: ShieldCheckIcon, label: "Built for real life", sub: "Work, commute, stay safe", accent: "breeze" as const },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-background">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-breeze/30 bg-breeze/10 px-3 py-1 text-xs font-medium text-breeze-bright">
              <ShieldCheckIcon className="h-3.5 w-3.5" />
              Real data. Real impact.
            </span>

            <h1 className="font-sans text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Heat You{" "}
              <em className="font-[family-name:var(--font-display)] font-medium italic text-breeze-bright">
                Can&rsquo;t
              </em>{" "}
              Avoid
            </h1>

            <p className="max-w-md font-[family-name:var(--font-display)] text-lg italic text-mist">
              Standard heat advice says &ldquo;stay indoors.&rdquo; That&rsquo;s not a real option
              if your shift is fixed, you don&rsquo;t have a car, or your AC isn&rsquo;t reliable.
            </p>

            <p className="max-w-md text-[15px] leading-relaxed text-mist">
              Coolcore uses real FortyGuard heat data to show which of your actual, limited options
              is measurably less bad — never to tell you to avoid going out.
            </p>

            <div className="mt-2 flex flex-wrap gap-6">
              {FEATURES.map((f) => {
                const c = ACCENT_CLASSES[f.accent];
                return (
                  <div key={f.label} className="flex items-center gap-2.5">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${c.iconBg} ${c.text}`}>
                      <f.icon className="h-4.5 w-4.5" />
                    </span>
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-medium text-foreground">{f.label}</span>
                      <span className="text-xs text-mist">{f.sub}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border-subtle shadow-2xl">
            <CitySkyline className="h-auto w-full" />
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {WORKFLOWS.map((w) => {
            const c = ACCENT_CLASSES[w.accent];
            return (
              <Link
                key={w.href}
                href={w.href}
                className={`group flex items-start gap-4 rounded-2xl border ${c.border} ${c.bg} p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg`}
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${c.iconBg} ${c.text}`}>
                  <w.icon className="h-6 w-6" />
                </span>
                <div className="flex flex-1 flex-col gap-1">
                  <span className={`text-xs font-medium uppercase tracking-wide ${c.text}`}>{w.forWhom}</span>
                  <span className="text-lg font-semibold text-foreground">{w.name}</span>
                  <span className="text-sm text-mist">{w.description}</span>
                </div>
                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full border ${c.border} ${c.text} transition-transform group-hover:translate-x-0.5`}
                >
                  <ArrowRightIcon className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>

        <section id="about" className="scroll-mt-20 rounded-2xl border border-border-subtle bg-surface p-6">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-medium text-foreground">
            About Coolcore
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist">
            Built on real FortyGuard API data for New Orleans transit corridors and worksites —
            current conditions and recent trend, not a forecast. Coolcore is a decision-support
            tool for people who can&rsquo;t just avoid the heat: transit-dependent commuters,
            outdoor crews, and residents without reliable AC. It never tells anyone to stay home —
            it finds the least-exposed option within their real constraints.
          </p>
          <p className="mt-3 text-xs text-mist">Team Coolcore, FortyGuard Hackathon&rsquo;26.</p>
        </section>
      </section>
    </div>
  );
}
