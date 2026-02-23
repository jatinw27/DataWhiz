import { useState, useRef, useEffect } from "react";
import { askNLQ, sendChatMessage } from "../services/api";

export function useChat() {
  /* =========================================================
     STATE
     ========================================================= */

  // All chat sessions stored as { [sessionId]: { id, title, messages } }
  const [sessions, setSessions] = useState({});

  // Currently active chat session
  const [activeSessionId, setActiveSessionId] = useState(null);

  // Global loading indicator (bot typing)
  const [loading, setLoading] = useState(false);

  // Used for auto-scrolling chat to bottom
  const bottomRef = useRef(null);

  /* =========================================================
     HELPERS
     ========================================================= */

  // Format time for message timestamps
  const getTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Generate chat title from first user message
  const generateTitle = (text) =>
    text
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .split(" ")
      .slice(0, 5)
      .join(" ");

  /* =========================================================
     CREATE NEW SESSION
     ========================================================= */

  const createNewSession = () => {
    const id = "chat_" + Date.now();

    const newSession = {
      id,
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
    };

    setSessions((prev) => ({
      ...prev,
      [id]: newSession,
    }));

    setActiveSessionId(id);
  };

  const renameSession = (id, newTitle) => {
  setSessions(prev => ({
    ...prev,
    [id]: {
      ...prev[id],
      title: newTitle,
    },
  }));
};

const deleteSession = (id) => {
  setSessions(prev => {
    const copy = { ...prev };
    delete copy[id];

    const remainingIds = Object.keys(copy);
    setActiveSessionId(remainingIds[0] || null);

    return copy;
  });
};


useEffect(() => {
  if (!activeSessionId && Object.keys(sessions).length === 0) {
    createNewSession();
  }
}, [activeSessionId, sessions]);

  /* =========================================================
     LOAD SESSIONS FROM LOCAL STORAGE (ON MOUNT)
     ========================================================= */

  useEffect(() => {
    const savedSessions = localStorage.getItem("chatSessions");
    const savedActive = localStorage.getItem("activeChatSession");

    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setSessions(parsed);

      // Ensure active session always exists
      const validActive =
        savedActive && parsed[savedActive]
          ? savedActive
          : Object.keys(parsed)[0];

      setActiveSessionId(validActive);
    } else {
      // First time user → create default chat
      createNewSession();
    }
  }, []);

  /* =========================================================
     PERSIST SESSIONS TO LOCAL STORAGE
     ========================================================= */

  useEffect(() => {
    localStorage.setItem("chatSessions", JSON.stringify(sessions));
    localStorage.setItem("activeChatSession", activeSessionId);
  }, [sessions, activeSessionId]);

  /* =========================================================
     AUTO SCROLL TO BOTTOM WHEN MESSAGES CHANGE
     ========================================================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions[activeSessionId]?.messages, loading]);

  /* =========================================================
     SEND MESSAGE (AI OR DATA MODE)
     ========================================================= */


  const sendMessage = async ({ text, mode, source, dataset }) => {
    console.log("sendMessage called with:", { text, mode, source, dataset });
    console.log("DATA MODE PAYLOAD", {
  mode,
  source,
  dataset,
});
    if (!text?.trim() ) return;
    
  const sessionId = activeSessionId;
  if (!sessionId) return;

    const userMessage = {
      text,
      sender: "user",
      status: "sending",
      time: getTime(),
    };

    // Add user message immediately
    setSessions((prev) => {
      const session = prev[activeSessionId];
      const isFirstMessage = session.messages.length === 0;

      return {
        ...prev,
        [activeSessionId]: {
          ...session,
          title: isFirstMessage
            ? generateTitle(text)
            : session.title,
          messages: [...session.messages, userMessage],
        },
      };
    });

    setLoading(true);

    try {
      let res;

      // DATA CHAT (CSV / DB)
      if (mode === "data") {
  // HARD validation
  if (!source || !dataset) {
    setSessions((prev) => {
      const session = prev[activeSessionId];

      return {
        ...prev,
        [activeSessionId]: {
          ...session,
          messages: [
            ...session.messages,
            {
              text: "Please select a valid data source and dataset before asking a question.",
              sender: "bot",
              time: getTime(),
            },
          ],
        },
      };
    });

    setLoading(false);
    return;
  }

  res = await askNLQ({
    question: text,
    source,
    dataset,
  });
}
      // AI CHAT
      else {
        res = await sendChatMessage({
          text,
          sessionId: activeSessionId,
        });
      }

     const fullText = res.data.answer || res.data.botMsg;

// Step 1: Add empty bot message first
setSessions((prev) => {
  const session = prev[activeSessionId];
  const updatedMessages = [...session.messages];

  // mark user as sent
  updatedMessages[updatedMessages.length - 1] = {
    ...updatedMessages[updatedMessages.length - 1],
    status: "sent",
  };

  return {
    ...prev,
    [activeSessionId]: {
      ...session,
      messages: [
        ...updatedMessages,
        {
          text: "",
          sender: "bot",
          time: getTime(),
          data: res.data.data || [],
          query: res.data.generatedQuery || null,
        },
      ],
    },
  };
});

// Step 2: Streaming effect
let index = 0;

const interval = setInterval(() => {
  index++;

  setSessions((prev) => {
    const session = prev[activeSessionId];
    const updatedMessages = [...session.messages];

    const lastIndex = updatedMessages.length - 1;

    updatedMessages[lastIndex] = {
      ...updatedMessages[lastIndex],
      text: fullText.slice(0, index),
    };

    return {
      ...prev,
      [activeSessionId]: {
        ...session,
        messages: updatedMessages,
      },
    };
  });

  if (index >= fullText.length) {
    clearInterval(interval);
  }
}, 15); // speed (lower = faster)

    } catch (err) {
      // Mark last user message as error
      setSessions((prev) => {
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

  /* =========================================================
     EXPOSE API
     ========================================================= */

  return {
    sessions,                    // all chat sessions
    activeSessionId,             // current session id
    setActiveSessionId,          // switch chats
    createNewSession,            // new chat button
     renameSession,
    deleteSession,
    messages: sessions[activeSessionId]?.messages || [],
    loading,
    sendMessage,
    bottomRef,
   
  };
}
