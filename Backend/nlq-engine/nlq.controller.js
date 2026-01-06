import { detectAggregation } from "./aggregation.service.js";
import { detectCondition } from "./condition.service.js";
import { parseIntent } from "./intent.service.js";
import { detectTable } from "./table.service.js";
import { detectColumns } from "./column.service.js";
import { toNaturalLanguage } from "./response.service.js";
import { datasetManager, dataSourceManager } from "../index.js";
import { buildMongoQuery } from "./mongo-query.builder.js";
import { aiGenerateQuery } from "./ai-structured.service.js";

export async function handleNLQ(req, res) {
  const { question, text, source = "sqlite", dataset } = req.body;
  const finalQuestion = question || text;

  if (!finalQuestion || typeof finalQuestion !== "string") {
    return res.json({ answer: "Question is missing or invalid." });
  }

  // ✅ SELECT DATASOURCE
  let dataSource;

  if (source === "csv") {
    if (!dataset) {
      return res.json({ answer: "Dataset name is required for CSV queries." });
    }
    dataSource = datasetManager.get(dataset);
  } else {
    dataSource = dataSourceManager.get(source);
  }

  if (!dataSource) {
    return res.json({ answer: "Invalid data source selected." });
  }

  // 1️⃣ Read schema
  const schema = await dataSource.getSchema();

  // 2️⃣ NLP detection
  const intent = parseIntent(finalQuestion);
  const table = detectTable(finalQuestion, schema);

  // 🔁 AI fallback if table not detected
  if (!table) {
    try {
      const aiQuery = await aiGenerateQuery(
        finalQuestion,
        schema,
        dataSource.getType()
      );

      const rows = await dataSource.runQuery(aiQuery);

      return res.json({
        question: finalQuestion,
        generatedQuery: aiQuery,
        answer: toNaturalLanguage(rows),
        data: rows,
        source: "ai"
      });
    } catch (err) {
      return res.json({ answer: "AI could not understand your question." });
    }
  }

  // 3️⃣ Build structured query
  const columns = detectColumns(finalQuestion, table, schema);
  const aggregation = detectAggregation(finalQuestion, table, schema);
  const condition = detectCondition(finalQuestion, table, schema);

  let resultRows;
  let generatedQuery;

  if (dataSource.getType() === "mongo") {
    generatedQuery = buildMongoQuery({
      table,
      columns,
      condition,
      intent,
      aggregation
    });
    resultRows = await dataSource.runQuery(generatedQuery);
  } else if (dataSource.getType() === "csv") {
    generatedQuery = { table, columns, condition, aggregation };
    resultRows = await dataSource.runQuery(generatedQuery);
  } else {
    let sql = "";
    const selectedColumns = aggregation || columns.join(", ") || "*";

    if (intent === "count") {
      sql = `SELECT COUNT(*) FROM ${table}`;
    } else {
      sql = `SELECT ${selectedColumns} FROM ${table}`;
    }
    if (condition) sql += ` WHERE ${condition}`;

    generatedQuery = sql;
    resultRows = await dataSource.runQuery(sql);
  }

  return res.json({
    question: finalQuestion,
    generatedQuery,
    answer: toNaturalLanguage(resultRows),
    data: resultRows,
    source
  });
}
