import EditorProfileCard from "@/components/editor/EditorProfileCard";
import { createClient } from "@/lib/supabase/server";

export default async function EditorsPage() {
  const supabase = await createClient();
  const { data: editors = [] } = await supabase.from("editors").select("*, profiles(full_name, avatar_url)").eq("verification_status", "approved").limit(24);
  return <main className="mx-auto max-w-7xl px-6 py-12"><h1 className="text-3xl font-bold">Find editors</h1><p className="mt-2 text-slate-500">Browse approved FilmHouse editor profiles.</p><div className="mt-8 grid gap-5 md:grid-cols-3">{editors.map((editor)=><EditorProfileCard key={editor.id} editor={editor} />)}</div></main>;
}
