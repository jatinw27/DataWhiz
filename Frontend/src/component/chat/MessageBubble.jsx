export default function MessageBubble({ text, sender, time, prevSender }) {
  const isUser = sender === "user";
  const isGrouped = sender === prevSender;

  return (
    <div
      className={`max-w-[75%] px-4 py-2 rounded-xl ${
        isUser
          ? "bg-blue-600 text-white ml-auto"
          : "bg-gray-800 text-gray-100"
      } ${isGrouped ? "mt-1" : "mt-4"}`}
    >
      <div>{text}</div>

      <div className="text-xs text-gray-300 text-right mt-1">
        {time}
      </div>
    </div>
  );
}
