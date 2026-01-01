import { Groq } from "groq-sdk";

/**
 * Uses AI only when rule engine fails
 */
export async function aiGenerateSQL(question, schema) {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  const prompt = `
You are an expert SQL generator.

Database schema:
${JSON.stringify(schema, null, 2)}

User question:
"${question}"

Rules:
- Only generate valid SQLite SQL
- Use only tables and columns from schema
- Return ONLY SQL, no explanation
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0
  });

  return completion.choices[0].message.content.trim();
}
