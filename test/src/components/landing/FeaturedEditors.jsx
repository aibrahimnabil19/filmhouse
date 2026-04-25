import EditorProfileCard from "@/components/editor/EditorProfileCard";
const editors = [
  { full_name: "Maya Reed", headline: "Documentary & social impact editor", years_experience: 7, availability_status: "available", rating_avg: 4.9 },
  { full_name: "Leo Carter", headline: "Commercials, trailers & music videos", years_experience: 6, availability_status: "busy", rating_avg: 4.7 },
  { full_name: "Amina Bello", headline: "Wedding films and cinematic color", years_experience: 5, availability_status: "available", rating_avg: 4.8 },
];
export default function FeaturedEditors() { return <section className="bg-slate-50 px-6 py-20 dark:bg-slate-900"><div className="mx-auto max-w-7xl"><h2 className="text-3xl font-bold">Featured editor profiles</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{editors.map((e) => <EditorProfileCard key={e.full_name} editor={e} />)}</div></div></section>; }
