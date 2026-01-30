import { SQLiteDataSource } from "./sqlite.datasource.js";

export class DataSourceManager {
    constructor() {
        this.sources = {};
    }

    register(name, source) {
        this.sources[name] = source;
    }

   get(name) {
  if (!this.sources[name]) {
    throw new Error(`Datasource '${name}' not registered`);
  }
  return this.sources[name];
}


    list() {
        return Object.keys(this.sources);
    }
}