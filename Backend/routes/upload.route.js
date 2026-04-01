import express from "express";
import multer from "multer";
import path from "path";
import { CSVDataSource } from "../data-sources/csv.datasource.js";
import { datasetManager, dataSourceManager } from "../core/managers.js";

const router = express.Router();

/* storage */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    file.mimetype === "text/csv"
      ? cb(null, true)
      : cb(new Error("Only CSV files allowed"));
  }
});

/* POST /api/upload-csv */
router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "CSV file required" });
  }

  const filePath = path.join("uploads", req.file.filename);

  // ✅ SINGLE source of truth
  const tableName = path
    .basename(req.file.originalname, ".csv")
    .toLowerCase();

  // ✅ For dropdown (datasets)
  datasetManager.registerCSV(tableName, filePath);

  // ✅ For NLQ engine (query execution)
  dataSourceManager.register(
    tableName,
    new CSVDataSource(filePath, tableName)
  );

  res.json({
    message: "CSV uploaded successfully",
    dataset: tableName
  });
});

export default router;
