import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 py-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">FilmHouse</Link>
        <div className="hidden items-center gap-6 text-sm text-green-600 dark:text-slate-300 md:flex">
          <Link href="/editors">Find editors</Link>
          <Link href="/auth/register">Become an editor</Link>
          <Link href="/auth/login">Login</Link>
        </div>
        <Button asChild href="/auth/register">Get started</Button>
      </nav>
      <div className="mx-auto grid max-w-7xl gap-12 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <Badge variant="secondary">AI-powered post-production matchmaking</Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">Find the right video editor by describing your project.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">FilmHouse matches filmmakers with editors based on storytelling style, genre, software, pacing, availability, experience, and portfolio relevance.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild href="/onboarding/filmmaker" size="lg">Find an editor</Button>
            <Button asChild href="/onboarding/editor" variant="outline" size="lg">Apply as editor</Button>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          <div className="rounded-2xl bg-white p-5 dark:bg-slate-950">
            <p className="text-sm font-semibold">Describe your project</p>
            <div className="mt-4 rounded-2xl border border-slate-200 p-4 text-sm leading-7 text-slate-600 dark:border-slate-800 dark:text-slate-300">I need an editor experienced in emotional documentary storytelling with cinematic color grading, interview pacing, archival footage, and strong sound design.</div>
            <div className="mt-5 space-y-3">
              {["Documentary editor · 94% match", "Color grading specialist · 89% match", "Social impact film editor · 86% match"].map((x) => <div key={x} className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-800">{x}</div>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
