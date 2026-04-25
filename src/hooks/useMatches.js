"use client";
import { useState } from "react";
export function useMatches() { const [matches, setMatches] = useState([]); const [loading, setLoading] = useState(false); async function search(payload){ setLoading(true); const res = await fetch("/api/matching/search", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload) }); const json = await res.json(); setMatches(json.matches || []); setLoading(false); return json; } return { matches, loading, search }; }
