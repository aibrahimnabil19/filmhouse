import RoleSelector from "@/components/auth/RoleSelector";
export default function OnboardingPage() { return <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6"><h1 className="text-3xl font-bold">Choose your role</h1><p className="mt-2 text-slate-500">This controls the dashboard and onboarding flow.</p><div className="mt-8"><RoleSelector /></div></main>; }
