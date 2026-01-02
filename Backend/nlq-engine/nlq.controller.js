import { aiGenerateSQL } from "./ai-fallback.service.js";
import { detectAggregation } from "./aggregation.service.js";
import { detectCondition } from "./condition.service.js";
import { parseIntent } from "./intent.service.js";
import { detectTable } from "./table.service.js";
import { detectColumns } from "./column.service.js";
import { toNaturalLanguage } from "./response.service.js";
import { dataSourceManager } from "../index.js";
import { buildMongoQuery } from "./mongo-query.builder.js";
import { aiGenerateQuery } from "./ai-structured.service.js";

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
 // ---------------- AI FALLBACK (ALL DATASOURCES) ----------------
if (!table) {
  try {
    const aiQuery = await aiGenerateQuery(
      question,
      schema,
      dataSource.getType()
    );
console.log("AI QUERY:", aiQuery);

    let rows;

    if (aiQuery.type === "mongo") {
      // Mongo AI fallback
      rows = await dataSource.runQuery(aiQuery);

    } else {
      // SQLite / CSV AI fallback
      rows = await dataSource.runQuery({
        table: aiQuery.table,
        columns: aiQuery.columns,
        condition: aiQuery.condition,
        aggregation: aiQuery.aggregation
      });
    }

    return res.json({
      question,
      generatedQuery: aiQuery,
      answer: toNaturalLanguage(rows),
      data: rows,
      source: "ai"
    });

  } catch (err) {
    console.error("AI FALLBACK ERROR:", err);
    return res.json({
      answer: "AI could not understand your question."
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
