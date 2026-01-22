import Loader from "../Loader";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages, loading, bottomRef }) {
  return (
    <main className="flex-1 overflow-y-auto px-6 py-6 pb-32 scroll-smooth">
      {messages.length === 0 && (
        <div className="text-center text-gray-400 mt-24">
          Hi, I’m <span className="text-green-500">DataWhiz</span> 👋
          <div className="text-sm mt-2 text-gray-500">
            Ask questions about your data or chat with AI
          </div>
        </div>
      )}

      {messages.map((msg, i) => (
        <MessageBubble key={i} {...msg} />
      ))}

      {loading && <Loader text="DataWhiz is thinking..." />}

      <div ref={bottomRef} />
    </main>
  );
}
