import db from "./database.js";
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
    return res.json({
      answer: "I couldn't identify which table you're asking about."
    });
  }

  // Detect columns
  const columns = detectColumns(question, table, schema);
  const selectedColumns = columns.length ? columns.join(", ") : "*";

  // Build SQL
  let sql = "";

  if (intent === "select") {
    sql = `SELECT ${selectedColumns} FROM ${table}`;
  } else if (intent === "count") {
    sql = `SELECT COUNT(*) as count FROM ${table}`;
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
