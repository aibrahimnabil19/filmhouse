export function Avatar({ src, name = "User", className = "" }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return src ? <img src={src} alt={name} className={`h-11 w-11 rounded-full object-cover ${className}`} /> : <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white ${className}`}>{initials}</div>;
}
