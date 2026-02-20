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
    <aside className="h-full bg-white dark:bg-[#0d0d0d] border-r border-gray-200 dark:border-gray-800 flex flex-col">
      
      <div className="p-4">
        <button
          onClick={createNewSession}
          className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-2.5 font-medium shadow-sm"
        >
          + New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {Object.values(sessions)
          .sort((a, b) => b.createdAt - a.createdAt)
          .map(session => {
            const active = session.id === activeSessionId;

            return (
              <div
                key={session.id}
                onClick={() => setActiveSessionId(session.id)}
                className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                ${active
                  ? "bg-green-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {editingId === session.id ? (
                  <input
                    autoFocus
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onBlur={() => setEditingId(null)}
                    onKeyDown={e => e.key === "Enter" && renameSession(session.id, title)}
                    className="bg-transparent border-b outline-none flex-1 text-sm"
                  />
                ) : (
                  <span className="flex-1 truncate text-sm">{session.title}</span>
                )}

                <Pencil
                  size={14}
                  className="opacity-0 group-hover:opacity-100"
                  onClick={e => {
                    e.stopPropagation();
                    setEditingId(session.id);
                    setTitle(session.title);
                  }}
                />

                <Trash
                  size={14}
                  className="opacity-0 group-hover:opacity-100 text-red-400"
                  onClick={e => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                />
              </div>
            );
          })}
      </div>
    </aside>
  );
}