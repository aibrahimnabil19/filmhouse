"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import MatchResultsList from "./MatchResultsList";

export default function NaturalLanguageSearchBox({ projectId }) {
  const [query, setQuery] = useState(""); const [matches, setMatches] = useState([]); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  async function search() { setLoading(true); setError(""); const res = await fetch("/api/matching/search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId, query }) }); const json = await res.json(); setLoading(false); if (!res.ok) return setError(json.error || "Search failed"); setMatches(json.matches || []); }
  return <div className="space-y-4"><Textarea placeholder="Describe the editor you need..." value={query} onChange={(e)=>setQuery(e.target.value)} /><Button onClick={search} disabled={loading || query.length < 10}>{loading ? "Finding matches..." : "Find matching editors"}</Button>{error && <p className="text-sm text-red-500">{error}</p>}<MatchResultsList matches={matches} /></div>;
}
