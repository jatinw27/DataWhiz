import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAIInsights(data) {
  try {
    const prompt = `
You are a data analyst.

Analyze the following dataset and provide short insights:
- Top performer
- Trends
- Any patterns

Data:
${JSON.stringify(data, null, 2)}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful data analyst." },
        { role: "user", content: prompt },
      ],
    });

    return response.choices[0].message.content;

  } catch (err) {
    console.error("AI Insights Error:", err);
    return "Could not generate AI insights.";
  }
}