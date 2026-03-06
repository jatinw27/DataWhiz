export function generateInsights(data) {

  if (!Array.isArray(data) || data.length === 0) return null;

  const keys = Object.keys(data[0]);

  if (keys.length !== 2) return null;

  const [dimension, metric] = keys;

  const sorted = [...data].sort((a, b) => b[metric] - a[metric]);

  const top = sorted[0];
  const second = sorted[1];

  let insights = [];

  if (top) {
    insights.push(
      `${top[dimension]} has the highest ${metric} (${top[metric]}).`
    );
  }

  if (second) {
    insights.push(
      `${second[dimension]} is the second highest with ${second[metric]}.`
    );
  }

  return insights.join(" ");
}