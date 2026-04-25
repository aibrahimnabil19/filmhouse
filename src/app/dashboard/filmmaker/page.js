"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import EmptyState from "@/components/dashboard/EmptyState";
import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/formatDate";

export default function FilmmakerDashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/filmmaker-projects")
      .then((r) => r.json())
      .then((j) => { setProjects(j.projects || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Filmmaker dashboard</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800" />)}
        </div>
      </div>
    );
  }

  const searchingCount = projects.filter((p) => p.status === "searching").length;
  const matchedCount = projects.filter((p) => p.status === "matched").length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Filmmaker dashboard</h1>
        {projects.length > 0 && (
          <Button asChild href="/dashboard/filmmaker/projects/new">+ New project</Button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Create your first project"
            description="Describe your editing needs and FilmHouse will recommend the strongest editor profiles."
            href="/dashboard/filmmaker/projects/new"
            action="Create project"
          />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <StatCard label="Total projects" value={String(projects.length)} />
            <StatCard label="Searching" value={String(searchingCount)} />
            <StatCard label="Matched" value={String(matchedCount)} />
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent projects</h2>
              <Link href="/dashboard/filmmaker/projects" className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white">
                View all →
              </Link>
            </div>
            <div className="mt-3 space-y-3">
              {projects.slice(0, 5).map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/filmmaker/projects/${project.id}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                >
                  <div>
                    <p className="font-medium">{project.title || "Untitled"}</p>
                    <p className="text-xs text-slate-500">
                      {[project.project_type, project.genre].filter(Boolean).join(" · ")}
                      {project.created_at && ` · ${formatDate(project.created_at)}`}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-slate-500">Find editors →</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}