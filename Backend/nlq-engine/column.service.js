export function detectColumns(question, table, schema) {
    const q = question.toLowerCase();
    const columns = schema[table] || [];

    return columns.filter(col => q.includes(col));
}