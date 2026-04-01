import Database from "better-sqlite3";
import { BaseDataSource } from "./base.datasource.js";

export class SQLiteDataSource extends BaseDataSource {
  constructor(dbPath) {
    super();
    this.db = new Database(dbPath);
  }

  getType() {
    return "sqlite";
  }

  async getSchema() {
    const schema = {};

    const tables = this.db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      )
      .all();

    for (const { name } of tables) {
      const columns = this.db
        .prepare(`PRAGMA table_info(${name})`)
        .all()
        .map(col => col.name);

      schema[name] = columns;
    }

    return schema;
  }

  async runQuery(sql) {
    if (typeof sql !== "string") {
      throw new Error("SQLiteDataSource expects SQL string");
    }

    return this.db.prepare(sql).all();
  }
}
