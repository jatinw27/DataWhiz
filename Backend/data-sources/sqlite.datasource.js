import sqlite3 from "sqlite3";
import { BaseDataSource } from "./base.datasource.js";

export class SQLiteDataSource extends BaseDataSource {
  constructor(dbPath) {
    super();
    this.db = new sqlite3.Database(dbPath);
  }

  async getSchema() {
    return new Promise((resolve, reject) => {
      const schema = {};

      this.db.all(
        `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`,
        [],
        (err, tables) => {
          if (err) return reject(err);

          let pending = tables.length;
          if (!pending) return resolve(schema);

          tables.forEach(({ name }) => {
            this.db.all(`PRAGMA table_info(${name})`, [], (err, columns) => {
              if (err) return reject(err);

              schema[name] = columns.map(col => col.name);

              pending--;
              if (pending === 0) resolve(schema);
            });
          });
        }
      );
    });
  }

  async runQuery(sql) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  getType() {
    return "sqlite";
  }
}
