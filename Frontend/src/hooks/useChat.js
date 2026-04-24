import { useState, useRef, useEffect } from "react";
import {
  askNLQ,
  sendChatMessage,
  getDatasetSummary,
} from "../services/api";
import { detectChart } from "../utils/chartDetector.js";
/* =========================
   SIMPLE ENGLISH EXPLANATION
========================= */
function getSimpleEnglishAnswer(question, data, dataset) {

  if (!dataset) {
  throw new Error("No dataset selected");
}
  if (!Array.isArray(data) || data.length === 0) return null;

  // COUNT
  if (data.length === 1 && "count" in data[0]) {
    return `There are ${data[0].count} records in the "${dataset}" dataset.`;
  }

  // SINGLE VALUE
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
     INIT & PERSIST
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

    // ✅ DEFINE ONCE (important fix)
    const isSummaryQuestion =
      text.toLowerCase().includes("summary") ||
      text.toLowerCase().includes("what is this file") ||
      text.toLowerCase().includes("what is this dataset");

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

        // ✅ SUMMARY PATH
        if (isSummaryQuestion) {
          const summaryRes = await getDatasetSummary(dataset);
         const { dataset: name, totalRows, columnStats } = summaryRes.data;

const columnCount = Object.keys(columnStats).length;
const numericCols = Object.values(columnStats).filter(c => c.type === "number").length;
const dateCols = Object.values(columnStats).filter(c => c.type === "date").length;

const summaryText = `
This dataset is called "${name}".

It contains ${totalRows} records across ${columnCount} fields.

The data includes:
- ${numericCols} numeric columns
- ${dateCols} date columns
- ${columnCount - numericCols - dateCols} text-based columns

This dataset appears suitable for customer analysis, reporting, and trend exploration.
`.trim();

          res = {
            data: {
              answer: summaryText,
              data: null, //  no table for summary
            },
          };
        }
        //  NORMAL DATA QUESTION
        else {
         res = await askNLQ({
  question: text,
  dataset
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
      const chartResult = res.data.chart || detectChart(dataResult);

      /* ===== FINAL TEXT ===== */
      let fullText;

      if (isSummaryQuestion) {
        fullText = res.data.answer;
      } else {
        fullText =
          res.data?.insights ||
          getSimpleEnglishAnswer(text, dataResult, dataset) ||
          res.data?.answer ||
          res.data?.botMsg ||
          `I could not find this information in the "${dataset}" dataset.`;
      }

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
                data:
                  Array.isArray(dataResult) && dataResult.length > 0
                    ? dataResult
                    : null,
                chart: chartResult
              },
            ],
          },
        };
      });

      /* ===== STREAM EFFECT ===== */
      let i = 0;

const interval = setInterval(() => {
  i += Math.floor(Math.random() * 3) + 1; // 🔥 variable speed

  setSessions((prev) => {
    const session = prev[activeSessionId];
    const msgs = [...session.messages];

    msgs[msgs.length - 1].text = fullText.slice(0, i);

    return {
      ...prev,
      [activeSessionId]: { ...session, messages: msgs },
    };
  });

  if (i >= fullText.length) {
  clearInterval(interval);
  setLoading(false); 
}
}, 20);
    } catch (err) {
  console.error("❌ CHAT ERROR:", err);

  setSessions((prev) => {
    const session = prev[activeSessionId];
    const msgs = [...session.messages];

    msgs[msgs.length - 1] = {
      ...msgs[msgs.length - 1],
      status: "sent"
    };

    return {
      ...prev,
      [activeSessionId]: {
        ...session,
        messages: [
          ...msgs,
          {
            text: "Something went wrong. Please try again.",
            sender: "bot",
            time: getTime(),
          },
        ],
      },
    };
  });
  setLoading(false);
}
  }
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
