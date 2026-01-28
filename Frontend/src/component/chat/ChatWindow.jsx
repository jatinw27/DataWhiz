import Loader from "../Loader";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages, loading, bottomRef }) {
  return (
    <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 scroll-smooth">
     {messages.length === 0 && (
  <div className="text-center text-gray-400 mt-32">
    <h2 className="text-xl mb-2">
      Welcome to <span className="text-green-500">DataWhiz</span>
    </h2>
    <p className="text-sm">
      Ask questions about your data or chat with AI
    </p>
  </div>
)}


      {messages.map((msg, i) => {
        const prev = messages[i - 1];
        const isGrouped = prev && prev.sender === msg.sender;

        return (
          <MessageBubble
            key={i}
            {...msg}
            isGrouped={isGrouped}
          />
        );
      })}

      {loading && <Loader text="DataWhiz is thinking..." />}

      <div ref={bottomRef} />
    </main>
  );
}
