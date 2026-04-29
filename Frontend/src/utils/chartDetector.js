export function detectChartType(data) {
  if (!data || data.length === 0) return null;

  const keys = Object.keys(data[0]);

  // Detect grouped data (label + value)
  if (keys.includes("label") && keys.includes("value")) {
    if (data.length <= 5) return "pie";
    return "bar";
  }

  // Detect numeric column → histogram
  const numericKeys = keys.filter(k =>
    data.every(row => !isNaN(Number(row[k])))
  );

  if (numericKeys.length > 0) {
    return {
      type: "histogram",
      x: numericKeys[0]
    };
  }

  return "bar";
}