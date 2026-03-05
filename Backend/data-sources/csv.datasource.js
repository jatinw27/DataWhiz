import fs from "fs";
import csv from "csv-parser";
import { BaseDataSource } from "./base.datasource.js";

export class CSVDataSource extends BaseDataSource {
  constructor(filePath, tablename = "data") {
    super();
    this.filePath = filePath;
    this.tableName = tablename || "data";
    this.rows = [];
    this.loaded = false;
  }

  async loadFile() {
    if (this.loaded) return;

    return new Promise((resolve, reject) => {
      fs.createReadStream(this.filePath)
        .pipe(csv())
        .on("data", row => {
          for (const key in row) {
            if (row[key] !== "" && !isNaN(row[key])) {
  row[key] = Number(row[key]);
}
          }
          this.rows.push(row);
        })
        .on("end", () => {
          this.loaded = true;
          resolve();
        })
        .on("error", reject);
    });
  }

  async getSchema() {
    await this.loadFile();
    if (!this.rows.length) return {};

    return {
      [this.tableName]: Object.keys(this.rows[0]),
    };
  }

  async runQuery(query) {
    await this.loadFile();

    const { columns, condition, aggregation } = query;
    let result = this.rows;

    if (condition) {
      const [field, operator, value] = condition.split(" ");
      const numValue = Number(value);

      result = result.filter(row => {
        if (operator === ">") return row[field] > numValue;
        if (operator === "<") return row[field] < numValue;
        if (operator === "=") return row[field] === numValue;
        return true;
      });
    }

    if (aggregation && aggregation.toUpperCase().includes("COUNT")) {
      return [{ count: result.length }];
    }

    if (aggregation) {
      const match = aggregation.match(/(AVG|MIN|MAX|SUM)\((.+)\)/i);
      if (match) {
        const func = match[1].toUpperCase();
        const field = match[2];

        const values = result
          .map(r => r[field])
          .filter(v => typeof v === "number");

        let value = null;
        if (func === "AVG") value = values.length ? values.reduce((a, b) => a + b, 0) / values.length:0;
        if (func === "MIN") value = Math.min(...values);
        if (func === "MAX") value = Math.max(...values);
        if (func === "SUM") value = values.reduce((a, b) => a + b, 0);

        return [{ value }];
      }
    }

    if (columns && columns.length) {
      result = result.map(row => {
        const filtered = {};
        columns.forEach(col => (filtered[col] = row[col]));
        return filtered;
      });
    }

    return result;
  }

  // ✅ THIS FIXES YOUR PROBLEM
 async getRowCount() {
  await this.loadFile();
  return this.rows.length;
}

 async getColumnStats() {
  await this.loadFile();

  const stats = {};

  if (!this.rows.length) return stats;

  const columns = Object.keys(this.rows[0]);

  columns.forEach(col => {
    const values = this.rows.map(r => r[col]).filter(v => v !== null && v !== "");

    const numeric = values.filter(v => typeof v === "number");
    const dates = values.filter(v => !isNaN(Date.parse(v)));

    stats[col] = {
      type:
        numeric.length === values.length
          ? "number"
          : dates.length === values.length
          ? "date"
          : "string",
      uniqueCount: new Set(values).size,
      sample: values.slice(0, 3),
    };

    if (dates.length === values.length && dates.length > 0) {
      const sorted = dates.map(d => new Date(d)).sort((a, b) => a - b);
      stats[col].min = sorted[0];
      stats[col].max = sorted[sorted.length - 1];
    }
  });

  return stats;
}

async getInsights() {
  await this.loadFile();

  const insights = [];

  if (!this.rows.length) return insights;

  const columns = Object.keys(this.rows[0]);

  columns.forEach(col => {
    const values = this.rows.map(r => r[col]);

    // Missing values
    const missing = values.filter(v => v === null || v === "").length;

    if (missing > 0) {
      insights.push({
        type: "missing",
        column: col,
        count: missing
      });
    }

    // Top values
    const freq = {};
    values.forEach(v => {
      if (v !== null && v !== "") {
        freq[v] = (freq[v] || 0) + 1;
      }
    });

    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    if (sorted.length > 0) {
      insights.push({
        type: "topValues",
        column: col,
        values: sorted
      });
    }
  });

  return insights;
}

  getType() {
    return "csv";
  }
}