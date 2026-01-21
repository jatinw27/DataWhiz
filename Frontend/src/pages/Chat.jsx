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

  return (
    <div className="h-screen flex flex-col bg-[#0d0d0d] text-white">
      {/* Header */}
      <Header />

      {/* Dataset selector */}
      <DatasetSelector
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
        {...datasets}
      />

      {/* ✅ ChatWindow handles scrolling itself */}
      <ChatWindow {...chat} />

      {/* Fixed input */}
      <div className="border-t border-gray-800">
        <InputBar
          onSend={(text) =>
            chat.sendMessage({
              text,
              mode: selectedSource === "csv" ? "data" : "ai",
              source: selectedSource,
              dataset: datasets.selectedDataset,
            })
          }
        />
      </div>
    </div>
  );
}
