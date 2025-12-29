import sqlite3 from "sqlite3"

const sqlite = sqlite3.verbose();
const db = new sqlite.Database("nlq.db");

db.serialize(() => {
    db.run (`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER
        )`);
        db.get("SELECT COUNT(*) as count FROM users",(err,row) => {
            if(row.count === 0){
                db.run(`
                    INSERT INTO users(name, age)
                    VALUES('Alice', 30), ('Bob', 34)`);
            }
        });
});
 export default db;