import { Badge } from "@/components/ui/badge";
export default function EditorSkillBadges({ skills = [] }) { return <div className="flex flex-wrap gap-2">{skills.slice(0, 6).map((skill)=><Badge key={skill} variant="secondary">{skill}</Badge>)}</div>; }
