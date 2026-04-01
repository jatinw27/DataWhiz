export function buildMongoQuery({ table, columns, condition, aggregation, intent }) {
  const query = {
    collection: table,
    filter: {},
    projection: {},
    aggregation: null
  };

  // WHERE condition
  if (condition) {
    const [field, operator, value] = condition.split(" ");
    const numValue = Number(value);

    if (operator === ">") query.filter[field] = { $gt: numValue };
    if (operator === "<") query.filter[field] = { $lt: numValue };
    if (operator === "=") query.filter[field] = numValue;
  }

  // SELECT columns
  if (columns && columns.length) {
    columns.forEach(col => (query.projection[col] = 1));
  }

  const pipeline = [];

  if (Object.keys(query.filter).length) {
    pipeline.push({ $match: query.filter });
  }

  // 🔥 COUNT BY INTENT (IMPORTANT FIX)
  if (intent === "count") {
    pipeline.push({ $count: "value" });
    query.aggregation = pipeline;
    return query;
  }

  // 🔥 Other aggregations (AVG, MIN, MAX, SUM)
  if (aggregation) {
    const match = aggregation.match(/(AVG|MIN|MAX|SUM)\((.+)\)/i);
    const func = match[1].toUpperCase();
    const field = match[2];

    const operatorMap = {
      AVG: "$avg",
      MIN: "$min",
      MAX: "$max",
      SUM: "$sum"
    };

    pipeline.push({
      $group: {
        _id: null,
        value: { [operatorMap[func]]: `$${field}` }
      }
    });

    query.aggregation = pipeline;
  }

  return query;
}
