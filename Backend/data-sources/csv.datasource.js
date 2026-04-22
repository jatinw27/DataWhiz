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

  // =========================
  // LOAD CSV
  // =========================
  async loadFile() {
    if (this.loaded) return;

    return new Promise((resolve, reject) => {
      fs.createReadStream(this.filePath)
        .pipe(csv())
        .on("data", (row) => {
          // convert numbers
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

  // =========================
  // SCHEMA
  // =========================
  async getSchema() {
    await this.loadFile();
    if (!this.rows.length) return {};

    return {
      [this.tableName]: Object.keys(this.rows[0]),
    };
  }

  // =========================
  //  MAIN QUERY ENGINE
  // =========================
  async runQuery(query) {
    await this.loadFile();

    let result = [...this.rows];

    const {
      columns,
      condition,
      sortBy,
      sortOrder = "asc",
      limit,
      groupBy,
      aggregation,
    } = query;

  // =========================
// APPLY MULTIPLE FILTERS
// =========================
if (query.conditions && query.conditions.length > 0) {
  result = result.filter(row => {
    let finalResult = null;

    query.conditions.forEach((cond, index) => {

      const actualKey = Object.keys(row).find(
        k => k.toLowerCase() === cond.field.toLowerCase()
      );

      const rawValue = actualKey ? row[actualKey] : null;
      const cell = rawValue !== null ? String(rawValue).toLowerCase() : "";
      const value = cond.value ? cond.value.toLowerCase() : null;

      let conditionResult = false;

      if (cond.operator === "=") {
        conditionResult = cell.includes(value);
      } else if (cond.operator === ">") {
        conditionResult = Number(rawValue) > Number(value);
      } else if (cond.operator === "<") {
        conditionResult = Number(rawValue) < Number(value);
      } else if (cond.operator === "between") {
        conditionResult =
          Number(rawValue) >= Number(cond.min) &&
          Number(rawValue) <= Number(cond.max);
      }

      // 🔥 APPLY NOT
      if (cond.not) {
        conditionResult = !conditionResult;
      }

      if (index === 0) {
        finalResult = conditionResult;
      } else {
        if (cond.logic === "and") {
          finalResult = finalResult && conditionResult;
        } else if (cond.logic === "or") {
          finalResult = finalResult || conditionResult;
        }
      }
    });

    return finalResult;
  });
}
    // =========================
    //  GROUPING
    // =========================
    if (groupBy && aggregation === "count") {
      const grouped = {};

      result.forEach((row) => {
        const key = row[groupBy];
        grouped[key] = (grouped[key] || 0) + 1;
      });

      result = Object.entries(grouped).map(([key, count]) => ({
        [groupBy]: key,
        count,
      }));

      // sort grouped results (descending)
      result.sort((a, b) => b.count - a.count);
    }

    // =========================
    // 🔥 SORTING
    // =========================
    if (sortBy) {
      result.sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];

        // string sorting
        if (typeof valA === "string") {
          return sortOrder === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        // number sorting
        return sortOrder === "asc"
          ? valA - valB
          : valB - valA;
      });
    }

    // =========================
    // 🔥 LIMIT
    // =========================
    if (limit) {
      result = result.slice(0, limit);
    }

    // =========================
    // 🔥 SELECT COLUMNS
    // =========================
    if (columns && columns.length > 0) {
      result = result.map((row) => {
        const filtered = {};
        columns.forEach((col) => {
          filtered[col] = row[col];
        });
        return filtered;
      });
    }

    return result;
  }

  // =========================
  // EXTRA UTILS
  // =========================
  async getRowCount() {
    await this.loadFile();
    return this.rows.length;
  }

  async getColumnStats() {
    await this.loadFile();

    const stats = {};
    if (!this.rows.length) return stats;

    const columns = Object.keys(this.rows[0]);

    columns.forEach((col) => {
      const values = this.rows
        .map((r) => r[col])
        .filter((v) => v !== null && v !== "");

      const numeric = values.filter((v) => typeof v === "number");
      const dates = values.filter((v) => !isNaN(Date.parse(v)));

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
    });

    return stats;
  }

  async getInsights() {
    await this.loadFile();

    const insights = [];
    if (!this.rows.length) return insights;

    const columns = Object.keys(this.rows[0]);

    columns.forEach((col) => {
      const values = this.rows.map((r) => r[col]);

      // missing
      const missing = values.filter(
        (v) => v === null || v === ""
      ).length;

      if (missing > 0) {
        insights.push({
          type: "missing",
          column: col,
          count: missing,
        });
      }

      // frequency
      const freq = {};
      values.forEach((v) => {
        if (v !== null && v !== "") {
          freq[v] = (freq[v] || 0) + 1;
        }
      });

      const top = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      if (top.length > 0) {
        insights.push({
          type: "topValues",
          column: col,
          values: top,
        });
      }
    });

    return insights;
  }

  getType() {
    return "csv";
  }

  async getData() {
    await this.loadFile();
    return this.rows;
  }
}