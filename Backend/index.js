import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from "path";
import uploadRoutes from "./routes/upload.route.js";
import datasetRoutes from "./routes/dataset.route.js";

import { dataSourceManager, datasetManager } from './core/managers.js';
import { DatasetManager } from './datasets/datasets.manager.js';
import nlqRoutes from "./routes/nlq.route.js";
import { DataSourceManager } from './data-sources/datasource.manager.js';
import { SQLiteDataSource } from './data-sources/sqlite.datasource.js';
import { MongoDataSource } from './data-sources/mongo.datasource.js';
import { CSVDataSource } from './data-sources/csv.datasource.js';

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(cors());

// Mongo connection (used by MongoDataSource)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// health check
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 🔥 CREATE & EXPORT SINGLE DATASOURCE MANAGER

// Register SQLite
dataSourceManager.register(
  "sqlite",
  new SQLiteDataSource("nlq.db")
);

// Register Mongo
dataSourceManager.register(
  "mongo",
  new MongoDataSource(process.env.MONGODB_URI, "bot")
);

dataSourceManager.register(
  "csv",
  new CSVDataSource(
    path.join(process.cwd(), "sample-data", "users.csv"),
    "users"
  )
);


// default CSV datasets
datasetManager.registerCSV(
  "users",
  "./sample-data/users.csv"
);

// routes
app.use("/api/nlq", nlqRoutes);
app.use("/api/upload-csv", uploadRoutes);
app.use("/api/datasets", datasetRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
