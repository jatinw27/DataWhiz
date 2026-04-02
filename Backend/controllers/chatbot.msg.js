import axios from "axios";
import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Simple heuristic to detect data-related questions
 */
function isDataQuestion(text) {
  const keywords = [
    "count", "average", "avg", "sum", "total",
    "max", "min",
    "how many", "list", "show",
    "users", "records", "rows",
    "older", "younger", "greater", "less"
  ];

  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

export const Message = async (req, res) => {
  try {
    const { text } = req.body;

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: text }
      ],
      temperature: 0.7
    });

    return res.json({
      botMsg: chatCompletion.choices[0]?.message?.content
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ botMsg: "AI error" });
  }
};

export default Message;
