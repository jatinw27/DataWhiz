import mongoose from "mongoose";
import { BaseDataSource } from "./base.datasource.js";

export class MongoDataSource extends BaseDataSource {
  constructor(uri, dbName) {
    super();
    this.uri = uri;
    this.dbName = dbName;
    this.connection = null;
  }

  async connect() {
    if (!this.connection) {
      this.connection = await mongoose
        .createConnection(this.uri, { dbName: this.dbName })
        .asPromise(); // 🔴 IMPORTANT
    }
    return this.connection;
  }

  async getSchema() {
    const conn = await this.connect();

    // ✅ SAFE way to access database
    const db = conn.getClient().db(this.dbName);

    const collections = await db.listCollections().toArray();
    const schema = {};

    for (const col of collections) {
      const sample = await db.collection(col.name).findOne();
      if (sample) {
        schema[col.name] = Object.keys(sample);
      }
    }

    return schema;
  }

  async runQuery(query) {
    const conn = await this.connect();
    const db = conn.getClient().db(this.dbName);

    const { collection, filter = {}, projection = {}, aggregation } = query;

    if (aggregation) {
      return db.collection(collection).aggregate(aggregation).toArray();
    }

    return db.collection(collection).find(filter, { projection }).toArray();
  }

  getType() {
    return "mongo";
  }
}
