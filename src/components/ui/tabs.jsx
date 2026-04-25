"use client";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
export function Tabs({ tabs = [], defaultValue, className }) {
  const [active, setActive] = useState(defaultValue || tabs[0]?.value);
  const current = tabs.find((tab) => tab.value === active);
  return <div className={className}><div className="flex gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-900">{tabs.map((tab) => <button key={tab.value} onClick={() => setActive(tab.value)} className={cn("flex-1 rounded-lg px-3 py-2 text-sm font-medium", active === tab.value ? "bg-white shadow-sm dark:bg-slate-800" : "text-slate-500")}>{tab.label}</button>)}</div><div className="mt-4">{current?.content}</div></div>;
}
