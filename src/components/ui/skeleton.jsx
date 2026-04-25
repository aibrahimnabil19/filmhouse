import { cn } from "@/lib/utils/cn";
export function Skeleton({ className }) { return <div className={cn("animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800", className)} />; }
