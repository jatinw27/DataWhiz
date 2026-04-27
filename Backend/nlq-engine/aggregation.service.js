export function detectAggregation(question, table, schema) {
  const q = question.toLowerCase();
  const columns = schema[table] || [];

  //  COUNT
  if (q.includes("how many") || q.includes("count")) {
    return "count";
  }

  return null;
}
