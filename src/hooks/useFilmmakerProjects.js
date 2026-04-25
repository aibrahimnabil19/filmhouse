"use client";
import { useEffect, useState } from "react";
export function useFilmmakerProjects() { const [projects, setProjects] = useState([]); useEffect(()=>{ fetch("/api/filmmaker-projects").then((r)=>r.json()).then((j)=>setProjects(j.projects || [])); }, []); return projects; }
