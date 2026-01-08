export function parseIntent(question = "") {
  if (typeof question !== "string") return null;

  const q = question.toLowerCase();

  if (
    q.includes("count") ||
    q.includes("how many") ||
    q.includes("number of")
  ) {
    return "count";
  }

  return "select";
}
