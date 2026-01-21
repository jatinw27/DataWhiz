export default function MessageBubble({
  text,
  sender,
  time,
  status,
  mode,
  isGrouped,
}) {
  const isUser = sender === "user";

  return (
    <div
      className={`max-w-[75%] px-4 py-2 rounded-xl mb-1 ${
        isUser
          ? "bg-blue-600 text-white ml-auto"
          : "bg-gray-800 text-gray-100"
      } ${isGrouped ? "mt-1" : "mt-4"}`}
    >
      {mode && (
        <span className={`text-xs px-2 py-0.5 rounded-full mr-2 ${
          mode === "data"
            ? "bg-green-600 text-white"
            : "bg-purple-600 text-white"
        }`}>
          {mode === "data" ? "Data" : "AI"}
        </span>
      )}

      <div>{text}</div>

      {time && (
        <div className="text-xs opacity-60 mt-1 text-right">
          {time}
          {sender === "user" && status === "sending" && " • sending"}
          {sender === "user" && status === "failed" && (
            <span className="text-red-400"> • failed</span>
          )}
        </div>
      )}
    </div>
  );
}
