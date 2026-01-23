export function toNaturalLanguage(rows) {
  if (!rows || rows.length === 0) return "No data found.";

  const row = rows[0];

  // ✅ Handle COUNT(*) edge cases
  if (row.count !== undefined) {
    return `There are ${row.count} records.`;
  }

  if (row["count(*)"] !== undefined) {
    return `There are ${row["count(*)"]} records.`;
  }

  if (row.value !== undefined) {
    return `The result is ${row.value}.`;
  }

  return rows
    .map(r =>
      Object.entries(r)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")
    )
    .join(". ");
}
