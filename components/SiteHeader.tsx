import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/shift-plan", label: "The Shift Plan" },
  { href: "/cooler-way", label: "The Cooler Way There" },
  { href: "/crew-board", label: "The Crew Board" },
  { href: "/ask-agent", label: "Ask the Heat Agent" },
];

function Logomark() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
      <circle cx="16" cy="16" r="13" fill="none" stroke="#2bbcac" strokeWidth="2.5" strokeDasharray="58 24" strokeLinecap="round" />
      <circle cx="16" cy="16" r="8" fill="none" stroke="#2bbcac" strokeWidth="2.5" strokeDasharray="34 16" strokeLinecap="round" opacity="0.65" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="flex flex-col gap-3 bg-dusk px-6 py-3 text-sm font-medium text-magnolia md:flex-row md:items-center md:gap-6">
      <div className="flex items-center justify-between gap-4 md:contents">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight md:order-1">
          <Logomark />
          Coolcore
        </Link>
        <div className="flex items-center gap-3 md:order-3">
          <ThemeToggle />
          <Link
            href="/#about"
            className="rounded-full border border-white/15 px-4 py-1.5 text-sm whitespace-nowrap text-[#a9c4c3] transition-colors hover:border-breeze-bright hover:text-breeze-bright"
          >
            About Coolcore
          </Link>
        </div>
      </div>
      <nav className="flex gap-5 overflow-x-auto whitespace-nowrap pb-0.5 md:order-2 md:flex-1 md:overflow-visible md:pb-0">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[#a9c4c3] transition-colors hover:text-breeze-bright"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
