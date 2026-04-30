import express, { json } from "express";
import { datasetManager } from "../core/managers.js";
import { generateInsights } from "../utils/insightGenerator.js";
import { detectChart } from "../utils/chartDetector.js";
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
    res.json(dashboard)
    //  get all data
    const data = await dataSource.runQuery({});

    if (!data || data.length === 0) {
      return res.json({
        data: [],
        stats: {},
        insights: [],
        charts: [],
        summary: ["No data available"],
        aiSummary: null
      });
    }

    // stats (simple)
    const stats = data[0];

    //  insights
    const insights = generateInsights(data) || [];

    //  charts (auto detect 2-3 charts)
    const charts = [];
    const detected = detectChart(data);

    if (detected) {
      charts.push(detected);
    }

    //  summary (basic)
    const summary = [
      `Dataset contains ${data.length} rows.`,
      `Columns detected: ${Object.keys(data[0]).length}.`
    ];

    return res.json({
      data,
      stats,
      insights,
      charts,
      summary,
      aiSummary: null 
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ error: "Dashboard failed" });
  }
});

export default router;