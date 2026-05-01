import express from "express";
import { datasetManager } from "../core/managers.js";
import { generateDashboard } from "../utils/dashboardGenerator.js";

const router = express.Router();

router.get("/dashboard/:name", async (req, res) => {
  try {
    const { name } = req.params;

    const dataSource = datasetManager.get(name);

    if (!dataSource) {
      return res.status(404).json({ error: "Dataset not found" });
    }

    const dashboard = await generateDashboard(dataSource);

    // ONLY ONE RESPONSE
    return res.json(dashboard);

  } catch (err) {
    console.error("Dashboard Error:", err);
    return res.status(500).json({ error: "Dashboard failed" });
  }
});

export default router;