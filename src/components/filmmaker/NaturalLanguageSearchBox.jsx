"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import MatchResultsList from "./MatchResultsList";

export default function NaturalLanguageSearchBox({ projectId, initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  async function search() {
    setLoading(true);
    setError("");
    setHasSearched(true);
    const res = await fetch("/api/matching/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, query }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) return setError(json.error || "Search failed");
    setMatches(json.matches || []);
  }

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="e.g. I need an editor for an emotional documentary on climate change — cinematic style, strong interview pacing, color grading experience, and familiarity with archival footage."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="min-h-36"
      />
      <div className="flex items-center gap-3">
        <Button onClick={search} disabled={loading || query.trim().length < 10}>
          {loading ? "Finding matches..." : "Find matching editors"}
        </Button>
        {hasSearched && matches.length > 0 && (
          <p className="text-sm text-slate-500">{matches.length} editors found</p>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {hasSearched && !loading && matches.length === 0 && !error && (
        <p className="text-sm text-slate-500">
          No matching editors found. Try adding more detail about genre, style, or software.
        </p>
      )}
      <MatchResultsList matches={matches} />
    </div>
  );
}