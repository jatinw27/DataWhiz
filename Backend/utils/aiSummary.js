import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateAISummary(dataSource) {

  const stats = await dataSource.getColumnStats();
  const insights = await dataSource.getInsights();
  const sample = (await dataSource.runQuery({}))?.slice(0, 50);

  const prompt = `
You are a data analyst.

Dataset stats:
${JSON.stringify(stats, null, 2)}

Insights:
${JSON.stringify(insights, null, 2)}

Sample Data:
${JSON.stringify(sample, null, 2)}

Give a short, clear business-style summary of this dataset.
Focus on patterns, trends, and data quality.
Avoid technical jargon.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: "You are a smart data analyst." },
      { role: "user", content: prompt }
    ]
  });

  return response.choices[0].message.content;
}