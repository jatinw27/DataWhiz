export async function generateAutoAnalysis(dataSource) {
  const stats = await dataSource.getColumnStats();
  const insights = await dataSource.getInsights();
  const rowCount = await dataSource.getRowCount();

  const columns = Object.keys(stats);

  const analysis = [];

  // Basic info
  analysis.push(
    `This dataset contains ${rowCount} records and ${columns.length} columns.`
  );

  // Missing values
  const missing = insights.filter(i => i.type === "missing");

  if (missing.length === 0) {
    analysis.push("No missing values detected. Data looks clean.");
  } else {
    missing.slice(0, 2).forEach(i => {
      analysis.push(
        `${i.count} missing values found in ${i.column}.`
      );
    });
  }

  // Top patterns
  insights
    .filter(i => i.type === "topValues")
    .slice(0, 2)
    .forEach(i => {
      const top = i.values[0];
      analysis.push(
        `${top[0]} is the most common value in ${i.column}.`
      );
    });

  // Smart conclusion
  analysis.push(
    "Overall, this dataset is suitable for analysis and visualization."
  );

  return analysis;
}