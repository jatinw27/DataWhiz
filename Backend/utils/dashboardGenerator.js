export async function generateDashboard(dataSource) {
  console.log("🔥 NEW DASHBOARD LOGIC RUNNING");
const insights = await dataSource.getInsights?.() || generateInsights(sampleData);
  let stats = {};
  let insights = [];

  try {
    if (dataSource.getColumnStats) {
      stats = await dataSource.getColumnStats();
    }
  } catch (e) {
    console.log("Stats failed:", e.message);
  }

  try {
    if (dataSource.getInsights) {
      insights = await dataSource.getInsights();
    }
  } catch (e) {
    console.log("Insights failed:", e.message);
  }

  // ✅ fallback data
  const data = await dataSource.runQuery({}) || [];

  // ✅ fallback stats (if missing)
  if (Object.keys(stats).length === 0 && data.length > 0) {
    const sample = data[0];
    for (let key in sample) {
      stats[key] = {
        type: typeof sample[key],
        uniqueCount: new Set(data.map(d => d[key])).size
      };
    }
  }

  // ✅ fallback insights (if missing)
  if (!insights.length && data.length > 0) {
    const key = Object.keys(data[0])[0];

    const counts = {};
    data.forEach(d => {
      counts[d[key]] = (counts[d[key]] || 0) + 1;
    });

    insights.push({
      type: "topValues",
      column: key,
      values: Object.entries(counts).slice(0, 5)
    });
  }

  // ✅ charts
  const charts = insights.slice(0, 2).map(i => ({
    type: "topValues",
    column: i.column,
    values: i.values.map(([name, count]) => ({ name, count }))
  }));

  // ✅ summary
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