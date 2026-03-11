import express from "express";
import { datasetManager } from "../core/managers.js";
import { generateAutoAnalysis } from "../utils/autoAnalysis.js";

const router = express.Router();

router.get("/:dataset", async (req, res) => {

  const { dataset } = req.params;

  const ds = datasetManager.get(dataset);

  if (!ds) {
    return res.status(404).json({ error: "Dataset not found" });
  }

  const analysis = await generateAutoAnalysis(ds);

  res.json({
    dataset,
    analysis
  });

});

export default router;