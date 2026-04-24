import fs from "fs";
import csv from "csv-parser";
import { BaseDataSource } from "./base.datasource.js";

export class CSVDataSource extends BaseDataSource {
  constructor(filePath, tablename = "data") {
    super();
    this.filePath = filePath;
    this.tableName = tablename || "data";

    this.tables = {};
    this.loaded = false;
  }

  async getRowCount() {
    await this.loadFile();
    return this.tables[this.tableName].length;
  }

  // =========================
  // LOAD CSV
  // =========================
  async loadFile() {
    if (this.loaded) return;

    this.tables[this.tableName] = [];

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

          this.tables[this.tableName].push(row);
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

    const table = this.tables[this.tableName];
    if (!table.length) return {};

    return {
      [this.tableName]: Object.keys(table[0]),
    };
  }
  // =========================
  // MAIN QUERY ENGINE
  // =========================

  async runQuery(query) {
console.log("QUERY OBJECT:", query);

    await this.loadFile();
    let result = [...this.tables[query.table || this.tableName]];
console.log("Columns:", Object.keys(result[0] || {}));

    // =========================
    // FILTER
    // =========================
    if (query.conditions && query.conditions.length > 0) {
      result = result.filter((row) => {
        let finalResult = null;

        query.conditions.forEach((cond, index) => {
          const actualKey = Object.keys(row).find(
            (k) => k.toLowerCase().replace(/\s+/g, '') === cond.field.toLowerCase().replace(/\s+/g, '')
          );

          const rawValue = actualKey ? row[actualKey] : null;

          const isNumber = typeof rawValue === "number";

          const cell = isNumber
            ? rawValue
            : String(rawValue || "").toLowerCase();

          const value = cond.value ? cond.value.toLowerCase() : null;

          let conditionResult = false;

          if (cond.operator === "=") {
            conditionResult = isNumber
              ? rawValue === Number(value)
              : cell === value;
          } else if (cond.operator === ">") {
            conditionResult = Number(rawValue) > Number(value);
          } else if (cond.operator === "<") {
            conditionResult = Number(rawValue) < Number(value);
          } else if (cond.operator === "between") {
            conditionResult =
              Number(rawValue) >= Number(cond.min) &&
              Number(rawValue) <= Number(cond.max);
          }

          // NOT support
          if (cond.not) conditionResult = !conditionResult;

          if (index === 0) {
            finalResult = conditionResult;
          } else {
            if (cond.logic === "and") {
              finalResult = finalResult && conditionResult;
            } else {
              finalResult = finalResult || conditionResult;
            }
          }
        });

        return finalResult;
      });
    }

    // =========================
    // GROUP BY (FINAL)
    // =========================
    if (query.groupBy && query.aggregation === "count") {
      const actualKey = Object.keys(result[0] || {}).find(
        (k) => k.toLowerCase() === query.groupBy.toLowerCase()
      );

      if (!actualKey) return [];

      const grouped = {};

      result.forEach((row) => {
        const key = row[actualKey];
        grouped[key] = (grouped[key] || 0) + 1;
      });

      return Object.entries(grouped).map(([key, count]) => ({
        label: key,
        value: count,
      }));
    }

    // =========================
    // SORT (FIXED)
    // =========================
    if (query.sortBy) {
      result.sort((a, b) => {
        const keyA = Object.keys(a).find(
          (k) => k.toLowerCase() === query.sortBy.toLowerCase()
        );

        const keyB = Object.keys(b).find(
          (k) => k.toLowerCase() === query.sortBy.toLowerCase()
        );

        const valA = keyA ? a[keyA] : null;
        const valB = keyB ? b[keyB] : null;

        if (typeof valA === "string") {
          return query.sortOrder === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        return query.sortOrder === "asc"
          ? valA - valB
          : valB - valA;
      });
    }

    // =========================
    // LIMIT
    // =========================
    if (query.limit) {
      result = result.slice(0, query.limit);
    }

    // =========================
    // SELECT COLUMNS
    // =========================
    if (query.columns && query.columns.length > 0) {
      result = result.map((row) => {
        const filtered = {};

        query.columns.forEach((col) => {
          const key = Object.keys(row).find(
            (k) => k.toLowerCase() === col.toLowerCase()
          );

          filtered[col] = key ? row[key] : null;
        });

        return filtered;
      });
    }

    return result;
  }

  getType() {
    return "csv";
  }

  async getData() {
    await this.loadFile();
    return this.tables[this.tableName];
  }
}