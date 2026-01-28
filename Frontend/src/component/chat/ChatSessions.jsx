import { useState } from "react";
import { Pencil, Trash } from "lucide-react";

export default function ChatSessions({
  sessions,
  activeSessionId,
  setActiveSessionId,
  createNewSession,
  renameSession,
  deleteSession,
}) {
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");

  return (
    <aside className="w-64 bg-[#0b0b0b] border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={createNewSession}
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded"
        >
          + New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {Object.values(sessions)
          .sort((a, b) => b.createdAt - a.createdAt)
          .map(session => (
            <div
              key={session.id}
              className={`group flex items-center px-3 py-2 text-sm cursor-pointer ${
                session.id === activeSessionId
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-900"
              }`}
              onClick={() => setActiveSessionId(session.id)}
            >
              {editingId === session.id ? (
                <input
                  autoFocus
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onBlur={() => {
                    renameSession(session.id, title);
                    setEditingId(null);
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      renameSession(session.id, title);
                      setEditingId(null);
                    }
                  }}
                  className="bg-transparent border-b border-gray-600 outline-none flex-1"
                />
              ) : (
                <span className="flex-1 truncate">{session.title}</span>
              )}

              <Pencil
                size={14}
                className="opacity-0 group-hover:opacity-100 ml-2"
                onClick={e => {
                  e.stopPropagation();
                  setEditingId(session.id);
                  setTitle(session.title);
                }}
              />

              <Trash
                size={14}
                className="opacity-0 group-hover:opacity-100 ml-2 text-red-400"
                onClick={e => {
                  e.stopPropagation();
                  deleteSession(session.id);
                }}
              />
            </div>
          ))}
      </div>
    </aside>
  );
}
