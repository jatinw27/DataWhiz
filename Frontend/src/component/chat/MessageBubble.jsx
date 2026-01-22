export default function MessageBubble({ text, sender, time, status, isGrouped }) {
  const isUser = sender === "user";

  return (
    <div
      className={`max-w-[80%] px-4 py-2 rounded-xl ${
        isGrouped ? "mt-1" : "mt-4"
      } ${
        isUser
          ? "bg-blue-600 text-white ml-auto"
          : "bg-gray-800 text-gray-100"
      }`}
    >
      <div className="text-sm">{text}</div>

      {/* Meta info */}
      <div className="text-[10px] text-gray-300 mt-1 text-right">
        {time}
        {isUser && status === "sending" && " • sending"}
        {isUser && status === "error" && " • failed"}
      </div>
    </div>
  );
}
