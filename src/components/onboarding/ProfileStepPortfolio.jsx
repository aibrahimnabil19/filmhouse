import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
export default function ProfileStepPortfolio({ form, update }) { return <div className="space-y-4"><Textarea placeholder="Portfolio summary: the kinds of projects you have edited, clients, achievements..." value={form.portfolioSummary || ""} onChange={(e)=>update("portfolioSummary", e.target.value)} /><Input placeholder="Portfolio video URL: YouTube/Vimeo/Behance" value={form.portfolioUrl || ""} onChange={(e)=>update("portfolioUrl", e.target.value)} /></div>; }
