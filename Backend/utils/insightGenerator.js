export function generateInsights(data) {
  if (!data || data.length === 0) return null;

  // sort descending
  const sorted = [...data].sort((a, b) => b.value - a.value);

  const top = sorted[0];
  const avg =
    sorted.reduce((sum, d) => sum + d.value, 0) / sorted.length;

  return `
Top category is ${top.label} with ${top.value} records.
Average count across categories is ${avg.toFixed(1)}.
Distribution is ${top.value > avg * 2 ? "skewed" : "balanced"}.
`;
}