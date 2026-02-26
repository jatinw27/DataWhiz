import express from "express";
import { datasetManager, dataSourceManager } from "../core/managers.js";
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();


// GET /api/datasets/:name/schema
// GET /api/datasets/:name/summary
router.get("/:name/summary", async (req, res) => {
  try {
    const { name } = req.params;

    const datasource = dataSourceManager.get(name);

    // Get schema
    const schema = await datasource.getSchema();
    const table = Object.keys(schema)[0];
    const columns = schema[table];

    // Get small sample
    const sample = await datasource.runQuery({
      table,
      columns,
    });

    res.json({
      dataset: name,
      table,
      columns,
      rowCount: sample.length,
      sample: sample.slice(0, 3),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", protect, (req, res) => {
  const datasets = datasetManager.list();
  res.json({ datasets });
});


export default router;