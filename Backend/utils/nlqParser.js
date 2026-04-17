export function parseQuestion(question, schema) {
  const lowerQ = question.toLowerCase();

  let query = {
    columns: [],
    condition: "",
    aggregation: "",
    limit: null,
    groupBy: null
  };

  const tableName = Object.keys(schema)[0]
  const columns = schema[tableName];

  // =========================
  // 🔹 COLUMN MATCH
  // =========================
  query.columns = columns.filter(col =>
    lowerQ.includes(col.toLowerCase())
  );

  // =========================
  //  SYNONYMS (NON-DESTRUCTIVE)
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
//  WHERE / FILTER DETECTION
// =========================
query.condition = "";

// pattern: "where country = chile"
const whereMatch = lowerQ.match(/where\s+([a-zA-Z ]+)\s*(=|>|<)\s*([a-zA-Z0-9 ]+)/);

if (whereMatch) {
  const fieldRaw = whereMatch[1].trim();
  const operator = whereMatch[2];
  const value = whereMatch[3].trim();

  const matchedCol =
    columns.find(col => col.toLowerCase() === fieldRaw.toLowerCase()) ||
    synonyms[fieldRaw];

  if (matchedCol) {
    query.condition = `${matchedCol} ${operator} ${value}`;
  }
}

// pattern: "customers from chile"
const fromMatch = lowerQ.match(/from\s+([a-zA-Z ]+)/);

if (fromMatch) {
  const value = fromMatch[1].trim();

  if (columns.includes("Country")) {
    query.condition = `Country = ${value}`;
  }
}

// pattern: "customers in india"
const inMatch = lowerQ.match(/in\s+([a-zA-Z ]+)/);

if (inMatch && !query.condition) {
  const value = inMatch[1].trim();

  if (columns.includes("Country")) {
    query.condition = `Country = ${value}`;
  }
}
  // =========================
  //  LIMIT DETECTION
  // =========================
 const topMatch = lowerQ.match(/top\s*(\d+)/);
if (topMatch) {
  query.limit = parseInt(topMatch[1]);
}

if (
  !query.limit &&
  (lowerQ.includes("first ") || lowerQ === "first") &&
  !lowerQ.includes("first name")
) {
  query.limit = 1;
}

// =========================
//  SORT DETECTION (SMART)
// =========================
query.sortBy = null;
query.sortOrder = "asc"; // default

const sortMatch = lowerQ.match(/by\s+([a-zA-Z ]+)/);

if (sortMatch) {
  let field = sortMatch[1].trim();

  // remove extra words like "desc", "ascending"
  field = field.replace(/desc|descending|asc|ascending/g, "").trim();

  // match with schema OR synonyms
  const matchedCol =
    columns.find(col => col.toLowerCase() === field.toLowerCase()) ||
    synonyms[field];

  if (matchedCol) {
    query.sortBy = matchedCol;
  }

  if (lowerQ.includes("desc")) {
    query.sortOrder = "desc";
  }
}
  // =========================
  //  SPECIAL CASE: TOP CUSTOMERS
  // =========================
  if (lowerQ.includes("top") && lowerQ.includes("customer")) {
    query.limit = query.limit || 5;

    // show meaningful columns instead of just ID
    query.columns = ["Customer Id", "First Name", "Country"];

    
  }

  // =========================
  // 🔥 GROUPING LOGIC
  // =========================
  if (
  (lowerQ.includes("top") || lowerQ.includes("most")) &&
  query.columns.length === 1 &&
  !query.sortBy // 🔥 IMPORTANT
) {
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