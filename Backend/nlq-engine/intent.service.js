export function parseIntent(question = "") {
  if (typeof question !== "string") return null;

  const q = question.toLowerCase();

  if (
    q.includes("count") ||
    q.includes("how many")
  ) {
    return "count";
  }

  return "select";
}
