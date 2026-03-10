export async function generateDashboard(dataSource) {

  const stats = await dataSource.getColumnStats();
  const insights = await dataSource.getInsights();

  const charts = [];

  Object.entries(stats).forEach(([col, info]) => {

    // categorical column -> bar chart
    if (info.type === "string" && info.uniqueCount < 15) {
      charts.push({
        type: "bar",
        x: col,
        y: "count"
      });
    }

    // numeric column -> histogram
    if (info.type === "number") {
      charts.push({
        type: "histogram",
        x: col,
        y: col
      });
    }

  });

  return {
    stats,
    insights,
    charts
  };
}

