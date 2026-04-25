export function DropdownMenu({ children }) { return <div className="relative">{children}</div>; }
export function DropdownMenuItem({ children, className = "" }) { return <div className={`cursor-pointer rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 ${className}`}>{children}</div>; }
