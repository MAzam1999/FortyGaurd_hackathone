import Link from "next/link";

const NAV_LINKS = [
  { href: "/shift-plan", label: "The Shift Plan" },
  { href: "/cooler-way", label: "The Cooler Way There" },
  { href: "/crew-board", label: "The Crew Board" },
  { href: "/ask-agent", label: "Ask the Heat Agent" },
];

export function SiteHeader() {
  return (
    <header className="flex w-full items-center gap-6 bg-dusk px-6 py-3 text-sm font-medium text-magnolia">
      <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-breeze-bright" aria-hidden="true" />
        Coolcore
      </Link>
      <nav className="flex flex-wrap gap-5">
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
