export function generateInsights(data) {
  if (!data || data.length === 0) return [];

  const insights = [];
  const keys = Object.keys(data[0]);

  keys.forEach((key) => {
    const values = data.map(row => row[key]).filter(Boolean);

    // only for strings
    if (typeof values[0] !== "string") return;

    const freq = {};

    values.forEach(v => {
      freq[v] = (freq[v] || 0) + 1;
    });

    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (sorted.length > 0) {
      insights.push({
        column: key,
        type: "topValues",
        values: sorted
      });
    }
  });

  return insights;
}