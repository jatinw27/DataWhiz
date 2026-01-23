import { useState } from "react";
import Header from "../component/Header.jsx";
import ChatWindow from "../component/chat/ChatWindow.jsx";
import DatasetSelector from "../component/chat/DatasetSelector.jsx";
import InputBar from "../component/chat/InputBar.jsx";
import { useChat } from "../hooks/useChat";
import { useDatasets } from "../hooks/useDatasets";

export default function Chat() {
  const chat = useChat();
  const datasets = useDatasets();
  const [selectedSource, setSelectedSource] = useState("csv");
  const [chatMode, setChatMode] = useState("data");

  return (
   <div className="h-screen flex flex-col bg-[#0d0d0d] text-white">
  <Header />

  {/* Mode Toggle */}
  <div className="max-w-5xl mx-auto w-full px-6 mt-4">
    <div className="flex gap-3">
      <button
        onClick={() => setChatMode("data")}
        className={`px-4 py-2 rounded-lg ${
          chatMode === "data"
            ? "bg-green-600 text-white"
            : "bg-gray-800 text-gray-300"
        }`}
      >
        📊 Data Chat
      </button>

      <button
        onClick={() => setChatMode("ai")}
        className={`px-4 py-2 rounded-lg ${
          chatMode === "ai"
            ? "bg-green-600 text-white"
            : "bg-gray-800 text-gray-300"
        }`}
      >
        🤖 AI Chat
      </button>
    </div>
  </div>

  {/* Dataset Selector */}
  {chatMode === "data" && (
    <div className="max-w-5xl mx-auto w-full px-6 mt-4">
      <DatasetSelector
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        {...datasets}
      />
    </div>
  )}

  {/* Chat Area */}
  <div className="flex-1 overflow-hidden">
    <ChatWindow {...chat} />
  </div>

  {/* Input */}
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

  );
}
