import { useState } from "react";

export default function InputBar({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);        // 🔥 PASS TEXT
    setInput("");         // clear input
  };

  return (
    <div className="fixed bottom-0 left-0 w-full border-t border-gray-800 bg-[#0d0d0d]">
      <div className="max-w-4xl mx-auto flex px-4 py-3">
        <input
          className="flex-1 bg-transparent text-white outline-none"
          placeholder="Ask DataWhiz..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="ml-3 bg-green-600 px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
