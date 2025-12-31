export function detectAggregation(question, table, schema) {
    const q = question.toLowerCase();
    const columns = schema[table] || [];

    let targetColumn = columns.find(col => q.includes(col));

    if(!targetColumn && columns.includes("age")) {
        targetColumn = "age";
    }

    if (!targetColumn) return null;

    if (q.includes("average") || q.includes("avg")) {
        return `AVG(${targetColumn}) as value`;
    }

    if(q.includes("maximum") || q.includes("max")) {
        return `MAX(${targetColumn}) as value`;
    }

    if(q.includes("minimum") || q.includes("total")) {
        return `MIN(${targetColumn}) as value`;
    }

    if(q.includes("sum") || q.includes("total")) {
        return `SUM(${targetColumn} as value)`;
    }

    return null;
}