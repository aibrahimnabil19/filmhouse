import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function Button({ className, variant = "default", size = "md", asChild = false, href, children, ...props }) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-xl font-medium transition disabled:pointer-events-none disabled:opacity-50",
    variant === "default" && "bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200",
    variant === "secondary" && "bg-slate-100 text-slate-950 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",
    variant === "outline" && "border border-slate-200 bg-transparent hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900",
    variant === "ghost" && "hover:bg-slate-100 dark:hover:bg-slate-900",
    size === "sm" && "h-9 px-3 text-sm",
    size === "md" && "h-11 px-5 text-sm",
    size === "lg" && "h-12 px-6 text-base",
    className
  );

  if (asChild && href) return <Link href={href} className={classes}>{children}</Link>;
  return <button className={classes} {...props}>{children}</button>;
}
