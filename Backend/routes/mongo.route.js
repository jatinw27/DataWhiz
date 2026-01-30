import express from "express";
import { MongoDataSource } from "../data-sources/mongo.datasource.js";

const router = express.Router();

router.post("/connect", async (req, res) => {
  try {
    const { uri } = req.body;

    const mongo = new MongoDataSource(uri);

    const tables = await mongo.getTables();

    res.json({
      success: true,
      tables,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;
