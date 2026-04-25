export function buildEditorProfileText({ editor, profile, specializations = [], genres = [], software = [], portfolio = [] }) {
  return [
    `Editor name: ${profile?.full_name || "Unknown"}`,
    `Headline: ${editor?.headline || ""}`,
    `Bio: ${editor?.bio || ""}`,
    `Years of experience: ${editor?.years_experience || 0}`,
    `Availability: ${editor?.availability_status || "unknown"}`,
    `Rates: hourly ${editor?.hourly_rate || "not set"}, project ${editor?.project_rate_min || ""}-${editor?.project_rate_max || ""}`,
    `Specializations: ${specializations.map((x) => x.specialization || x).join(", ")}`,
    `Genres: ${genres.map((x) => x.genre || x).join(", ")}`,
    `Software: ${software.map((x) => `${x.software || x} ${x.proficiency || ""}`).join(", ")}`,
    `Portfolio summary: ${editor?.portfolio_summary || ""}`,
    `Portfolio items: ${portfolio.map((p) => `${p.title}: ${p.description || ""} ${p.genre || ""} ${p.role_in_project || ""}`).join(" | ")}`,
    `Previous clients: ${(editor?.previous_clients || []).join(", ")}`,
  ].filter(Boolean).join("\n");
}
