import Loader from "../Loader";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages, loading, bottomRef }) {
  return (
<main className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
      {messages.length === 0 && (
        <div className="text-center text-gray-400">
          Hi, I’m <span className="text-green-500">DataWhiz</span> 👋
        </div>
      )}

      {messages.map((msg, i) => (
  <MessageBubble
    key={i}
    {...msg}
    prevSender={messages[i - 1]?.sender}
  />
))}


      {loading && <Loader text="DataWhiz is thinking..." />}

      <div ref={bottomRef} />
    </main>
  );
}
