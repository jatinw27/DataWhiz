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
    const { text, sessionId = "default" } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ botMsg: "Message cannot be empty." });
    }

    /* =======================
       1️⃣ DATA QUESTION → NLQ
       ======================= */
    if (isDataQuestion(text)) {
      try {
        const nlqResponse = await axios.post(
          `${process.env.NLQ_ENGINE_URL}/api/nlq/ask`,
          {
            question: text,
            source: "mongo"
          }
        );

        return res.json({
          botMsg: nlqResponse.data.answer,
          data: nlqResponse.data.data || []
        });

      } catch (nlqError) {
        console.error("NLQ failed, falling back to AI:", nlqError.message);
        // fall through to AI chat
      }
    }

    /* =======================
       2️⃣ NORMAL CHAT (AI)
       ======================= */
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: text }
      ],
      temperature: 0.7
    });

    const botresponse =
      chatCompletion.choices[0]?.message?.content ||
      "I didn't understand that.";

    return res.json({
      botMsg: botresponse
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    return res.status(500).json({
      botMsg: "Something went wrong. Please try again."
    });
  }
};

export default Message;
