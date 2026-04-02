export function detectChart(data) {

  if (!Array.isArray(data) || data.length === 0) return null;

  const keys = Object.keys(data[0]);

  if (keys.length !== 2) return null;

  const [col1, col2] = keys;

  const numericCount = data.filter(
    r => typeof r[col2] === "number"
  ).length;

  if (numericCount === data.length) {

    return {
      type: "bar",
      x: col1,
      y: col2
    };

  }

  return null;
}