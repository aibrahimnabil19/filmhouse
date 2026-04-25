export function buildProjectQueryText(project) {
  return [
    `Project title: ${project.title || ""}`,
    `Project type: ${project.project_type || ""}`,
    `Genre: ${project.genre || ""}`,
    `Description: ${project.description || ""}`,
    `Creative request: ${project.natural_language_query || ""}`,
    `Style preferences: ${project.style_preferences || ""}`,
    `Budget: ${project.budget_min || ""}-${project.budget_max || ""}`,
    `Deadline: ${project.deadline || ""}`,
  ].filter(Boolean).join("\n");
}
