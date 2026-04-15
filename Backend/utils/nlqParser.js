export function parseQuestion(question, schema) {
  const lowerQ = question.toLowerCase();

  let query = {
    columns: [],
    condition: "",
    aggregation: "",
    limit: null,
    groupBy: null
  };

  const columns = Object.keys(schema);

  // =========================
  // 🔹 COLUMN MATCH
  // =========================
  query.columns = columns.filter(col =>
    lowerQ.includes(col.toLowerCase())
  );

  // =========================
  // 🔥 SYNONYMS (NON-DESTRUCTIVE)
  // =========================
  const synonyms = {
    "first name": "First Name",
    "last name": "Last Name",
    "customer": "Customer Id",
    "customers": "Customer Id",
    "country": "Country",
    "countries": "Country",
    "city": "City",
    "cities": "City",
    "company": "Company"
  };

  Object.entries(synonyms).forEach(([key, value]) => {
    if (lowerQ.includes(key)) {
      if (!query.columns.includes(value)) {
        query.columns.push(value);
      }
    }
  });

  // =========================
  // 🔥 LIMIT DETECTION
  // =========================
  const topMatch = lowerQ.match(/top\s*(\d+)/);
  if (topMatch) {
    query.limit = parseInt(topMatch[1]);
  }

  if (/first|top\s*1|one/.test(lowerQ)) {
    query.limit = 1;
  }

  // =========================
  // 🔥 SPECIAL CASE: TOP CUSTOMERS
  // =========================
  if (lowerQ.includes("top") && lowerQ.includes("customer")) {
    query.limit = query.limit || 5;

    // show meaningful columns instead of just ID
    query.columns = ["Customer Id", "First Name", "Country"];

    return query;
  }

  // =========================
  // 🔥 GROUPING LOGIC
  // =========================
  if (lowerQ.includes("top") || lowerQ.includes("most")) {
    if (query.columns.length === 1) {
      const col = query.columns[0];
      const meta = schema[col];

      // only group if NOT unique
      if (meta && meta.uniqueCount < 50) {
        query.groupBy = col;
        query.aggregation = "count";
      } else {
        // otherwise just limit rows
        query.limit = query.limit || 5;
      }
    }
  }

  // =========================
  // 🔹 COUNT
  // =========================
  if (lowerQ.includes("count")) {
    query.aggregation = "count";
  }

  // =========================
  // 🔹 FALLBACK
  // =========================
  if (query.columns.length === 0) {
    query.columns = columns;
  }

  return query;
}