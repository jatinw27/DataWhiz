import TypingIndicator from "./TypingIndicator.jsx";
import MessageBubble from "./MessageBubble.jsx";

export default function ChatWindow({ messages, loading, bottomRef }) {
  
  return (
   <main className="px-6 py-8 scroll-smooth">
      {messages.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          Hi, I’m <span className="text-green-500">DataWhiz</span> 👋
        </div>
      )}

      {messages.map((msg, i) => {
        const prev = messages[i - 1];
        const isGrouped = prev && prev.sender === msg.sender;


        return (
          <MessageBubble
  key={i}
  text={msg.text}
  sender={msg.sender}
  data={msg.data}
  chart={msg.chart}
  time={msg.time}
  status={msg.status}
  isGrouped={msg.isGrouped}
/>
        );
      })}
      
      {loading && <TypingIndicator />}

      <div ref={bottomRef} />
    </main>
  );
}
