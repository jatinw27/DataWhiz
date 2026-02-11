import { useState } from "react";
import { SendHorizonal } from "lucide-react";

export default function InputBar({ onSend, loading }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="relative">
      <div className="flex items-center bg-[#1a1a1a] border border-gray-700 rounded-2xl px-4 py-3 shadow-lg focus-within:border-green-500 transition">

        <textarea
          rows={1}
          placeholder="Ask DataWhiz anything..."
          className="flex-1 bg-transparent outline-none resize-none text-sm text-white placeholder-gray-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className={`ml-3 p-2 rounded-xl transition ${
            loading
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          <SendHorizonal size={18} />
        </button>
      </div>
    </div>
  );
}
