export function formatDate(date) {
  if (!date) return "No date";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(date));
}
