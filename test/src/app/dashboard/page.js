import StatCard from "@/components/dashboard/StatCard";
export default function DashboardPage() { return <div><h1 className="text-2xl font-bold">Welcome to CutMatch</h1><div className="mt-6 grid gap-4 md:grid-cols-3"><StatCard label="Matches" value="0" /><StatCard label="Projects" value="0" /><StatCard label="Shortlists" value="0" /></div></div>; }
