export function generateDashboard(dataSource) {

  const stats = dataSource.getColumnStats();
  const insights = dataSource.getInsights();

  const charts = [];

  Object.entries(stats).forEach(([col, info]) => {

    if (info.type === "string" && info.uniqueCount < 15) {
      charts.push({
        type: "bar",
        column: col
      });
    }

    if (info.type === "number") {
      charts.push({
        type: "histogram",
        column: col
      });
    }

  });

  return {
    stats,
    insights,
    charts
  };
}