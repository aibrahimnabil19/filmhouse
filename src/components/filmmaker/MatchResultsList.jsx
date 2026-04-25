import MatchScoreCard from "./MatchScoreCard";
export default function MatchResultsList({ matches = [] }) { if (!matches.length) return null; return <div className="mt-8 space-y-4"><h2 className="text-xl font-bold">Recommended editors</h2>{matches.map((match)=><MatchScoreCard key={match.editorId} match={match} />)}</div>; }
