export async function generateAutoAnalysis(dataSource) {

  const stats = await dataSource.getColumnStats();
  const insights = await dataSource.getInsights();
  const rowCount = await dataSource.getRowCount();

  const columns = Object.keys(stats);

  const analysis = [];

  analysis.push(`Dataset contains ${rowCount} records and ${columns.length} columns.`);

  // Missing values
  insights
    .filter(i => i.type === "missing")
    .forEach(i => {
      analysis.push(`${i.count} missing values detected in ${i.column}.`);
    });

  // Top values
  insights
    .filter(i => i.type === "topValues")
    .slice(0,3)
    .forEach(i => {
      const top = i.values[0];
      analysis.push(`${top[0]} is the most frequent value in ${i.column}.`);
    });

  return analysis;
}