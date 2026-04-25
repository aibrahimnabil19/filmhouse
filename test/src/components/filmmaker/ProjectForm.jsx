"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProjectForm() {
  const router = useRouter(); const [form, setForm] = useState({}); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const update = (key, value) => setForm((f)=>({ ...f, [key]: value }));
  async function submit(e) { e.preventDefault(); setLoading(true); setError(""); const res = await fetch("/api/filmmaker-projects", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(form) }); const json = await res.json(); setLoading(false); if (!res.ok) return setError(json.error || "Could not create project"); router.push(`/dashboard/filmmaker/projects/${json.project.id}`); }
  return <form onSubmit={submit} className="space-y-4"><Input placeholder="Project title" value={form.title || ""} onChange={(e)=>update("title", e.target.value)} /><Input placeholder="Project type e.g. documentary, wedding film" value={form.projectType || ""} onChange={(e)=>update("projectType", e.target.value)} /><Input placeholder="Genre" value={form.genre || ""} onChange={(e)=>update("genre", e.target.value)} /><div className="grid gap-4 md:grid-cols-2"><Input type="number" placeholder="Budget min" value={form.budgetMin || ""} onChange={(e)=>update("budgetMin", e.target.value)} /><Input type="number" placeholder="Budget max" value={form.budgetMax || ""} onChange={(e)=>update("budgetMax", e.target.value)} /></div><Input type="date" value={form.deadline || ""} onChange={(e)=>update("deadline", e.target.value)} /><Textarea placeholder="Project description" value={form.description || ""} onChange={(e)=>update("description", e.target.value)} /><Textarea placeholder="Natural language editor request" value={form.naturalLanguageQuery || ""} onChange={(e)=>update("naturalLanguageQuery", e.target.value)} /><Textarea placeholder="Style preferences" value={form.stylePreferences || ""} onChange={(e)=>update("stylePreferences", e.target.value)} />{error && <p className="text-sm text-red-500">{error}</p>}<Button disabled={loading}>{loading ? "Creating..." : "Create project"}</Button></form>;
}
