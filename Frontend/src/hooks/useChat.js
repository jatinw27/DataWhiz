import { useState, useRef, useEffect } from "react";
import { askNLQ, sendChatMessage } from "../services/api";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const sessionId =
    localStorage.getItem("myChatSession") || "user_" + Date.now();
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

  const isDataQuery = (text) => {
    const keywords = [
      "show","list","get","fetch","users","data",
      "records","older than","younger than",
      "count","how many","average","avg",
    ];
    return keywords.some(k => text.toLowerCase().includes(k));
  };
const getTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const sendMessage = async ({ text, mode, source, dataset }) => {
  if (!text?.trim()) return;

  setMessages(prev => [
    ...prev,
    { text, sender: "user", time: getTime() },
  ]);

  setLoading(true);

  try {
    let res;

    if (mode === "data") {
      res = await askNLQ({ question: text, source, dataset });

      setMessages(prev => [
        ...prev,
        { text: res.data.answer, sender: "bot", time: getTime() },
      ]);
    } else {
      res = await sendChatMessage({ text, sessionId });

      setMessages(prev => [
        ...prev,
        { text: res.data.botMsg, sender: "bot", time: getTime() },
      ]);
    }
  } catch {
    setMessages(prev => [
      ...prev,
      {
        text: "Something went wrong. Please try again.",
        sender: "bot",
        time: getTime(),
      },
    ]);
  } finally {
    setLoading(false);
  }
};




  return { messages, loading, sendMessage, bottomRef };
}
