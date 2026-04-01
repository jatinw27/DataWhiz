import { SQLiteDataSource } from "./sqlite.datasource.js";

const ds = new SQLiteDataSource("../nlq.db");

const schema = await ds.getSchema()
console.log("Schema: ", schema);

const rows = await ds.runQuery("SELECT * FROM users");
console.log("Rows: ", rows);


