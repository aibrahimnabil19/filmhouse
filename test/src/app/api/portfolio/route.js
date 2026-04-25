import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function POST(request) { const body = await request.json(); const supabase = await createClient(); const { data, error } = await supabase.from("portfolio_items").insert(body).select("*").single(); if (error) return NextResponse.json({ error: error.message }, { status: 400 }); return NextResponse.json({ item: data }); }
