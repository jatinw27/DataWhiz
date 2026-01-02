import  { Groq } from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function aiGenerateQuery(question, schema) {
    const prompt = ` You are an AI that converts natural language into a structured database query.
 Schema: ${JSON.stringify(schema, null, 2)}

 Return ONLY valid JSON in this format:
 {
    "table" : string,
    "columns" : string[] | [],
    "condition" : string | null,
    "aggregation" : string | null
 }

 Question:
 "${question}" `;

 const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt}],
    temperature: 0
 });

 const text = response.choices[0].message.content;

 return JSON.parse(text);
} 