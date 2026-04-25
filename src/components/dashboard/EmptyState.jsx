import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EmptyState({ title, description, href, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-800">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>
      {href && action && (
        <Link href={href}>
          <Button className="mt-5">{action}</Button>
        </Link>
      )}
    </div>
  );
}