export function toNaturalLanguage(rows) {
    
    if(!rows || rows.length === 0) {
        return "No matching records were found.";
    }

    if ("name" in rows[0] && "age" in rows[0]) {
        return rows
            .map(r => `${r.name} is ${r.age} years old`)
            .join(". ") + ".";
    }
    return `I found ${rows.length} result(s).`;
}