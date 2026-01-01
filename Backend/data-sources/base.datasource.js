export class BaseDataSource {
    async getSchema() {
        throw new Error("getSchema() not implemented" );
    }

    async runQuery(query) {
        throw new Error("runQuery() not implemented");
    }

    async getType() {
        throw new Error("getType() not implemented");
    }
    
}