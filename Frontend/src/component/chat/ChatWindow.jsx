import { useState } from "react";
import { Send } from "lucide-react";

export default function InputBar({ onSend, loading }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="sticky bottom-0 w-full bg-[#0d0d0d]/80 backdrop-blur border-t border-gray-800">
      <div className="max-w-3xl mx-auto px-6 py-4">
        
        <div className="flex items-center bg-gray-900 border border-gray-700 rounded-2xl px-4 py-3 shadow-lg focus-within:border-green-500 transition-all">
          
          <input
            type="text"
            placeholder="Ask DataWhiz anything..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className={`ml-3 p-2 rounded-lg transition-all ${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            <Send size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
