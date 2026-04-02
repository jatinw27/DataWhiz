import express from "express";
import { datasetManager, dataSourceManager } from "../core/managers.js";
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/:name/summary", async (req, res) => {
  try {
    const { name } = req.params;
    const datasource = dataSourceManager.get(name);

    const schema = await datasource.getSchema();
    const columns = Array.isArray(schema)
      ? schema
      : schema[Object.keys(schema)[0]];

    const totalRows = datasource.getRowCount();
    const columnStats = datasource.getColumnStats();

    res.json({
      dataset: name,
      totalRows,
      columns,
      columnStats,
    });
  } catch (err) {
    console.error("SUMMARY ROUTE ERROR:", err);
    res.status(400).json({ error: err.message });
  }
});


router.get("/", protect, (req, res) => {
  const datasets = datasetManager.list();
  res.json({ datasets });
});


export default router;