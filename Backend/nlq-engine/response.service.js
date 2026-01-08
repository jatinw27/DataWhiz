export function toNaturalLanguage(rows) {
  if (!rows || rows.length === 0) {
    return "No results found.";
  }

  // 🔢 COUNT queries
  if (rows.length === 1 && rows[0].count !== undefined) {
    return `There are ${rows[0].count} records.`;
  }

  // 📊 AGGREGATION queries
  if (rows.length === 1 && rows[0].value !== undefined) {
    return `The result is ${rows[0].value}.`;
  }

  // 🧾 GENERIC RECORD LIST
  return rows
    .slice(0, 10) // prevent huge replies
    .map(row => {
      return Object.entries(row)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
    })
    .join(". ") + ".";
}
