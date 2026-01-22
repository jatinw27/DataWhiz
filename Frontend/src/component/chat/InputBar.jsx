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
      <div className="max-w-4xl mx-auto flex items-center px-4 py-3">
        <input
          className="flex-1 bg-transparent text-white outline-none placeholder-gray-500"
          placeholder="Ask DataWhiz..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="ml-3 bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}
