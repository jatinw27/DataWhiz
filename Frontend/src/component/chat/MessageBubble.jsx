export default function MessageBubble({ text, sender, time }) {
  const isUser = sender === "user";

  return (
    <div className={`mb-4 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
        ${isUser
          ? "bg-blue-600 text-white rounded-br-sm"
          : "bg-gray-800 text-gray-100 rounded-bl-sm"}`}
      >
        <div>{text}</div>
        {time && (
          <div className="text-xs text-gray-400 mt-1 text-right">
            {time}
          </div>
        )}
      </div>
    </div>
  );
}
