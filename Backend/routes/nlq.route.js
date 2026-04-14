import express from "express";
import OpenAI from "openai";
import { datasetManager } from "../core/managers.js";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/", async (req, res) => {
    console.log("NLQ Route")
  const { question, dataset } = req.body;

  const ds = datasetManager.get(dataset);

  if (!ds) {
    return res.status(404).json({ error: "Dataset not found" });
  }

  const schema = await ds.getSchema();

  const prompt = `
You are a data assistant.

Dataset schema:
${JSON.stringify(schema)}

STRICT RULES:
- If user mentions columns → include them
- If user says "only" → return ONLY those columns
- Use exact column names from schema

Return ONLY valid JSON (no explanation):

{
  "columns": [],
  "condition": "",
  "aggregation": ""
}

User question:
"${question}"
`;

  let query = { columns: [] };

  try {
    const aiRes = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "Convert questions to structured queries." },
        { role: "user", content: prompt }
      ]
    });

    query = JSON.parse(aiRes.choices[0].message.content);

  } catch (err) {
    console.log("⚠️ AI failed, using fallback:", err.message);
  }

  //  FALLBACK LOGIC (IMPORTANT)
 const lowerQ = question.toLowerCase();

// 🔥 SMART COLUMN DETECTION
let detectedColumns = Object.keys(schema).filter(col =>
  lowerQ.includes(col.toLowerCase())
);

// 🔥 HANDLE "first name" / "last name"
if (lowerQ.includes("first name")) {
  detectedColumns = ["First Name"];
}
if (lowerQ.includes("last name")) {
  detectedColumns = ["Last Name"];
}

// ✅ APPLY RESULT
if (detectedColumns.length > 0) {
  query.columns = detectedColumns;
} else {
  query.columns = Object.keys(schema);
}

  if (!query.columns || query.columns.length === 0) {
    query.columns = Object.keys(schema).filter(col =>
      lowerQ.includes(col.toLowerCase())
    );
  }

  if (!query.columns || query.columns.length === 0) {
    query.columns = Object.keys(schema);
  }

  const data = await ds.runQuery(query);

  res.json({
    answer: data.length
      ? `Found ${data.length} results.`
      : "No matching records found.",
    data
  });
});

export default router;