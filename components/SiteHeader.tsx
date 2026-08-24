import Link from "next/link";

const NAV_LINKS = [
  { href: "/shift-plan", label: "The Shift Plan" },
  { href: "/cooler-way", label: "The Cooler Way There" },
  { href: "/crew-board", label: "The Crew Board" },
  { href: "/ask-agent", label: "Ask the Heat Agent" },
];

export function SiteHeader() {
  return (
    <header className="flex w-full items-center gap-4 border-b border-zinc-200 px-6 py-3 text-sm font-medium dark:border-zinc-800">
      <Link href="/" className="font-semibold">
        Coolcore
      </Link>
      <nav className="flex flex-wrap gap-4">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="underline">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
