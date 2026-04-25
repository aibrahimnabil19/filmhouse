"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
export function useEditorProfile(userId) { const [editor, setEditor] = useState(null); useEffect(()=>{ if (!userId) return; const supabase = createClient(); supabase.from("editors").select("*").eq("user_id", userId).single().then(({ data }) => setEditor(data)); }, [userId]); return editor; }
