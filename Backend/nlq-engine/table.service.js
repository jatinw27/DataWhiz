export function detectTable(question, schema) {
  if (!question || !schema) return null;

  const q = question.toLowerCase().trim();
  const tables = Object.keys(schema);

  for (const table of tables) {
    const t = table.toLowerCase();

    // Exact match
    if (q.includes(t)) return table;

    // Singular match (user ↔ users)
    if (t.endsWith("s") && q.includes(t.slice(0, -1))) return table;

    // Plural match (users ↔ user)
    if (!t.endsWith("s") && q.includes(`${t}s`)) return table;
  }

  return null;
}
