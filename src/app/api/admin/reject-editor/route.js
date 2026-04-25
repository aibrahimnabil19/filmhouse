import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
export async function POST(request) { const { editorId } = await request.json(); const supabase = createAdminClient(); const { error } = await supabase.from("editors").update({ verification_status: "rejected" }).eq("id", editorId); if (error) return NextResponse.json({ error: error.message }, { status: 400 }); return NextResponse.json({ ok: true }); }
