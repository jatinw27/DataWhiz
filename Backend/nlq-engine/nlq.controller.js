import db from "./database.js";
import { aiGenerateSQL } from "./ai-fallback.service.js";
import { detectAggregation } from "./aggregation.service.js";
import { detectCondition } from "./condition.service.js";
import { getDatabaseSchema } from "./schema.service.js";
import { parseIntent } from "./intent.service.js";
import { detectTable } from "./table.service.js";
import { detectColumns } from "./column.service.js";
import { toNaturalLanguage } from "./response.service.js";

export async function handleNLQ(req, res) {
  const { question } = req.body;

  //  Reads database schema
  const schema = await getDatabaseSchema();

  //  Detect intent (select / count)
  const intent = parseIntent(question);

  //  Detect table
  const table = detectTable(question, schema);
 if (!table) {
  try {
    const aiSQL = await aiGenerateSQL(question, schema);

    db.all(aiSQL, [], (err, rows) => {
      if (err) {
        return res.json({ answer: "AI generated invalid SQL." });
      }

      return res.json({
        question,
        generatedQuery: aiSQL,
        answer: toNaturalLanguage(rows),
        data: rows,
        source: "ai"
      });
    });
  } catch (e) {
    return res.json({
      answer: "I couldn't understand your question."
    });
  }

  return;
}


  // Detect columns
 const columns = detectColumns(question, table, schema);
const aggregation = detectAggregation(question, table, schema);
const selectedColumns = aggregation
  ? aggregation
  : columns.length
    ? columns.join(", ")
    : "*";

let sql = "";
const condition = detectCondition(question, table, schema);

if (intent === "select" || aggregation) {
  sql = `SELECT ${selectedColumns} FROM ${table}`;
  if (condition) {
    sql += ` WHERE ${condition}`;
  }
} else if (intent === "count") {
  sql = `SELECT COUNT(*) as count FROM ${table}`;
  if (condition) {
    sql += ` WHERE ${condition}`;
  }
} else {
  return res.json({
    answer: "I couldn't understand your intent."
  });
}



  //  Execute SQL
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.json({ answer: "Database error." });
    }

    res.json({
      question,
      generatedQuery: sql,
      answer: toNaturalLanguage(rows),
      data: rows
    });
  });
}
