import express from "express";
import OpenAI from "openai";
import { datasetManager } from "../core/managers.js";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/", async (req, res) => {
  const { question, dataset } = req.body;

  const ds = datasetManager.get(dataset);

  if (!ds) {
    return res.status(404).json({ error: "Dataset not found" });
  }

  const schema = await ds.getSchema();

  // 🔥 AI converts question → query
  const prompt = `
You are a data assistant.

Dataset schema:
${JSON.stringify(schema)}

Convert the user question into a JSON query.

Format:
{
  "columns": [],
  "condition": "",
  "aggregation": ""
}

User question:
"${question}"
`;

  const aiRes = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: "Convert questions to structured queries." },
      { role: "user", content: prompt }
    ]
  });

  let query;

  try {
    query = JSON.parse(aiRes.choices[0].message.content);
  } catch {
    return res.json({
      answer: "Sorry, I couldn't understand the query.",
      data: []
    });
  }

  const data = await ds.runQuery(query);

  res.json({
    query,
    data
  });
});

export default router;