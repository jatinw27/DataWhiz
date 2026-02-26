import { useState, useRef, useEffect } from "react";
import { askNLQ, sendChatMessage, getDatasetSummary } from "../services/api";


/* =========================
   SIMPLE ENGLISH EXPLANATION
========================= */
function getSimpleEnglishAnswer(question, data, dataset) {
  if (!Array.isArray(data) || data.length === 0) return null;

  // COUNT
  if (data.length === 1 && "count" in data[0]) {
    return `There are ${data[0].count} records in the "${dataset}" dataset.`;
  }

  // SINGLE VALUE (SUM / AVG / etc.)
  if (data.length === 1 && "value" in data[0]) {
    return `The calculated result is ${data[0].value}.`;
  }

  // MULTIPLE ROWS
  if (data.length > 1) {
    return `I found ${data.length} matching records in the "${dataset}" dataset.`;
  }

  return null;
}

export function useChat() {
  /* =========================
     STATE
  ========================= */
  const [sessions, setSessions] = useState({});
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  /* =========================
     HELPERS
  ========================= */
  const getTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const generateTitle = (text) =>
    text
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .split(" ")
      .slice(0, 5)
      .join(" ");

  /* =========================
     SESSION MANAGEMENT
  ========================= */
  const createNewSession = () => {
    const id = "chat_" + Date.now();

    setSessions((prev) => ({
      ...prev,
      [id]: {
        id,
        title: "New Chat",
        messages: [],
        createdAt: Date.now(),
      },
    }));

    setActiveSessionId(id);
  };

  const renameSession = (id, newTitle) => {
    setSessions((prev) => ({
      ...prev,
      [id]: { ...prev[id], title: newTitle },
    }));
  };

  const deleteSession = (id) => {
    setSessions((prev) => {
      const copy = { ...prev };
      delete copy[id];
      setActiveSessionId(Object.keys(copy)[0] || null);
      return copy;
    });
  };

  /* =========================
     INIT / PERSIST
  ========================= */
  useEffect(() => {
    if (!activeSessionId && Object.keys(sessions).length === 0) {
      createNewSession();
    }
  }, [activeSessionId, sessions]);

  useEffect(() => {
    const savedSessions = localStorage.getItem("chatSessions");
    const savedActive = localStorage.getItem("activeChatSession");

    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setSessions(parsed);
      setActiveSessionId(
        savedActive && parsed[savedActive]
          ? savedActive
          : Object.keys(parsed)[0]
      );
    } else {
      createNewSession();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatSessions", JSON.stringify(sessions));
    localStorage.setItem("activeChatSession", activeSessionId);
  }, [sessions, activeSessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions[activeSessionId]?.messages, loading]);

  /* =========================
     SEND MESSAGE
  ========================= */
  const sendMessage = async ({ text, mode, source, dataset }) => {
    if (!text?.trim() || !activeSessionId) return;

    const userMessage = {
      text,
      sender: "user",
      status: "sending",
      time: getTime(),
    };

    // Add user message
    setSessions((prev) => {
      const session = prev[activeSessionId];
      return {
        ...prev,
        [activeSessionId]: {
          ...session,
          title:
            session.messages.length === 0
              ? generateTitle(text)
              : session.title,
          messages: [...session.messages, userMessage],
        },
      };
    });

    setLoading(true);

    try {
      let res;

      /* ===== DATA CHAT ===== */
      if (mode === "data") {
        if (!source || !dataset) {
          throw new Error("Invalid data source or dataset");
        }

        const isSummaryQuestion =
          text.toLowerCase().includes("summary") ||
          text.toLowerCase().includes("what is this file") ||
          text.toLowerCase().includes("what is this dataset");

        if (isSummaryQuestion) {
  const summaryRes = await getDatasetSummary(dataset);

  const { columns, rowCount, sample } = summaryRes.data;

  const summaryText = `
This dataset contains ${rowCount} records.

It includes the following fields:
${columns.join(", ")}.

Sample data shows that this dataset is related to customer information.
  `.trim();

  res = {
    data: {
      data: sample,
      answer: summaryText,
    },
  };
} else {
          res = await askNLQ({
            question: text,
            source,
            dataset,
          });
        }
      }

      /* ===== AI CHAT ===== */
      else {
        res = await sendChatMessage({
          text,
          sessionId: activeSessionId,
        });
      }

      const dataResult = res.data?.data || [];

      /* ===== RESPONSE PRIORITY ===== */
      let fullText =
        getSimpleEnglishAnswer(text, dataResult, dataset) ||
        res.data?.answer ||
        res.data?.botMsg ||
        `I could not find this information in the "${dataset}" dataset.`;

      /* ===== ADD BOT MESSAGE ===== */
      setSessions((prev) => {
        const session = prev[activeSessionId];
        const updated = [...session.messages];

        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          status: "sent",
        };

        return {
          ...prev,
          [activeSessionId]: {
            ...session,
            messages: [
              ...updated,
              {
                text: "",
                sender: "bot",
                time: getTime(),
                data: Array.isArray(dataResult) && dataResult.length > 0
                  ? dataResult
                  : null,
              },
            ],
          },
        };
      });

      /* ===== STREAM TEXT ===== */
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setSessions((prev) => {
          const session = prev[activeSessionId];
          const msgs = [...session.messages];
          msgs[msgs.length - 1].text = fullText.slice(0, i);
          return {
            ...prev,
            [activeSessionId]: { ...session, messages: msgs },
          };
        });

        if (i >= fullText.length) clearInterval(interval);
      }, 15);
    } catch (err) {
      setSessions((prev) => {
        const session = prev[activeSessionId];
        const msgs = [...session.messages];
        msgs[msgs.length - 1].status = "error";
        return {
          ...prev,
          [activeSessionId]: { ...session, messages: msgs },
        };
      });
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     EXPORT
  ========================= */
  return {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createNewSession,
    renameSession,
    deleteSession,
    messages: sessions[activeSessionId]?.messages || [],
    loading,
    sendMessage,
    bottomRef,
  };
}