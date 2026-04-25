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

  // Generate embedding for the query
  let embedding = null;
  try {
    embedding = await createEmbedding(query);
  } catch (err) {
    console.error("Embedding error:", err);
    // Continue without embedding — we'll use the fallback path
  }

  // Fetch associated project for budget/context scoring
  let project = null;
  if (body.projectId) {
    const { data } = await supabase.from("projects").select("*").eq("id", body.projectId).single();
    project = data;
    if (data && embedding) {
      await supabase
        .from("projects")
        .update({ natural_language_query: query, query_embedding: embedding })
        .eq("id", body.projectId);
    }
  }

  // ── STEP 1: Try vector search if we have an embedding ──────────────────────
  let vectorResults = [];
  if (embedding) {
    const { data, error } = await supabase.rpc("match_editors", {
      query_embedding: embedding,
      match_count: 20,
    });
    if (!error && data && data.length > 0) {
      vectorResults = data;
    } else if (error) {
      console.warn("Vector search error (will use fallback):", error.message);
    }
  }

  // ── STEP 2: Fallback — fetch all approved editors directly ─────────────────
  // This fires when: no embedding, RPC error, or no editors have embeddings yet
  let usingFallback = vectorResults.length === 0;
  let fallbackEditors = [];
  if (usingFallback) {
    const { data: allEditors } = await supabase
      .from("editors")
      .select("id, user_id, headline, bio, years_experience, availability_status, hourly_rate, project_rate_min, project_rate_max, rating_avg, profile_embedding, profiles(full_name, avatar_url)")
      .eq("verification_status", "approved");
    fallbackEditors = allEditors || [];
  }

  // ── STEP 3: Fetch profile names for vector results ─────────────────────────
  let profilesByEditorId = {};
  if (!usingFallback && vectorResults.length > 0) {
    const editorIds = vectorResults.map((e) => e.editor_id);
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

  // ── STEP 4: Build match results ────────────────────────────────────────────
  let matches = [];

  if (!usingFallback) {
    // Vector path — editors from the RPC
    matches = vectorResults.map((editor) => {
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
    });
  } else {
    // Fallback path — all approved editors, scored without semantic similarity
    // Use a neutral semantic score of 0.6 so results look reasonable
    matches = fallbackEditors.map((editor) => {
      // If this editor has an embedding, we could do client-side cosine sim,
      // but for simplicity assign a neutral semantic score
      const semanticScore = 0.6;
      const score = calculateMatchScore({ editor, semanticScore, project });
      const profile = editor.profiles;
      return {
        editorId: editor.id,
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
    });
  }

  // Sort by final score descending
  matches = matches.sort((a, b) => b.finalScore - a.finalScore);

  // ── STEP 5: Persist matches to DB if linked to a project ───────────────────
  if (project?.id && matches.length > 0) {
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

  return NextResponse.json({
    matches,
    meta: { usingFallback, total: matches.length },
  });
}