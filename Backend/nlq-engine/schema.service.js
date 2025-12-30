// Backend/nlq-engine/schema.service.js
import db from "./database.js";

/**
 * Reads database schema dynamically
 * Returns: { tableName: [column1, column2, ...] }
 */
export function getDatabaseSchema() {
  return new Promise((resolve, reject) => {
    const schema = {};

    // 1️ Get all tables
    db.all(
      `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`,
      [],
      (err, tables) => {
        if (err) return reject(err);

        if (!tables.length) return resolve(schema);

        let pending = tables.length;

        // 2️⃣ For each table, get columns
        tables.forEach(({ name }) => {
          db.all(`PRAGMA table_info(${name})`, [], (err, columns) => {
            if (err) return reject(err);

            schema[name] = columns.map(col => col.name);

            pending--;
            if (pending === 0) {
              resolve(schema);
            }
          });
        });
      }
    );
  });
}
