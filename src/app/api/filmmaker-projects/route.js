import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createEmbedding } from "@/lib/openai/embeddings";
import { buildProjectQueryText } from "@/lib/matching/buildProjectQueryText";

export async function POST(request) {
  const body = await request.json();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: filmmaker, error: filmmakerError } = await supabase
    .from("filmmakers")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (filmmakerError) return NextResponse.json({ error: "Create filmmaker profile first" }, { status: 400 });

  const projectPayload = {
    filmmaker_id: filmmaker.id,
    title: body.title,
    description: body.description,
    natural_language_query: body.naturalLanguageQuery,
    genre: body.genre,
    project_type: body.projectType,
    budget_min: body.budgetMin || null,
    budget_max: body.budgetMax || null,
    deadline: body.deadline || null,
    style_preferences: body.stylePreferences,
    status: "searching",
  };

  // Generate embedding — don't fail project creation if this errors
  let embedding = null;
  try {
    embedding = await createEmbedding(buildProjectQueryText(projectPayload));
  } catch (err) {
    console.warn("Could not generate project embedding:", err.message);
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...projectPayload, ...(embedding ? { query_embedding: embedding } : {}) })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ project: data });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If unauthenticated fall through gracefully (returns empty)
  if (!user) return NextResponse.json({ projects: [] });

  // Scope to the current filmmaker's projects only
  const { data: filmmaker } = await supabase
    .from("filmmakers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!filmmaker) return NextResponse.json({ projects: [] });

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("filmmaker_id", filmmaker.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ projects: data });
}