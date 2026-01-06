import express from "express";
import { datasetManager } from "../index.js";

const router = express.Router();

//GET  /api/datasets
router.get("/", (req, res) => {
    const datasets = datasetManager.list();
    res.json({ datasets });
});

export default router;