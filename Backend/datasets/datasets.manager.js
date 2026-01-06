import { CSVDataSource } from "../data-sources/csv.datasource.js";

export class DatasetManager{
    constructor() {
        this.datasets = new Map();
    }

    registerCSV(name, filePath) {
        const ds = new CSVDataSource(filePath, name);
        this.datasets.set(name, ds);
    }

    get(name) {
        return this.datasets.get(name);
    }

    list() {
        return Array.from(this.datasets.keys());
    }
}