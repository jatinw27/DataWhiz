export function detectChart(data) {
  if (!data || data.length === 0) return null;

  const keys = Object.keys(data[0]);

  // numeric + category → bar
  if (keys.length >= 2) {
    return "bar";
  }

  return null;
}