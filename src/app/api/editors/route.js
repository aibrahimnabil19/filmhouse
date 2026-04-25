import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true";

  let query = supabase.from("editors").select("*, profiles(full_name, avatar_url)");
  if (!all) {
    query = query.eq("verification_status", "approved");
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ editors: data });
}