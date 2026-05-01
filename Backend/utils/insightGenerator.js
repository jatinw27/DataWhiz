export function generateInsights(data) {
  if (!data || data.length === 0) return [];

  const insights = [];
  const columns = Object.keys(data[0]);

  columns.forEach(col => {
    const values = data.map(d => d[col]);

    // 🔹 STRING ANALYSIS
    if (typeof values[0] === "string") {
      const counts = {};

      values.forEach(v => {
        if (!v) return;
        counts[v] = (counts[v] || 0) + 1;
      });

      const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1]);

      if (sorted.length > 0) {
        const [topValue, count] = sorted[0];

        if (!col.toLowerCase().includes("id") &&
            !col.toLowerCase().includes("email") &&
            !col.toLowerCase().includes("phone")) {

          insights.push(
            `Most common ${col.toLowerCase()} is ${topValue} (${count} records)`
          );
        }
      }
    }

    // 🔹 NUMBER ANALYSIS
    if (typeof values[0] === "number") {
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;

      insights.push(
        `Average ${col.toLowerCase()} is ${avg.toFixed(2)}`
      );
    }

    // 🔹 DATE ANALYSIS
    if (col.toLowerCase().includes("date")) {
      const sortedDates = values
        .map(v => new Date(v))
        .sort((a, b) => a - b);

      if (sortedDates.length > 1) {
        insights.push(
          `${col} ranges from ${sortedDates[0].toDateString()} to ${sortedDates[sortedDates.length - 1].toDateString()}`
        );
      }
    }
  });

  return insights.slice(0, 5); 
}