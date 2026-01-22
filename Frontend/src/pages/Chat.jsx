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
  const [chatMode, setChatMode] = useState("data"); // data | ai

  return (
    <div className="h-screen flex flex-col bg-[#0d0d0d] text-white">
      {/* Header */}
      <Header />

      {/* Chat Mode Toggle */}
<div className="flex gap-3 px-6 mt-6">
  <button
    onClick={() => setChatMode("data")}
    className={`px-4 py-2 rounded-lg
      ${chatMode === "data"
        ? "bg-green-600 text-white"
        : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
  >
    📊 Data Chat
  </button>

  <button
    onClick={() => setChatMode("ai")}
    className={`px-4 py-2 rounded-lg
      ${chatMode === "ai"
        ? "bg-blue-600 text-white"
        : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
  >
    🤖 AI Chat
  </button>
</div>

{/* Dataset selector ONLY for data mode */}
{chatMode === "data" && (
  <DatasetSelector
    selectedSource={selectedSource}
    setSelectedSource={setSelectedSource}
    {...datasets}
  />
)}


      {/* ✅ ChatWindow handles scrolling itself */}
      <ChatWindow {...chat} />

      {/* Fixed input */}
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
  );
}
