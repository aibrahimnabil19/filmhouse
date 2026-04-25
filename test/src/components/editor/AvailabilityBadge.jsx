import { Badge } from "@/components/ui/badge";
export default function AvailabilityBadge({ status }) { const label = status === "available" ? "Available" : status === "busy" ? "Busy" : "Unavailable"; return <Badge variant={status === "available" ? "default" : "secondary"}>{label}</Badge>; }
