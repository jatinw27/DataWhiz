import Loader from "../Loader";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages, loading, bottomRef }) {
  return (
    <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 scroll-smooth">
      {messages.length === 0 && (
        <div className="text-center text-gray-400 mt-24">
          Hi, I’m <span className="text-green-500">DataWhiz</span> 👋
          <br />
          Ask me about your data or chat with AI
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
