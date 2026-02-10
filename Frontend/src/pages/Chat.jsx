import { useState } from "react";
// import Header from "../component/Header.jsx";
import ChatWindow from "../component/chat/ChatWindow.jsx";
import DatasetSelector from "../component/chat/DatasetSelector.jsx";
import InputBar from "../component/chat/InputBar.jsx";
import ChatSessions from "../component/chat/ChatSessions.jsx";
import { useChat } from "../hooks/useChat";
import { useDatasets } from "../hooks/useDatasets";
import Header from "../component/layout/Header.jsx";

export default function Chat() {
  const chat = useChat();
  const datasets = useDatasets();

  const [selectedSource, setSelectedSource] = useState("csv");
  const [chatMode, setChatMode] = useState("data"); // data | ai

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-white">
      
      {/* LEFT SIDEBAR */}
      <div className="hidden md:block">
      <ChatSessions
        sessions={chat.sessions}
        activeSessionId={chat.activeSessionId}
        setActiveSessionId={chat.setActiveSessionId}
        createNewSession={chat.createNewSession}
      />
      </div>
      {/* MAIN CHAT AREA */}
      <div className="flex flex-col flex-1">
        
        {/** HEADER */}
        <Header />

        {/* MODE TOGGLE */}
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

        {/* DATASET SELECTOR (only for data mode) */}
       {chatMode === "data" && (
  <DatasetSelector
    selectedSource={selectedSource}
    setSelectedSource={setSelectedSource}
    selectedDataset={datasets.selectedDataset}
    setSelectedDataset={datasets.setSelectedDataset}
    datasets={datasets.datasets}
    addDataset={datasets.addDataset}          
    setMongoUri={datasets.setMongoUri}        
    setSqliteFile={datasets.setSqliteFile}    
  />
)}


        {/* CHAT WINDOW */}
        <ChatWindow {...chat} />

        {/* INPUT */}
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
