import { useState } from "react";
import Header from "../component/layout/Header.jsx";
import ChatWindow from "../component/chat/ChatWindow.jsx";
import DatasetSelector from "../component/chat/DatasetSelector.jsx";
import InputBar from "../component/chat/InputBar.jsx";
import ChatSessions from "../component/chat/ChatSessions.jsx";
import { useChat } from "../hooks/useChat";
import { useDatasets } from "../hooks/useDatasets";

export default function Chat() {
  const chat = useChat();
  const datasets = useDatasets();

  const [selectedSource, setSelectedSource] = useState("csv");
  const [chatMode, setChatMode] = useState("data");

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-white overflow-hidden">

      {/* LEFT SIDEBAR */}
      <div className="hidden md:flex w-64 border-r border-gray-800">
        <ChatSessions
          sessions={chat.sessions}
          activeSessionId={chat.activeSessionId}
          setActiveSessionId={chat.setActiveSessionId}
          createNewSession={chat.createNewSession}
          renameSession={chat.renameSession}
          deleteSession={chat.deleteSession}
        />
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex flex-col flex-1">

        <Header />

        {/* MODE SWITCHER */}
        <div className="px-8 pt-6 flex gap-4">
          <button
            onClick={() => setChatMode("data")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              chatMode === "data"
                ? "bg-green-600"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            📊 Data Chat
          </button>

          <button
            onClick={() => setChatMode("ai")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              chatMode === "ai"
                ? "bg-green-600"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            🤖 AI Chat
          </button>
        </div>

        {/* DATA SOURCE SELECTOR */}
        {chatMode === "data" && (
          <div className="px-8">
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
          </div>
        )}

        {/* CHAT AREA CONTAINER */}
        <div className="flex-1 overflow-y-auto px-8 pt-6 pb-32 max-w-4xl w-full mx-auto">
          <ChatWindow {...chat} />
        </div>

        {/* INPUT BAR */}
        <div className="border-t border-gray-800 bg-[#0d0d0d] px-8 py-4">
          <div className="max-w-4xl mx-auto">
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
    </div>
  );
}
