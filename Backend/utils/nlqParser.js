export function parseQuestion(question, schema) {
  const lowerQ = question.toLowerCase();

  let query = {
    columns: [],
    conditions: [],
    aggregation: "",
    limit: null,
    groupBy: null,
    sortBy: null,
    sortOrder: "asc"
  };

  const tableName = Object.keys(schema)[0];
  const columns = schema[tableName];

  // =========================
  // COLUMN MATCH
  // =========================
  query.columns = columns.filter(col =>
    lowerQ.includes(col.toLowerCase())
  );

  // =========================
  // SYNONYMS
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
    "company": "Company",
    "age": "Age"
  };

  Object.entries(synonyms).forEach(([key, value]) => {
    if (lowerQ.includes(key)) {
      if (!query.columns.includes(value)) {
        query.columns.push(value);
      }
    }
  });

  // =========================
  // SAFE SPLIT (BETWEEN FIX)
  // =========================
  const parts = lowerQ
    .replace(/between\s+(\d+)\s+and\s+(\d+)/g, "between_$1_$2")
    .split(/and|or/)
    .map(p =>
      p.replace(/between_(\d+)_(\d+)/, "between $1 and $2").trim()
    );

  const operators = lowerQ.match(/and|or/g) || [];

  // =========================
  // CONDITIONS PARSING
  // =========================
  parts.forEach((part, index) => {

    // 🔥 NOT detection FIRST
    const isNot = part.includes("not") || part.includes("!=");

    // clean
    part = part.replace("not", "").replace("!=", "=").trim();

    let field = null;
    let operator = "=";
    let value = null;

    // =========================
    // BETWEEN
    // =========================
    const betweenMatch = part.match(/([a-zA-Z ]+)\s+between\s+(\d+)\s+and\s+(\d+)/);

    if (betweenMatch) {
      field = betweenMatch[1].trim();

      query.conditions.push({
        field,
        operator: "between",
        min: betweenMatch[2],
        max: betweenMatch[3],
        logic: index === 0 ? "and" : operators[index - 1] || "and",
        not: isNot
      });

      return;
    }

    // =========================
    // SQL STYLE
    // =========================
    const match = part.match(/([a-zA-Z ]+)\s*(=|>|<)\s*([a-zA-Z0-9 ]+)/);

    if (match) {
      field = match[1].trim();
      operator = match[2];
      value = match[3].trim();
    }

    // =========================
    // FROM
    // =========================
    else if (part.includes("from")) {
      const m = part.match(/from\s+([a-zA-Z ]+)/);
      if (m) {
        field = "country";
        value = m[1].trim();
      }
    }

    // =========================
    // IN
    // =========================
    else if (part.includes("in")) {
      const m = part.match(/in\s+([a-zA-Z ]+)/);
      if (m) {
        field = "country";
        value = m[1].trim();
      }
    }

    // =========================
    // SYNONYM FIELD VALUE
    // =========================
    else {
      Object.entries(synonyms).forEach(([key, col]) => {
        if (part.includes(key)) {
          field = col;
          const m = part.match(new RegExp(`${key}\\s+([a-zA-Z0-9 ]+)`));
          if (m) value = m[1].trim();
        }
      });
    }

    if (field && value) {
      const matchedCol =
        columns.find(col => col.toLowerCase() === field.toLowerCase()) ||
        synonyms[field];

      if (matchedCol) {
        query.conditions.push({
          field: matchedCol,
          operator,
          value,
          logic: index === 0 ? "and" : operators[index - 1] || "and",
          not: isNot
        });
      }
    }
  });

  // =========================
  // LIMIT
  // =========================
  const topMatch = lowerQ.match(/top\s*(\d+)/);
  if (topMatch) query.limit = parseInt(topMatch[1]);

  if (
    !query.limit &&
    (lowerQ.includes("first ") || lowerQ === "first") &&
    !lowerQ.includes("first name")
  ) {
    query.limit = 1;
  }

  // =========================
  // SORT
  // =========================
  const sortMatch = lowerQ.match(/by\s+([a-zA-Z ]+)/);

  if (sortMatch) {
    let field = sortMatch[1].replace(/desc|asc|ascending|descending/g, "").trim();

    const matchedCol =
      columns.find(col => col.toLowerCase() === field.toLowerCase()) ||
      synonyms[field];

    if (matchedCol) query.sortBy = matchedCol;
    if (lowerQ.includes("desc")) query.sortOrder = "desc";
  }

  // =========================
  // FALLBACK
  // =========================
  if (query.columns.length === 0) {
    query.columns = columns;
  }

  return query;
}