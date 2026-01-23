import { useState, useRef, useEffect } from "react";
import { askNLQ, sendChatMessage } from "../services/api";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const sessionId =
    localStorage.getItem("myChatSession") || "user_" + Date.now();

  /* ---------- Helpers ---------- */
  const getTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  /* ---------- Persist chat ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("chatMessages");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("myChatSession", sessionId);
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ---------- Logic ---------- */
const sendMessage = async ({ text, mode, source, dataset }) => {
  if (!text?.trim()) return;

  const userMessage = {
    text,
    sender: "user",
    status: "sending",
    time: getTime(),
  };

  setMessages(prev => [...prev, userMessage]);
  setLoading(true);

  try {
    let res;

    if (mode === "data") {
      res = await askNLQ({ question: text, source, dataset });
    } else {
      res = await sendChatMessage({ text, sessionId });
    }

    let botText = "";
    let botData = [];

    if (mode === "data") {
      botText = res.data.answer;
      botData = res.data.data || [];
    } else {
      botText = res.data.botMsg;
    }

    setMessages(prev => {
      const updated = [...prev];

      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        status: "sent",
      };

      return [
        ...updated,
        {
          text: botText,
          sender: "bot",
          time: getTime(),
          data: botData,
        },
      ];
    });
  } catch {
    setMessages(prev => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        status: "error",
      };
      return updated;
    });
  } finally {
    setLoading(false);
  }
};


  return { messages, loading, sendMessage, bottomRef };
}
