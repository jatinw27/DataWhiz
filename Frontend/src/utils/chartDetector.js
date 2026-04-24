export function detectChart(data) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const keys = Object.keys(data[0]);

  if (keys.length === 2) {
    const secondKey = keys[1];

    if (typeof data[0][secondKey] === "number") {
      return "bar";
    }
  }

  return null;
}