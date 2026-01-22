import { useState } from "react";

export default function InputBar({ onSend, loading }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="border-t border-gray-800 bg-[#0d0d0d]">
      <div className="max-w-4xl mx-auto flex px-4 py-3">
        <input
          className="flex-1 bg-transparent text-white outline-none"
          placeholder="Ask DataWhiz..."
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className={`ml-3 px-4 rounded ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
