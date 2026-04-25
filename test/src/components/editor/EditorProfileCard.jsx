import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import AvailabilityBadge from "./AvailabilityBadge";

export default function EditorProfileCard({ editor }) {
  const name = editor?.full_name || editor?.profiles?.full_name || "Editor";
  return <Card className="overflow-hidden"><CardContent className="p-5"><div className="flex items-start gap-4"><Avatar name={name} src={editor?.avatar_url || editor?.profiles?.avatar_url} /><div className="min-w-0 flex-1"><h3 className="font-semibold">{name}</h3><p className="mt-1 line-clamp-2 text-sm text-slate-500">{editor?.headline || "Video editor"}</p></div><AvailabilityBadge status={editor?.availability_status} /></div><div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><p className="text-slate-500">Experience</p><p className="font-semibold">{editor?.years_experience || 0}+ years</p></div><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><p className="text-slate-500">Rating</p><p className="font-semibold">{editor?.rating_avg || "New"}</p></div></div>{editor?.id && <Link href={`/editors/${editor.id}`} className="mt-5 inline-flex text-sm font-semibold">View profile →</Link>}</CardContent></Card>;
}
