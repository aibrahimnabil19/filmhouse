import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function Button({ className, variant = "default", size = "md", asChild = false, href, children, ...props }) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-50",
    variant === "default" && "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    variant === "secondary" && "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 shadow-sm",
    variant === "outline" && "border-2 border-indigo-600 text-indigo-600 bg-transparent hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950",
    variant === "ghost" && "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
    size === "sm" && "h-9 px-4 text-sm",
    size === "md" && "h-11 px-5 text-sm",
    size === "lg" && "h-12 px-7 text-base",
    className
  );

  if (asChild && href) return <Link href={href} className={classes}>{children}</Link>;
  return <button className={classes} {...props}>{children}</button>;
}