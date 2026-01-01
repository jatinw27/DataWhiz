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
        if(this.loaded) return;

        return new Promise((resolve, reject) => {
            fs.createReadStream(this.filePath)
                .pipe(csv())
                .on("data", row => {
                     // Convert numeric values automatically
                     for (const key in row) {
                        if(!isNaN(row[key])) {
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

console.log("CSV TABLE NAME:", this.tableName);

    return {
      [this.tableName]: Object.keys(this.rows[0])
    };
  }

  async runQuery(query) {
    await this.loadFile();

    // query format: { table, columns, condition }
    const { table, columns, condition, aggregation } = query;

    let result = [...this.rows];

    // WHERE condition (simple)
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

    // AGGREGATION
    if (aggregation) {
      const match = aggregation.match(/(AVG|MIN|MAX|SUM)\((.+)\)/i);

      if (match) {
        const func = match[1].toUpperCase();
        const field = match[2];

        const values = result.map(r => r[field]).filter(v => typeof v === "number");

        let value = null;
        if (func === "AVG") value = values.reduce((a, b) => a + b, 0) / values.length;
        if (func === "MIN") value = Math.min(...values);
        if (func === "MAX") value = Math.max(...values);
        if (func === "SUM") value = values.reduce((a, b) => a + b, 0);

        return [{ value }];
      }
    }

    // SELECT columns
    if (columns && columns.length) {
      result = result.map(row => {
        const filtered = {};
        columns.forEach(col => (filtered[col] = row[col]));
        return filtered;
      });
    }

    return result;
  }

  getType() {
    return "csv";
  }
}