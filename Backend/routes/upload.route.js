import express from "express";
import multer from "multer";
import path from "path";
import { CSVDataSource } from "../data-sources/csv.datasource.js";
import { dataSourceManager } from "../index.js";

const router = express.Router();

// storage config
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if(file.mimetype !== "text/csv") {
            cb(new Error("Only CSV files allowed"));
        } else {
            cb(null, true);
        }
    }
});

//POST /api/upload-csv
router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: "CSV file is required. Use form-data with key 'file'."
    });
  }

  const filePath = path.join("uploads", req.file.filename);

  const tableName = path
    .basename(req.file.originalname, ".csv")
    .toLowerCase();

  dataSourceManager.register(
    tableName,
    new CSVDataSource(filePath, tableName)
  );

  res.json({
    message: "CSV uploaded successfully",
    source: tableName,
    file: req.file.originalname
  });
});

export default router;