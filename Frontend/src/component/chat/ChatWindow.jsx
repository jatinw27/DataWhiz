import Loader from "../Loader";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages, loading, bottomRef }) {
  return (
    <div className="flex-1 overflow-y-auto scroll-smooth">
      {/* Background gradient */}
      <div className="min-h-full bg-gradient-to-b from-[#0d0d0d] via-[#111] to-[#0d0d0d]">
        
        {/* Centered container */}
        <div className="max-w-3xl mx-auto px-6 py-8">
          
          {/* EMPTY STATE */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-32 text-center text-gray-400">
              <div className="text-4xl mb-4">🤖</div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Welcome to DataWhiz
              </h2>
              <p className="text-sm max-w-md">
                Ask questions about your data or chat with AI.
                Start by typing below.
              </p>
            </div>
          )}

          {/* MESSAGES */}
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

          {/* LOADER */}
          {loading && (
            <div className="mt-4">
              <Loader text="DataWhiz is thinking..." />
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
