import { cn } from "@/lib/utils/cn";
export function Badge({ className, variant = "default", ...props }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
      variant === "default" && "bg-indigo-600 text-white",
      variant === "secondary" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
      className
    )} {...props} />
  );
}