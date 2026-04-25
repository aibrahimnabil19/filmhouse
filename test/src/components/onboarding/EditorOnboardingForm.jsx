"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ProfileStepBasic from "./ProfileStepBasic";
import ProfileStepSkills from "./ProfileStepSkills";
import ProfileStepPortfolio from "./ProfileStepPortfolio";
import ProfileStepRates from "./ProfileStepRates";

export default function EditorOnboardingForm() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({ specializations: [], genres: [], software: [], availabilityStatus: "available" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  async function submit(e) {
    e.preventDefault(); setLoading(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return router.push("/auth/login"); }
    const profilePayload = { id: user.id, full_name: form.fullName || user.user_metadata?.full_name || "Editor", role: "editor", email: user.email, country: form.country, city: form.city, timezone: form.timezone, language: form.language, onboarding_completed: true };
    const { error: profileError } = await supabase.from("profiles").upsert(profilePayload);
    if (profileError) { setLoading(false); return setError(profileError.message); }
    const { data: editor, error: editorError } = await supabase.from("editors").insert({ user_id: user.id, headline: form.headline, bio: form.bio, years_experience: Number(form.yearsExperience || 0), hourly_rate: form.hourlyRate || null, project_rate_min: form.projectRateMin || null, project_rate_max: form.projectRateMax || null, availability_status: form.availabilityStatus, portfolio_summary: form.portfolioSummary }).select("id").single();
    if (editorError) { setLoading(false); return setError(editorError.message); }
    if (form.specializations?.length) await supabase.from("editor_specializations").insert(form.specializations.map((specialization) => ({ editor_id: editor.id, specialization })));
    if (form.genres?.length) await supabase.from("editor_genres").insert(form.genres.map((genre) => ({ editor_id: editor.id, genre })));
    if (form.software?.length) await supabase.from("editor_software").insert(form.software.map((software) => ({ editor_id: editor.id, software, proficiency: "advanced" })));
    if (form.portfolioUrl) await supabase.from("portfolio_items").insert({ editor_id: editor.id, title: "Featured portfolio", video_url: form.portfolioUrl, description: form.portfolioSummary });
    await fetch("/api/matching/generate-editor-embedding", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ editorId: editor.id }) });
    setLoading(false); router.push("/dashboard/editor"); router.refresh();
  }
  return <form onSubmit={submit} className="space-y-8"><ProfileStepBasic form={form} update={update} /><div className="grid gap-4 md:grid-cols-2"><Input placeholder="Professional headline" value={form.headline || ""} onChange={(e)=>update("headline", e.target.value)} /><Input type="number" placeholder="Years of experience" value={form.yearsExperience || ""} onChange={(e)=>update("yearsExperience", e.target.value)} /></div><Textarea placeholder="Tell filmmakers about your editing style, experience, and strengths" value={form.bio || ""} onChange={(e)=>update("bio", e.target.value)} /><ProfileStepSkills form={form} update={update} /><ProfileStepPortfolio form={form} update={update} /><ProfileStepRates form={form} update={update} />{error && <p className="text-sm text-red-500">{error}</p>}<Button disabled={loading}>{loading ? "Creating profile..." : "Submit editor profile"}</Button></form>;
}
