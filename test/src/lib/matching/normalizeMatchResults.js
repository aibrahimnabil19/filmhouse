export function buildMatchReason({ editor, score }) {
  const percent = Math.round((score.finalScore || 0) * 100);
  const strengths = [];
  if ((score.semanticScore || 0) > 0.78) strengths.push("strong semantic similarity with the project brief");
  if ((editor.years_experience || 0) >= 5) strengths.push(`${editor.years_experience} years of editing experience`);
  if (editor.availability_status === "available") strengths.push("currently available");
  if ((editor.rating_avg || 0) >= 4) strengths.push("strong ratings");
  return `This editor is a ${percent}% match because of ${strengths.join(", ") || "a balanced fit across your project needs"}.`;
}

export function normalizeMatchResults(results) {
  return results.map((item) => ({ ...item, percentage: Math.round((item.final_score || item.finalScore || 0) * 100) }));
}
