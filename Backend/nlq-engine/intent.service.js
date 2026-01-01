export function parseIntent(question) {
  const q = question.toLowerCase();

  // Aggregations
  if (q.includes("average") || q.includes("avg")) return "avg";
  if (q.includes("count") || q.includes("how many")) return "count";
  if (q.includes("sum")) return "sum";
  if (q.includes("max")) return "max";
  if (q.includes("min")) return "min";

  // 🔥 DEFAULT INTENT
  // Any filtering / listing query is SELECT
  return "select";
}
