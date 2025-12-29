export function nlpToSQL(question) {
    const q = question.toLowerCase();

    if(q.includes("all users")) {
        return "SELECT * FROM users";
    }

    if(q.includes("older than")){
        const age = q.match(/\d+/)?.[0];
        return `SELECT * FROM users WHERE age > ${age}`;
    }
return null;
} 