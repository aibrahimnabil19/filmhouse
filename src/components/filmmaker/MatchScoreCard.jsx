import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import AvailabilityBadge from "@/components/editor/AvailabilityBadge";

export default function MatchScoreCard({ match }) {
  const name = match.fullName || match.headline || "Editor";
  const percentage = match.percentage ?? Math.round((match.finalScore || 0) * 100);

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar name={name} src={match.avatarUrl} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{name}</h3>
                {match.headline && (
                  <p className="mt-0.5 text-sm text-slate-500">{match.headline}</p>
                )}
              </div>
              <div
                className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                  percentage >= 80
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    : percentage >= 60
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {percentage}% match
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              {match.yearsExperience > 0 && (
                <span>{match.yearsExperience}+ yrs experience</span>
              )}
              {match.availabilityStatus && (
                <AvailabilityBadge status={match.availabilityStatus} />
              )}
            </div>
          </div>
        </div>

        {match.matchReason && (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{match.matchReason}</p>
        )}

        <div className="mt-4 flex gap-2">
          <Button size="sm" asChild href={`/editors/${match.editorId}`}>
            View profile
          </Button>
          <Button size="sm" variant="outline">
            Shortlist
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}