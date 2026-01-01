import { aiGenerateSQL } from "./ai-fallback.service.js";
import { detectAggregation } from "./aggregation.service.js";
import { detectCondition } from "./condition.service.js";
import { parseIntent } from "./intent.service.js";
import { detectTable } from "./table.service.js";
import { detectColumns } from "./column.service.js";
import { toNaturalLanguage } from "./response.service.js";
import { dataSourceManager } from "../index.js";
import { buildMongoQuery } from "./mongo-query.builder.js";

export async function handleNLQ(req, res) {
  const { question, source = "sqlite" } = req.body;

  const dataSource = dataSourceManager.get(source);
  if (!dataSource) {
    return res.json({ answer: "Invalid data source selected." });
  }

  // 1️⃣ Read schema from selected datasource
  const schema = await dataSource.getSchema();

  // 2️⃣ Detect intent
  const intent = parseIntent(question);

  // 3️⃣ Detect table
  const table = detectTable(question, schema);



  // ---------------- AI FALLBACK ----------------
 if (!table) {
  // AI fallback ONLY for SQL datasources
  if (dataSource.getType() !== "sqlite") {
    return res.json({
      answer:
        "This question requires AI reasoning, which is currently supported only for SQL databases."
    });
  }
  
    try {
      const aiSQL = await aiGenerateSQL(question, schema);

      const rows = await dataSource.runQuery(
        dataSource.getType() === "mongo"
          ? { rawSQL: aiSQL } // placeholder for future
          : aiSQL
      );

      return res.json({
        question,
        generatedQuery: aiSQL,
        answer: toNaturalLanguage(rows),
        data: rows,
        source: "ai"
      });
    } catch {
      return res.json({
        answer: "I couldn't understand your question."
      });
    }
  }

  // 4️⃣ Detect columns & aggregation
  const columns = detectColumns(question, table, schema);
  const aggregation = detectAggregation(question, table, schema);

  const condition = detectCondition(question, table, schema);

  // ---------------- BUILD QUERY ----------------
  let resultRows;
  let generatedQuery;

  if (dataSource.getType() === "mongo") {
  // 🟢 Mongo
  const mongoQuery = buildMongoQuery({
    table,
    columns,
    condition,
    intent,
    aggregation
  });

  resultRows = await dataSource.runQuery(mongoQuery);
  generatedQuery = mongoQuery;

} else if (dataSource.getType() === "csv") {
  // 🟢 CSV (IMPORTANT FIX)
  const csvQuery = {
    table,
    columns,
    condition,
    aggregation
  };

  resultRows = await dataSource.runQuery(csvQuery);
  generatedQuery = csvQuery;

} else {
  // 🟢 SQLite (SQL)
  let sql = "";

  const selectedColumns = aggregation
    ? aggregation
    : columns.length
    ? columns.join(", ")
    : "*";

  if (intent === "select" || aggregation) {
    sql = `SELECT ${selectedColumns} FROM ${table}`;
    if (condition) sql += ` WHERE ${condition}`;
  } else if (intent === "count") {
    sql = `SELECT COUNT(*) as count FROM ${table}`;
    if (condition) sql += ` WHERE ${condition}`;
  } else {
    return res.json({ answer: "I couldn't understand your intent." });
  }

  resultRows = await dataSource.runQuery(sql);
  generatedQuery = sql;
}

  // 5️⃣ Respond
  res.json({
    question,
    generatedQuery,
    answer: toNaturalLanguage(resultRows),
    data: resultRows,
    source
  });
}
