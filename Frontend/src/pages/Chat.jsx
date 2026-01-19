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
  const [mode, setMode] = useState("data"); // 👈 NEW

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      
      <Header />

      {/* MODE TOGGLE */}
      <div className="flex gap-3 px-6 mt-20">
        
        <button
          onClick={() => setMode("data")}
          className={`px-4 py-2 rounded ${
            mode === "data" ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          📊 Data Chat
        </button>


        <button
          onClick={() => setMode("chat")}
          className={`px-4 py-2 rounded ${
            mode === "chat" ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          🤖 AI Chat
        </button>
      </div>

      {mode === "data" && (
        <DatasetSelector
          selectedSource={selectedSource}
          setSelectedSource={setSelectedSource}
          {...datasets}
        />
      )}

      <ChatWindow {...chat} />

      <InputBar
        onSend={(text) =>
          chat.sendMessage({
            text,
            mode,
            source: selectedSource,
            dataset: datasets.selectedDataset,
          })
        }
      />
      
    </div>
  );
}
