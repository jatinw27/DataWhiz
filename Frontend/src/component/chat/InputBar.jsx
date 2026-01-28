import { useState } from "react";

export default function InputBar({ onSend, loading }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#0d0d0d] border-t border-gray-800">
      <div className="max-w-4xl mx-auto flex items-center gap-3 px-4 py-4">
        <input
          className="flex-1 bg-gray-900 rounded-xl px-4 py-3 text-white outline-none placeholder-gray-400"
          placeholder="Ask DataWhiz..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={loading}
         className={`ml-3 px-4 rounded transition
    ${loading
      ? "bg-gray-600 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700"}
  `}
>
          Send
        </button>
      </div>
    </div>
  );
}
