import MessageBubble from "./MessageBubble";

export default function ChatWindow({ messages, loading, bottomRef }) {
  return (
    <main className="flex-1 overflow-y-auto pt-20 pb-24 flex justify-center">
      <div className="w-full max-w-4xl px-4 flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400">
            Hi, I'm <span className="text-green-500">DataWhiz</span>
          </div>
        ) : (
          messages.map((m, i) => (
            <MessageBubble key={i} {...m} />
          ))
        )}

        {loading && (
          <div className="bg-gray-700 px-4 py-2 rounded-xl w-fit">
            DataWhiz is thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </main>
  );
}
