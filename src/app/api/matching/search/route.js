import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createEmbedding } from "@/lib/openai/embeddings";
import { calculateMatchScore } from "@/lib/matching/calculateMatchScore";
import { buildMatchReason } from "@/lib/matching/normalizeMatchResults";

export async function POST(request) {
  const body = await request.json();
  const query = body.query?.trim();
  if (!query) return NextResponse.json({ error: "Query is required" }, { status: 400 });

  const supabase = await createClient();
  const embedding = await createEmbedding(query);

  let project = null;
  if (body.projectId) {
    const { data } = await supabase.from("projects").select("*").eq("id", body.projectId).single();
    project = data;
    if (data) {
      await supabase
        .from("projects")
        .update({ natural_language_query: query, query_embedding: embedding })
        .eq("id", body.projectId);
    }
  }

  const { data: vectorResults, error } = await supabase.rpc("match_editors", {
    query_embedding: embedding,
    match_count: 20,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Fetch profile names for matched editors in one query
  const editorIds = (vectorResults || []).map((e) => e.editor_id);
  let profilesByEditorId = {};
  if (editorIds.length > 0) {
    const { data: editorProfiles } = await supabase
      .from("editors")
      .select("id, profiles(full_name, avatar_url)")
      .in("id", editorIds);
    if (editorProfiles) {
      for (const ep of editorProfiles) {
        profilesByEditorId[ep.id] = ep.profiles;
      }
    }
  }

  const matches = (vectorResults || [])
    .map((editor) => {
      const score = calculateMatchScore({ editor, semanticScore: editor.semantic_score, project });
      const profile = profilesByEditorId[editor.editor_id];
      return {
        editorId: editor.editor_id,
        userId: editor.user_id,
        fullName: profile?.full_name || null,
        avatarUrl: profile?.avatar_url || null,
        headline: editor.headline,
        yearsExperience: editor.years_experience,
        availabilityStatus: editor.availability_status,
        semanticScore: score.semanticScore,
        finalScore: score.finalScore,
        percentage: Math.round(score.finalScore * 100),
        matchReason: buildMatchReason({ editor, score }),
      };
    })
    .sort((a, b) => b.finalScore - a.finalScore);

  if (project?.id) {
    await supabase.from("matches").upsert(
      matches.map((m) => ({
        project_id: project.id,
        editor_id: m.editorId,
        semantic_score: m.semanticScore,
        final_score: m.finalScore,
        match_reason: m.matchReason,
      }))
    );
  }

  return NextResponse.json({ matches });
}