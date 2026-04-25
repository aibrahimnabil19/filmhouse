"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  function update(key, value) { setForm((f) => ({ ...f, [key]: value })); }
  async function submit(e) {
    e.preventDefault(); setLoading(true); setError("");
    const { error } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.fullName } } });
    setLoading(false);
    if (error) return setError(error.message);
    router.push("/onboarding");
  }
  return <form onSubmit={submit} className="space-y-4"><Input placeholder="Full name" value={form.fullName} onChange={(e)=>update("fullName", e.target.value)} /><Input type="email" placeholder="Email" value={form.email} onChange={(e)=>update("email", e.target.value)} /><Input type="password" placeholder="Password" value={form.password} onChange={(e)=>update("password", e.target.value)} />{error && <p className="text-sm text-red-500">{error}</p>}<Button className="w-full" disabled={loading}>{loading ? "Creating account..." : "Create account"}</Button></form>;
}
