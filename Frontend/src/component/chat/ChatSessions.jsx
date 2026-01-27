export default function ChatSessions({
  sessions,
  activeSessionId,
  setActiveSessionId,
  createNewSession,
  renameSession,
  deleteSession,
}) {
  return (
    <aside className="w-64 bg-[#0b0b0b] border-r border-gray-800 flex flex-col">

      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={createNewSession}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm"
        >
          + New Chat
        </button>
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto">
        {Object.values(sessions)
          .sort((a, b) => b.createdAt - a.createdAt)
          .map(session => (
            <div
              key={session.id}
              className={`group flex items-center justify-between px-4 py-3 border-b border-gray-800
                ${
                  session.id === activeSessionId
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-900"
                }`}
            >
              {/* Select chat */}
              <button
                onClick={() => setActiveSessionId(session.id)}
                className="flex-1 text-left text-sm truncate"
              >
                {session.title}
              </button>

              {/* Hover actions */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => {
                    const title = prompt("Rename chat", session.title);
                    if (title) renameSession(session.id, title);
                  }}
                  className="text-xs hover:text-white"
                >
                  ✏
                </button>

                <button
                  onClick={() => deleteSession(session.id)}
                  className="text-xs text-red-400 hover:text-red-500"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
      </div>
    </aside>
  );
}
