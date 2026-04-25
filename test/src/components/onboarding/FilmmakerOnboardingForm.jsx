"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function FilmmakerOnboardingForm() {
  const router = useRouter(); const supabase = createClient();
  const [form, setForm] = useState({}); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const update = (key, value) => setForm((f)=>({ ...f, [key]: value }));
  async function submit(e) {
    e.preventDefault(); setLoading(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return router.push("/auth/login"); }
    const { error: profileError } = await supabase.from("profiles").upsert({ id: user.id, full_name: form.fullName || user.user_metadata?.full_name || "Filmmaker", role: "filmmaker", email: user.email, country: form.country, city: form.city, onboarding_completed: true });
    if (profileError) { setLoading(false); return setError(profileError.message); }
    const { error: filmmakerError } = await supabase.from("filmmakers").insert({ user_id: user.id, company_name: form.companyName, bio: form.bio, website_url: form.websiteUrl });
    setLoading(false);
    if (filmmakerError) return setError(filmmakerError.message);
    router.push("/dashboard/filmmaker/projects/new"); router.refresh();
  }
  return <form onSubmit={submit} className="space-y-4"><Input placeholder="Full name" value={form.fullName || ""} onChange={(e)=>update("fullName", e.target.value)} /><Input placeholder="Company / studio name" value={form.companyName || ""} onChange={(e)=>update("companyName", e.target.value)} /><Input placeholder="Country" value={form.country || ""} onChange={(e)=>update("country", e.target.value)} /><Input placeholder="City" value={form.city || ""} onChange={(e)=>update("city", e.target.value)} /><Input placeholder="Website URL" value={form.websiteUrl || ""} onChange={(e)=>update("websiteUrl", e.target.value)} /><Textarea placeholder="Tell editors what kind of projects you produce" value={form.bio || ""} onChange={(e)=>update("bio", e.target.value)} />{error && <p className="text-sm text-red-500">{error}</p>}<Button disabled={loading}>{loading ? "Saving..." : "Continue"}</Button></form>;
}
