import express from "express";
import { datasetManager } from "../core/managers.js";
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();




router.get("/", protect, (req, res) => {
  const datasets = datasetManager.list();
  res.json({ datasets });
});


export default router;