export function detectTable(question, schema) {
    const q = question.toLowerCase();

    for (const table of Object.keys(schema)) {
        if(q.includes(table)) {
            return table;
        }
    }
    return null;
}