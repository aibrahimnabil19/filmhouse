import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET() { const supabase = await createClient(); const { data, error } = await supabase.from("editors").select("*, profiles(full_name, avatar_url)").eq("verification_status", "approved"); if (error) return NextResponse.json({ error: error.message }, { status: 400 }); return NextResponse.json({ editors: data }); }
