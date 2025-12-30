export function parseIntent(question) {
    const q = question.toLowerCase();

    if(q.startsWith("how many") || q.includes("count")) {
        return "count";
    }

    if (q.startsWith("list") || q.includes("show") || q.startsWith("get")) {
        return "select";
    }
    return "select";
}