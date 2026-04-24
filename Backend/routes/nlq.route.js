import express from "express";
import { datasetManager } from "../core/managers.js";
import { parseQuestion } from "../utils/nlqParser.js";

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("NLQ Route");

  const { question, dataset } = req.body;

  const ds = datasetManager.get(dataset);

  if (!ds) {
    return res.status(404).json({ error: "Dataset not found" });
  }

  const schema = await ds.getSchema();

  // 🔥 PURE NLP ENGINE (NO OPENAI NEEDED)
  const query = parseQuestion(question, schema);

  try {
    const data = await ds.runQuery(query);

    res.json({
      answer: data.length
        ? `Showing ${data.length} result${data.length > 1 ? "s" : ""}.`
        : "No matching records found.",
      data,
       chart: query.visualize ? query.chartType : null
    });

  } catch (err) {
    console.error("❌ QUERY ERROR:", err.message);

    res.status(500).json({
      error: "Query execution failed"
    });
  }
});

export default router;