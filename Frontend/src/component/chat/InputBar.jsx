import { useState } from "react";

export default function InputBar({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="bg-[#0d0d0d] px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <input
          className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-full outline-none"
          placeholder="Ask DataWhiz..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}
