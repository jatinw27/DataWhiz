import { useState } from "react";

export default function InputBar({ onSend }) {
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <footer className="fixed bottom-0 w-full border-t border-gray-800 bg-[#0d0d0d]">
      <div className="max-w-4xl mx-auto p-3 flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          className="flex-1 bg-gray-900 px-4 py-2 rounded-full"
          placeholder="Ask DataWhiz..."
        />
        <button
          onClick={send}
          className="bg-green-600 px-4 rounded-full"
        >
          Send
        </button>
      </div>
    </footer>
  );
}
