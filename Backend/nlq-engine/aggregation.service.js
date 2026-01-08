export function detectAggregation(question, table, schema) {
  const q = question.toLowerCase();
  const columns = schema[table] || [];

  // ✅ COUNT
  if (q.includes("how many") || q.includes("count")) {
    return "count";
  }

  let targetColumn = columns.find(col => q.includes(col));

  if (!targetColumn && columns.includes("age")) {
    targetColumn = "age";
  }

  if (!targetColumn) return null;

  if (q.includes("average") || q.includes("avg")) {
    return `AVG(${targetColumn})`;
  }

  if (q.includes("maximum") || q.includes("max")) {
    return `MAX(${targetColumn})`;
  }

  if (q.includes("minimum") || q.includes("min")) {
    return `MIN(${targetColumn})`;
  }

  if (q.includes("sum") || q.includes("total")) {
    return `SUM(${targetColumn})`;
  }

  return null;
}
