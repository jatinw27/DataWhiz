export default function ChatSessions({
  sessions,
  activeSessionId,
  setActiveSessionId,
  createNewSession,
}) {
  return (
    <aside className="w-64 bg-[#0b0b0b] border-r border-gray-800 flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={createNewSession}
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-sm font-medium"
        >
          + New Chat
        </button>
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto">
        {Object.values(sessions).map(session => (
          <div
            key={session.id}
            onClick={() => setActiveSessionId(session.id)}
            className={`px-4 py-3 cursor-pointer text-sm border-b border-gray-800 ${
              session.id === activeSessionId
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:bg-gray-900"
            }`}
          >
            {session.title}
          </div>
        ))}
      </div>
    </aside>
  );
}
