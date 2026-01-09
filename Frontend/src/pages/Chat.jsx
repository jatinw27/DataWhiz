import Header from "../Header";
import ChatWindow from "../Chat/ChatWindow";
import DatasetSelector from "../Chat/DatasetSelector";
import InputBar from "../Chat/InputBar";
import { useChat } from "../hooks/useChat";
import { useDatasets } from "../hooks/useDatasets";

export default function Chat() {
  const chat = useChat();
  const datasets = useDatasets();

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Header />

      <DatasetSelector {...datasets} />

      <ChatWindow {...chat} />

      <InputBar onSend={chat.sendMessage} />
    </div>
  );
}
