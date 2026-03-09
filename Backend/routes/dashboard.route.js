import express from "express";
import { datasetManager } from "../core/managers.js";
import { generateDashboard } from "../utils/dashboardGenerator.js";

const router = express.Router();

router.get("/:dataset", async (req, res) => {

  const { dataset } = req.params;

  const ds = datasetManager.get(dataset);

  if (!ds) {
    return res.status(404).json({ error: "Dataset not found" });
  }

  const dashboard = await generateDashboard(ds);

  res.json(dashboard);

});

export default router;