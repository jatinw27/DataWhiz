export function exploreDataset(dataSource, question) {

  const q = question.toLowerCase();

  const stats = dataSource.getColumnStats();
  const insights = dataSource.getInsights();

  const columns = Object.keys(stats);

  // 🔹 List columns
  if (q.includes("column") || q.includes("fields")) {
    return {
      answer: `This dataset contains the following columns: ${columns.join(", ")}`,
      data: null
    };
  }

  // 🔹 Missing values
  if (q.includes("missing")) {

    const missingCols = insights
      .filter(i => i.type === "missing")
      .map(i => `${i.column} (${i.count})`);

    if (!missingCols.length) {
      return {
        answer: "No missing values detected in this dataset.",
        data: null
      };
    }

    return {
      answer: `Missing values detected in: ${missingCols.join(", ")}`,
      data: null
    };
  }

  // 🔹 Numeric columns
  if (q.includes("numeric") || q.includes("number")) {

    const numericCols = Object.entries(stats)
      .filter(([c, s]) => s.type === "number")
      .map(([c]) => c);

    return {
      answer: `Numeric columns are: ${numericCols.join(", ")}`,
      data: null
    };
  }

  // 🔹 Date columns
  if (q.includes("date")) {

    const dateCols = Object.entries(stats)
      .filter(([c, s]) => s.type === "date")
      .map(([c]) => c);

    return {
      answer: `Date columns are: ${dateCols.join(", ")}`,
      data: null
    };
  }

  return null;
}