import  { Groq } from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function aiGenerateQuery(question, schema, dbType) {
  const prompt = `
You are an AI that converts natural language into a database query.

Database type: ${dbType}

Schema:
${JSON.stringify(schema, null, 2)}

IF database type is "mongo", return ONLY valid JSON in this format:
{
  "type": "mongo",
  "collection": string,
  "filter": object | {},
  "projection": object | {},
  "aggregation": array | null
}

IF database type is "sqlite" OR "csv", return ONLY valid JSON in this format:
{
  "type": "sql",
  "table": string,
  "columns": string[] | [],
  "condition": string | null,
  "aggregation": string | null
}

Rules:
- Return ONLY JSON
- Do NOT explain
- Do NOT wrap in markdown

Question:
"${question}"
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0
  });

  const text = response.choices[0].message.content.trim();
  return JSON.parse(text);
}
