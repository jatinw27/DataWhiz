import { useState, useRef, useEffect } from "react";
import { askNLQ, sendChatMessage } from "../services/api";

export function useChat() {
  const [sessions, setSessions] = useState({});
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  /* ---------- Helpers ---------- */
  const getTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  /* ---------- Create new session ---------- */
  const createNewSession = () => {
    const id = "chat_" + Date.now();

    const newSession = {
      id,
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
    };

    setSessions(prev => ({ ...prev, [id]: newSession }));
    setActiveSessionId(id);
  };

  /* ---------- Load sessions ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("chatSessions");
    const active = localStorage.getItem("activeChatSession");

    if (saved) {
      setSessions(JSON.parse(saved));
      setActiveSessionId(active);
    } else {
      createNewSession();
    }
  }, []);

  /* ---------- Persist sessions ---------- */
  useEffect(() => {
    localStorage.setItem("chatSessions", JSON.stringify(sessions));
    localStorage.setItem("activeChatSession", activeSessionId);
  }, [sessions, activeSessionId]);

  /* ---------- Auto scroll ---------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions, loading]);

  /* ---------- Send message ---------- */
  const sendMessage = async ({ text, mode, source, dataset }) => {
    if (!text?.trim() || !activeSessionId) return;

    const userMessage = {
      text,
      sender: "user",
      status: "sending",
      time: getTime(),
    };

    setSessions(prev => {
      const session = prev[activeSessionId];
      return {
        ...prev,
        [activeSessionId]: {
          ...session,
          messages: [...session.messages, userMessage],
        },
      };
    });

    setLoading(true);

    try {
      let res;

      if (mode === "data") {
        res = await askNLQ({ question: text, source, dataset });
      } else {
        res = await sendChatMessage({ text });
      }

      const botMessage = {
        text: res.data.answer || res.data.botMsg,
        sender: "bot",
        time: getTime(),
        data: res.data.data || [],
        query: res.data.generatedQuery || null,
      };

      setSessions(prev => {
        const session = prev[activeSessionId];
        const updatedMessages = [...session.messages];

        updatedMessages[updatedMessages.length - 1] = {
          ...updatedMessages[updatedMessages.length - 1],
          status: "sent",
        };

        return {
          ...prev,
          [activeSessionId]: {
            ...session,
            messages: [...updatedMessages, botMessage],
          },
        };
      });
    } catch {
      setSessions(prev => {
        const session = prev[activeSessionId];
        const updatedMessages = [...session.messages];

        updatedMessages[updatedMessages.length - 1] = {
          ...updatedMessages[updatedMessages.length - 1],
          status: "error",
        };

        return {
          ...prev,
          [activeSessionId]: {
            ...session,
            messages: updatedMessages,
          },
        };
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createNewSession,
    messages: sessions[activeSessionId]?.messages || [],
    loading,
    sendMessage,
    bottomRef,
  };
}
