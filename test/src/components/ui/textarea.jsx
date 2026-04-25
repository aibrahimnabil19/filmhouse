import { cn } from "@/lib/utils/cn";
export function Textarea({ className, ...props }) { return <textarea className={cn("min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-white", className)} {...props} />; }
