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

    const schema = await datasource.getSchema();
    const table = Object.keys(schema)[0];
    const columns = schema[table];

    // ✅ real total row count
    const countResult = await datasource.runQuery({
      table,
      aggregation: "COUNT",
    });

    const totalRows = countResult[0]?.count || 0;

    res.json({
      dataset: name,
      table,
      columns,
      totalRows,
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