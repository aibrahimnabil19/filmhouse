import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createEmbedding } from "@/lib/openai/embeddings";
import { buildEditorProfileText } from "@/lib/matching/buildEditorProfileText";

export async function POST(request) {
  const { editorId } = await request.json();
  if (!editorId) return NextResponse.json({ error: "editorId is required" }, { status: 400 });
  const supabase = await createClient();
  const { data: editor, error } = await supabase.from("editors").select("*, profiles(*)").eq("id", editorId).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  const [{ data: specializations = [] }, { data: genres = [] }, { data: software = [] }, { data: portfolio = [] }] = await Promise.all([
    supabase.from("editor_specializations").select("specialization").eq("editor_id", editorId),
    supabase.from("editor_genres").select("genre").eq("editor_id", editorId),
    supabase.from("editor_software").select("software, proficiency").eq("editor_id", editorId),
    supabase.from("portfolio_items").select("*").eq("editor_id", editorId),
  ]);
  const text = buildEditorProfileText({ editor, profile: editor.profiles, specializations, genres, software, portfolio });
  const embedding = await createEmbedding(text);
  const { error: updateError } = await supabase.from("editors").update({ profile_search_text: text, profile_embedding: embedding }).eq("id", editorId);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });
  return NextResponse.json({ ok: true, profileSearchText: text });
}
