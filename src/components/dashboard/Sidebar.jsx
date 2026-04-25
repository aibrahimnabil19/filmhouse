import Link from "next/link";

const links = [
  ["Dashboard", "/dashboard/filmmaker"],
  ["Projects", "/dashboard/filmmaker/projects"],
  ["Matches", "/dashboard/filmmaker/matches"],
  ["Saved editors", "/dashboard/filmmaker/saved-editors"],
  ["Browse editors", "/editors"],
  ["Settings", "/dashboard/filmmaker/settings"],
];

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 p-5 dark:border-slate-800 lg:flex">
      <Link href="/" className="text-xl font-bold tracking-tight">
        FilmHouse
      </Link>
      <nav className="mt-8 flex-1 space-y-1">
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="block rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
        <Link
          href="/dashboard/filmmaker/projects/new"
          className="block rounded-xl bg-slate-950 px-3 py-2 text-center text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          + New project
        </Link>
      </div>
    </aside>
  );
}