"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Topbar() {
  const router = useRouter();
  const supabase = createClient();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <header className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Dashboard</p>
        <div className="flex items-center gap-4">
          <p className="text-sm text-slate-500">FilmHouse MVP</p>
          <button
            onClick={logout}
            className="rounded-xl border-2 border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}