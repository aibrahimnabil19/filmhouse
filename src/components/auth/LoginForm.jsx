"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault(); setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    router.push("/dashboard"); router.refresh();
  }
  return <form onSubmit={submit} className="space-y-4"><Input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} /><Input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />{error && <p className="text-sm text-red-500">{error}</p>}<Button className="w-full" disabled={loading}>{loading ? "Signing in..." : "Login"}</Button></form>;
}
