import Link from "next/link";

export function SiteNav() {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em]">
      <Link
        href="/"
        className="rounded-full border border-[#e5dbcf] bg-white px-4 py-2 text-[#6b6156] transition hover:border-[#1f1d1a] hover:text-[#1f1d1a]"
      >
        Dashboard
      </Link>
      <Link
        href="/income-compare"
        className="rounded-full border border-[#e5dbcf] bg-white px-4 py-2 text-[#6b6156] transition hover:border-[#1f1d1a] hover:text-[#1f1d1a]"
      >
        Compare globally
      </Link>
      <Link
        href="/india-tax-health"
        className="rounded-full border border-[#e5dbcf] bg-white px-4 py-2 text-[#6b6156] transition hover:border-[#1f1d1a] hover:text-[#1f1d1a]"
      >
        India tax health
      </Link>
    </nav>
  );
}
