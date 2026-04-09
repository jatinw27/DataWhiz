import { generateAutoAnalysis } from "./autoAnalysis.js";
import { generateAISummary } from "./aiSummary.js";
export async function generateDashboard(dataSource) {
  console.log("🔥 NEW DASHBOARD LOGIC RUNNING");

  const stats = await dataSource.getColumnStats();
  const insights = await dataSource.getInsights();

  const charts = [];

  // ✅ SMART FILTER
  insights
    .filter(i => {
      const col = i.column.toLowerCase();
      const meta = stats[i.column];

      return (
        i.type === "topValues" &&
        meta.type === "string" &&
        meta.uniqueCount <= 50 &&
        !col.includes("id") &&
        !col.includes("email") &&
        !col.includes("phone") &&
        !col.includes("website")
      );
    })
    .slice(0, 3)
    .forEach(i => {
      charts.push({
        type: "topValues",
        column: i.column,
        values: i.values.map(([name, count]) => ({
          name,
          count
        }))
      });
    });

  // ✅ FALLBACK (STRONG)
  if (charts.length === 0) {
    const fallback = insights.find(i => {
      const col = i.column.toLowerCase();
      return (
        i.type === "topValues" &&
        !col.includes("id") &&
        !col.includes("email") &&
        !col.includes("phone")
      );
    });

    if (fallback) {
      charts.push({
        type: "topValues",
        column: fallback.column,
        values: fallback.values.map(([name, count]) => ({
          name,
          count
        }))
      });
    }
  }

  // ✅ NUMERIC CHART (RELAXED)
  const numericCol = Object.entries(stats).find(
    ([col, meta]) =>
      meta.type === "number" &&
      meta.uniqueCount > 5 &&
      col !== "Index"
  );

  if (numericCol) {
    charts.push({
      type: "histogram",
      x: numericCol[0],
      y: numericCol[0]
    });
  }

  const sampleData = (await dataSource.runQuery({}))?.slice(0, 100);
let aiSummary = null;

try {
  aiSummary = await generateAISummary(dataSource);
} catch (err) {
  console.log("AI failed, fallback used");
}
  // console.log("FINAL CHARTS:", charts.length);
const summary = await generateAutoAnalysis(dataSource);
  return {
    stats,
    insights,
    charts,
    data: sampleData,
    summary
    aiSummary
  };
}