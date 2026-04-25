import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET(request, { params }) { const { id } = await params; const supabase = await createClient(); const { data, error } = await supabase.from("editors").select("*, profiles(full_name, avatar_url)").eq("id", id).single(); if (error) return NextResponse.json({ error: error.message }, { status: 404 }); return NextResponse.json({ editor: data }); }
