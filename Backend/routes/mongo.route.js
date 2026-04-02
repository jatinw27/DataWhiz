import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { MongoDataSource } from "../data-sources/mongo.datasource.js";

const router = express.Router();

router.post("/connect", protect, async (req, res) => {
  try {
    const { uri, dbName } = req.body;

    const mongo = new MongoDataSource(uri, dbName);
    const schema = await mongo.getSchema();

    res.json({
      success: true,
      schema,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;
