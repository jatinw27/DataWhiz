
export function detectCondition(question, table, schema) {
  const q = question.toLowerCase();
  const columns = schema[table] || [];

  // 1️⃣ Extract number
  const value = q.match(/\d+/)?.[0];
  if (!value) return null;

  // 2️⃣ Choose column
  let targetColumn = columns.find(col => q.includes(col));

  // fallback for common analytics
  if (!targetColumn && columns.includes("age")) {
    targetColumn = "age";
  }

  if (!targetColumn) return null;

  // 3️⃣ Operators
  if (
    q.includes("greater than") ||
    q.includes("older than") ||
    q.includes("above")
  ) {
    return `${targetColumn} > ${value}`;
  }

  if (
    q.includes("less than") ||
    q.includes("below") ||
    q.includes("younger than")
  ) {
    return `${targetColumn} < ${value}`;
  }

  if (
    q.includes("equal to") ||
    q.includes("equals") ||
    q.includes(" is ")
  ) {
    return `${targetColumn} = ${value}`;
  }

  return null;
}
