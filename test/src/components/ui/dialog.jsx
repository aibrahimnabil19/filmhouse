export function Dialog({ children }) { return children; }
export function DialogContent({ children, className = "" }) { return <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950 ${className}`}>{children}</div>; }
