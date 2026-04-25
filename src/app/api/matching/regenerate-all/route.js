import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
export async function POST() {
  const supabase = createAdminClient();
  const { data: editors, error } = await supabase.from("editors").select("id");
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ message: "Call /api/matching/generate-editor-embedding for each editor from an admin job.", editorIds: editors.map((e) => e.id) });
}
