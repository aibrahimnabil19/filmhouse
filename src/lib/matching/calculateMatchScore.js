function clamp(value, min = 0, max = 1) { return Math.max(min, Math.min(max, Number(value) || 0)); }
export function calculateMatchScore({ editor, semanticScore, project }) {
  const experienceScore = clamp((editor.years_experience || 0) / 10);
  const ratingScore = clamp((editor.rating_avg || 0) / 5);
  const availabilityScore = editor.availability_status === "available" ? 1 : editor.availability_status === "busy" ? 0.55 : 0.1;
  let budgetScore = 0.7;
  if (project?.budget_max && editor.project_rate_min) budgetScore = Number(editor.project_rate_min) <= Number(project.budget_max) ? 1 : 0.35;
  const finalScore = clamp(
    clamp(semanticScore) * 0.5 + experienceScore * 0.12 + availabilityScore * 0.13 + ratingScore * 0.1 + budgetScore * 0.15
  );
  return { semanticScore: clamp(semanticScore), experienceScore, ratingScore, availabilityScore, budgetScore, finalScore };
}
