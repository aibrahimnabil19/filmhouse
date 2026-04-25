import { cn } from "@/lib/utils/cn";
export function Input({ className, ...props }) { return <input className={cn("h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:focus:border-white", className)} {...props} />; }
