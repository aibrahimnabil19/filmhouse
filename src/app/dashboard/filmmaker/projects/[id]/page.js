import { createClient } from "@/lib/supabase/server";
import NaturalLanguageSearchBox from "@/components/filmmaker/NaturalLanguageSearchBox";
import { formatDate } from "@/lib/utils/formatDate";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import Link from "next/link";

export default async function ProjectDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();

  if (!project) {
    return (
      <div className="max-w-4xl">
        <p className="text-slate-500">Project not found.</p>
        <Link href="/dashboard/filmmaker/projects" className="mt-4 inline-block text-sm font-semibold">
          ← Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Breadcrumb */}
      <Link href="/dashboard/filmmaker/projects" className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
        ← Back to projects
      </Link>

      {/* Project summary card */}
      <div className="rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{project.title || "Untitled project"}</h1>
            {(project.project_type || project.genre) && (
              <p className="mt-1 text-sm text-slate-500">
                {[project.project_type, project.genre].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          {project.status && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize dark:bg-slate-800">
              {project.status}
            </span>
          )}
        </div>

        {project.description && (
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{project.description}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
          {(project.budget_min || project.budget_max) && (
            <span>
              Budget: {formatCurrency(project.budget_min)} – {formatCurrency(project.budget_max)}
            </span>
          )}
          {project.deadline && <span>Deadline: {formatDate(project.deadline)}</span>}
          {project.style_preferences && <span>Style: {project.style_preferences}</span>}
        </div>
      </div>

      {/* AI matching section */}
      <div>
        <h2 className="text-xl font-bold">Find matching editors</h2>
        <p className="mt-1 text-sm text-slate-500">
          Describe exactly what you need — the more detail, the better the match.
        </p>
        <div className="mt-4">
          <NaturalLanguageSearchBox
            projectId={id}
            initialQuery={project.natural_language_query || ""}
          />
        </div>
      </div>
    </div>
  );
}