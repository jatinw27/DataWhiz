import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function aiFallback(question, rows) {
  try {
    const preview = rows.slice(0, 10); // avoid huge data

    const prompt = `
You are a data analyst.

User question:
"${question}"

Dataset sample:
${JSON.stringify(preview, null, 2)}

Answer in simple English.
Give insight, not raw JSON.
`;

    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return res.choices[0].message.content;

  } catch (err) {
    console.error("AI FALLBACK ERROR:", err);
    return "AI analysis failed.";
  }
}