export default function MessageBubble({ text, sender }) {
  return (
    <div
      className={`px-4 py-2 rounded-xl max-w-[75%] ${
        sender === "user"
          ? "bg-blue-600 self-end"
          : "bg-gray-800 self-start"
      }`}
    >
      {text}
    </div>
  );
}
