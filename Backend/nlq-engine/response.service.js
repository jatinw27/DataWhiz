export function toNaturalLanguage(rows) {
  if (!rows || rows.length === 0) return "No data found.";

  const row = rows[0];

  if (row.count !== undefined) {
    return `There are ${row.count} records.`;
  }

  if (row.value !== undefined) {
    return `The result is ${row.value}.`;
  }

  // 👇 NEW: handle full table results
  if (rows.length > 3) {
    return `I found ${rows.length} matching records. You can refine your question for details.`;
  }

  return rows
    .map(r =>
      Object.entries(r)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")
    )
    .join(". ");
}
