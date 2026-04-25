import { createClient } from "@/lib/supabase/server";
import EditorProfileHeader from "@/components/editor/EditorProfileHeader";
import EditorRateCard from "@/components/editor/EditorRateCard";
import PortfolioGrid from "@/components/editor/PortfolioGrid";

export default async function EditorDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: editor } = await supabase.from("editors").select("*, profiles(full_name, avatar_url)").eq("id", id).single();
  const { data: portfolio = [] } = await supabase.from("portfolio_items").select("*").eq("editor_id", id);
  if (!editor) return <main className="p-6">Editor not found.</main>;
  return <main className="mx-auto max-w-5xl px-6 py-12"><EditorProfileHeader editor={editor} /><div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px]"><section><h2 className="text-xl font-bold">About</h2><p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{editor.bio}</p><h2 className="mt-8 text-xl font-bold">Portfolio</h2><div className="mt-4"><PortfolioGrid items={portfolio} /></div></section><EditorRateCard editor={editor} /></div></main>;
}
