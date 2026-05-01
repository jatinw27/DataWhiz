export async function generateDashboard(dataSource) {
  console.log("🔥 NEW DASHBOARD LOGIC RUNNING");

  let stats = {};
  let insights = [];

  //  get data FIRST
  const data = await dataSource.runQuery({}) || [];

  //  STATS
  try {
    if (dataSource.getColumnStats) {
      stats = await dataSource.getColumnStats();
    }
  } catch (e) {
    console.log("Stats failed:", e.message);
  }

  //  INSIGHTS (primary)
  try {
    if (dataSource.getInsights) {
      insights = await dataSource.getInsights();
    }
  } catch (e) {
    console.log("Insights failed:", e.message);
  }

  //  fallback stats
  if (Object.keys(stats).length === 0 && data.length > 0) {
    const sample = data[0];
    for (let key in sample) {
      stats[key] = {
        type: typeof sample[key],
        uniqueCount: new Set(data.map(d => d[key])).size
      };
    }
  }

  
  //  MULTI-COLUMN SMART INSIGHTS
if ((!insights || insights.length === 0) && data.length > 0) {
  const columns = Object.keys(data[0]);

  insights = columns
    .filter(col => {
      const val = data[0][col];
      return (
        typeof val === "string" &&
        !col.toLowerCase().includes("id") &&
        !col.toLowerCase().includes("email") &&
        !col.toLowerCase().includes("phone") &&
        !col.toLowerCase().includes("website")
      );
    })
    .slice(0, 3) 
    .map(col => {
      const counts = {};

      data.forEach(d => {
        const value = d[col];
        counts[value] = (counts[value] || 0) + 1;
      });

      return {
        type: "topValues",
        column: col,
        values: Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
      };
    });
}

  //  charts
  const charts = insights.slice(0, 2).map(i => ({
    type: "topValues",
    column: i.column,
    values: i.values.map(([name, count]) => ({ name, count }))
  }));

  //  summary
  const summary = [
    `Dataset has ${data.length} rows`,
    `Columns: ${Object.keys(data[0] || {}).length}`
  ];

  let aiSummary = null;

  try {
    aiSummary = await generateAISummary(dataSource);
  } catch {
    console.log("AI summary skipped");
  }

  return {
    stats,
    insights,
    charts,
    data: data.slice(0, 100),
    summary,
    aiSummary,
  };
}