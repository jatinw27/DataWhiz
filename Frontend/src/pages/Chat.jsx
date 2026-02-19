import { useState } from "react";
import { Menu } from "lucide-react";

import Header from "../component/layout/Header.jsx";
import ChatWindow from "../component/chat/ChatWindow.jsx"
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
   <div className="flex h-screen bg-gray-100 dark:bg-[#0f0f0f] text-gray-900 dark:text-white overflow-hidden">

      {/* SIDEBAR */}
      <div
  className={`${
    sidebarOpen ? "w-64" : "w-0"
  } bg-white dark:bg-[#0d0d0d]
     border-r border-gray-200 dark:border-gray-800 shadow-sm
  transition-all duration-300 overflow-hidden `}
>

        <ChatSessions
          sessions={chat.sessions}
          activeSessionId={chat.activeSessionId}
          setActiveSessionId={chat.setActiveSessionId}
          createNewSession={chat.createNewSession}
          renameSession={chat.renameSession}
          deleteSession={chat.deleteSession}
        />
      </div>

      {/* MAIN AREA */}
      <div className="flex flex-col flex-1">

        {/* HEADER WITH TOGGLE */}
        <div className="sticky top-0 z-20 bg-white dark:bg-[#0d0d0d] border-b border-gray-200 dark:border-gray-800">
  <Header
    leftSlot={
      <button
        onClick={() => setSidebarOpen(prev => !prev)}
        className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <Menu size={20} />
      </button>
    }
  />
</div>


        {/* MODE SWITCH */}
        <div className="px-8 pt-6 flex gap-4">
          <button
            onClick={() => setChatMode("data")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              chatMode === "data"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 "
            }`}
          >
            📊 Data Chat
          </button>

          <button
            onClick={() => setChatMode("ai")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
              chatMode === "ai"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            }`}
          >
            🤖 AI Chat
          </button>
        </div>

        {/* DATA SOURCE */}
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

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto px-8 pt-6 pb-32 max-w-4xl w-full mx-auto">
          <ChatWindow 
  messages={chat.messages}
  loading={chat.loading}
  bottomRef={chat.bottomRef}
/>

       

        </div>

        {/* INPUT */}
       
 <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0d0d0d] px-8 py-4">

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
