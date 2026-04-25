"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/formatDate";

const STATUS_COLORS = {
  searching: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  matched: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  closed: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

export default function FilmmakerProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/filmmaker-projects")
      .then((r) => r.json())
      .then((j) => { setProjects(j.projects || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your film projects and find matching editors.</p>
        </div>
        <Button asChild href="/dashboard/filmmaker/projects/new">+ New project</Button>
      </div>

      {loading ? (
        <div className="mt-8 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 p-14 text-center dark:border-slate-700">
          <p className="text-lg font-semibold">No projects yet</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            Describe your editing needs and FilmHouse will find the best matching editors.
          </p>
          <Link href="/dashboard/filmmaker/projects/new">
            <Button className="mt-5">Create your first project</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/filmmaker/projects/${project.id}`}
              className="group flex items-start justify-between gap-4 rounded-2xl border border-slate-200 p-5 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold group-hover:text-slate-700 dark:group-hover:text-slate-200">
                    {project.title || "Untitled project"}
                  </h3>
                  {project.status && (
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[project.status] || STATUS_COLORS.closed}`}>
                      {project.status}
                    </span>
                  )}
                </div>
                {(project.project_type || project.genre) && (
                  <p className="mt-1 text-xs text-slate-500">
                    {[project.project_type, project.genre].filter(Boolean).join(" · ")}
                  </p>
                )}
                {project.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">{project.description}</p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs text-slate-400">{formatDate(project.created_at)}</p>
                <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">Find editors →</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}