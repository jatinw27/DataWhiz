import { generateInsights } from "../utils/insightGenerator.js";

export function toNaturalLanguage(rows) {
  if (!rows || rows.length === 0) {
    return {
      text: "No data found.",
      data: [],
      insights: null
    };
  }

  const row = rows[0];
  const insights = generateInsights(rows);

  // COUNT cases
  if (row.count !== undefined) {
    return {
      text: `There are ${row.count} records.`,
      data: rows,
      insights
    };
  }

  if (row["count(*)"] !== undefined) {
    return {
      text: `There are ${row["count(*)"]} records.`,
      data: rows,
      insights
    };
  }

  if (row.value !== undefined) {
    return {
      text: `The result is ${row.value}.`,
      data: rows,
      insights
    };
  }

  // Default (table output)
  const text = rows
    .map(r =>
      Object.entries(r)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")
    )
    .join(". ");

  return {
    text,
    data: rows,
    insights
  };
}