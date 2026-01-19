export default function MessageBubble({ text, sender }) {
  const isUser = sender === "user";

  return (
    <div
      className={`max-w-[75%] px-4 py-2 rounded-xl mb-2 ${
        isUser
          ? "bg-blue-600 text-white ml-auto"
          : "bg-gray-800 text-gray-100"
      }`}
    >
      {text}
    </div>
  );
}
