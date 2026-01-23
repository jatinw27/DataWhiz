import { useState } from "react";
import Header from "../component/Header.jsx";
import ChatWindow from "../component/chat/ChatWindow.jsx";
import DatasetSelector from "../component/chat/DatasetSelector.jsx";
import InputBar from "../component/chat/InputBar.jsx";
import ChatSessions from "../component/chat/ChatSessions.jsx"; // ✅ REQUIRED
import { useChat } from "../hooks/useChat";
import { useDatasets } from "../hooks/useDatasets";

export default function Chat() {
  const chat = useChat();
  const datasets = useDatasets();

  const [selectedSource, setSelectedSource] = useState("csv");
  const [chatMode, setChatMode] = useState("data"); // data | ai

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-white">
      
      {/* 🟩 LEFT SIDEBAR */}
      <ChatSessions {...chat} />

      {/* 🟦 RIGHT CHAT AREA */}
      <div className="flex-1 flex flex-col">
        <Header />

        {/* 🔥 Mode Toggle */}
        <div className="px-6 pt-4 flex gap-3">
          <button
            onClick={() => setChatMode("data")}
            className={`px-4 py-2 rounded-lg text-sm ${
              chatMode === "data"
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            📊 Data Chat
          </button>

          <button
            onClick={() => setChatMode("ai")}
            className={`px-4 py-2 rounded-lg text-sm ${
              chatMode === "ai"
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            🤖 AI Chat
          </button>
        </div>

        {/* Dataset selector only for Data mode */}
        {chatMode === "data" && (
          <div className="mt-3">
            <DatasetSelector
              selectedSource={selectedSource}
              setSelectedSource={setSelectedSource}
              {...datasets}
            />
          </div>
        )}

        {/* Chat messages */}
        <ChatWindow {...chat} />

        {/* Input */}
        <div className="border-t border-gray-800">
          <InputBar
            loading={chat.loading}
            onSend={(text) =>
              chat.sendMessage({
                text,
                mode: chatMode,
                source: selectedSource,
                dataset: datasets.selectedDataset,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
